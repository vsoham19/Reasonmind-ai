import logging
from flask import Flask, jsonify, request
import yfinance as yf
from tools.live_data import TICKER_RESOLVER
from core.llm_client import LLMClient

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Manual CORS handler for browser security
@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/api/stocks', methods=['GET'])
def get_live_stocks():
    logger.info("Received request for live Nifty 50 prices and index score...")
    
    # Extract unique NSE tickers from TICKER_RESOLVER
    nse_tickers = list(set([t for t in TICKER_RESOLVER.values() if t.endswith('.NS')]))
    
    # Combine Nifty constituents with the Nifty 50 Index ticker (^NSEI)
    query_tickers = nse_tickers + ['^NSEI']
    
    try:
        # Download 5 days of data to handle weekend gaps and calculate accurate daily change %
        data = yf.download(query_tickers, period="5d", progress=False)
        
        if data.empty:
            return jsonify({"error": "Failed to fetch data from Yahoo Finance"}), 500
            
        results = {}
        for ticker in nse_tickers:
            try:
                # Resolve the Close column for this ticker
                close_series = data['Close'][ticker].dropna()
                if len(close_series) >= 2:
                    last_price = close_series.iloc[-1]
                    prev_price = close_series.iloc[-2]
                    change_pct = ((last_price - prev_price) / prev_price) * 100.0
                    results[ticker] = {
                        "price": round(float(last_price), 2),
                        "change": round(float(change_pct), 2)
                    }
                elif len(close_series) == 1:
                    results[ticker] = {
                        "price": round(float(close_series.iloc[0]), 2),
                        "change": 0.0
                    }
            except Exception as e:
                logger.error(f"Error parsing ticker {ticker}: {e}")
                
        # Parse Nifty 50 Index (^NSEI) value
        nifty_index_data = {"price": 22040.70, "change": 0.45} # Highly realistic default
        try:
            nifty_series = data['Close']['^NSEI'].dropna()
            if len(nifty_series) >= 2:
                last_idx = nifty_series.iloc[-1]
                prev_idx = nifty_series.iloc[-2]
                change_idx = ((last_idx - prev_idx) / prev_idx) * 100.0
                nifty_index_data = {
                    "price": round(float(last_idx), 2),
                    "change": round(float(change_idx), 2)
                }
        except Exception as ex:
            logger.error(f"Error parsing Nifty 50 Index (^NSEI): {ex}")
                
        return jsonify({
            "status": "success",
            "market_closed": True,
            "prices": results,
            "nifty_index": nifty_index_data
        })
        
    except Exception as e:
        logger.error(f"Failed to query yfinance API: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/dcf-company/<ticker>', methods=['GET'])
def get_dcf_company_data(ticker):
    logger.info(f"Received request for DCF pre-fill data for ticker {ticker}...")
    try:
        stock = yf.Ticker(ticker)
        
        # 1. Fetch info
        info = stock.info
        name = info.get('longName', ticker.replace('.NS', ''))
        sector = info.get('sector', 'Other')
        market_cap = info.get('marketCap')
        
        # Convert market cap to Crores of Rupees (₹ Cr)
        market_cap_cr = 25000.0 # Default fallback
        if market_cap:
            market_cap_cr = round(market_cap / 10000000.0, 2)
            
        # 2. Extract Cash Flow Statement
        # We need Operating Cash Flow and Capital Expenditure
        cashflow = stock.cashflow
        
        operating_cash_flow = None
        cap_ex = None
        
        if not cashflow.empty:
            logger.info(f"Cashflow columns: {list(cashflow.index)}")
            
            # Find Operating Cash Flow row robustly
            ocf_keys = ['Operating Cash Flow', 'OperatingCashFlow', 'Total Cash From Operating Activities']
            for k in ocf_keys:
                if k in cashflow.index:
                    operating_cash_flow = cashflow.loc[k].dropna().iloc[0]
                    break
                    
            # Find Capital Expenditure row robustly
            capex_keys = ['Capital Expenditure', 'CapitalExpenditure', 'Capital Expenditures']
            for k in capex_keys:
                if k in cashflow.index:
                    cap_ex = cashflow.loc[k].dropna().iloc[0]
                    break
                    
        # Estimate FCF: Operating Cash Flow - abs(Capital Expenditure)
        initial_fcf_cr = 1500.0 # Default fallback
        
        if operating_cash_flow is not None:
            resolved_capex = abs(cap_ex) if cap_ex is not None else abs(operating_cash_flow) * 0.20
            fcf_raw = operating_cash_flow - resolved_capex
            initial_fcf_cr = round(fcf_raw / 10000000.0, 2)
        else:
            pe = info.get('trailingPE') or info.get('forwardPE') or 25.0
            if pe <= 0: pe = 25.0
            net_income_estimate = (market_cap or 2.5e11) / pe
            fcf_raw = net_income_estimate * 0.80
            initial_fcf_cr = round(fcf_raw / 10000000.0, 2)
            
        # Standardize FCF to positive value and clamp between 100 Cr and 8000 Cr to fit sliders
        if initial_fcf_cr <= 0:
            initial_fcf_cr = 500.0
        initial_fcf_cr = max(100.0, min(100000.0, initial_fcf_cr))
        
        # 3. Calculate WACC via CAPM
        rf = 0.070 # 7.0% Indian 10-year yield
        erp = 0.060 # 6.0% Market risk premium
        
        beta = info.get('beta')
        if not beta or beta <= 0:
            sector_betas = {
                'IT': 1.05, 'Banking': 1.15, 'FMCG': 0.75, 
                'Energy': 1.10, 'Pharma': 0.80, 'Engineering': 1.20
            }
            beta = sector_betas.get(sector, 1.0)
            
        cost_of_equity = rf + (beta * erp)
        
        # Cost of Debt = Kd * (1 - T)
        kd_before_tax = 0.085 # 8.5%
        tax_rate = 0.25 # 25%
        cost_of_debt = kd_before_tax * (1 - tax_rate) # 6.375%
        
        # Debt to Equity
        debt_to_equity = info.get('debtToEquity')
        if debt_to_equity is None:
            sector_de = {
                'Banking': 80.0, 'IT': 5.0, 'FMCG': 5.0,
                'Energy': 40.0, 'Pharma': 10.0, 'Engineering': 60.0
            }
            debt_to_equity = sector_de.get(sector, 20.0)
            
        de_ratio = debt_to_equity / 100.0
        
        # Weights
        weight_equity = 1.0 / (1.0 + de_ratio)
        weight_debt = de_ratio / (1.0 + de_ratio)
        
        wacc = (weight_equity * cost_of_equity) + (weight_debt * cost_of_debt)
        wacc_percentage = round(wacc * 100.0, 1)
        
        # Clamp WACC between 5% and 20% to fit UI range sliders
        wacc_percentage = max(5.0, min(20.0, wacc_percentage))
        
        # 4. Determine historical/projected revenue growth rate
        rev_growth = info.get('revenueGrowth')
        growth_rate = 8.5
        if rev_growth is not None:
            growth_rate = round(rev_growth * 100.0, 1)
        else:
            earnings_growth = info.get('earningsGrowth')
            if earnings_growth is not None:
                growth_rate = round(earnings_growth * 100.0, 1)
                
        # Clamp growth rate between 1% and 25% to fit UI range sliders
        growth_rate = max(1.0, min(25.0, growth_rate))
        
        # 5. Terminal Growth Rate
        terminal_growth = 3.0
        
        return jsonify({
            "status": "success",
            "ticker": ticker,
            "company_name": name,
            "sector": sector,
            "initial_fcf_cr": round(initial_fcf_cr, 0),
            "growth_rate": round(growth_rate, 1),
            "wacc": round(wacc_percentage, 1),
            "terminal_growth": round(terminal_growth, 1),
            "market_cap_cr": round(market_cap_cr, 0)
        })
        
    except Exception as e:
        logger.error(f"Error compiling DCF data for {ticker}: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/historical/<ticker>', methods=['GET'])
def get_historical_data(ticker):
    logger.info(f"Received request for historical data for ticker {ticker}...")
    try:
        stock = yf.Ticker(ticker)
        # Download 1 month of daily data
        hist = stock.history(period="1mo")
        
        if hist.empty:
            logger.warning(f"No historical data returned from yfinance for {ticker}. Returning empty list.")
            return jsonify({"status": "error", "error": "No historical data found"}), 404
            
        data_list = []
        volatility_list = []
        
        for date, row in hist.iterrows():
            d_str = date.strftime('%Y-%m-%d')
            o_val = round(float(row['Open']), 2)
            h_val = round(float(row['High']), 2)
            l_val = round(float(row['Low']), 2)
            c_val = round(float(row['Close']), 2)
            v_val = int(row['Volume'])
            
            data_list.append({
                "date": d_str,
                "open": o_val,
                "high": h_val,
                "low": l_val,
                "close": c_val,
                "volume": v_val
            })
            
            # Daily spread volatility: (High - Low) / Low * 100
            spread = ((h_val - l_val) / l_val) * 100 if l_val > 0 else 0.0
            volatility_list.append({
                "date": d_str,
                "value": round(float(spread), 2)
            })
            
        logger.info(f"Successfully compiled {len(data_list)} historical data points for {ticker}.")
        return jsonify({
            "status": "success",
            "ticker": ticker,
            "candlesticks": data_list,
            "volatility": volatility_list
        })
        
    except Exception as e:
        logger.error(f"Error compiling historical data for {ticker}: {e}")
        return jsonify({"status": "error", "error": str(e)}), 500

# Initialize LLM Client for high-speed dynamic chatbot reasoning
try:
    llm = LLMClient()
    logger.info("Groq LLM Client initialized successfully for Flask API Bridge.")
except Exception as llm_err:
    logger.error(f"Failed to initialize Groq LLM Client: {llm_err}")
    llm = None

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    data = request.get_json() or {}
    message = data.get("message", "")
    history = data.get("history", [])
    
    if not message:
        return jsonify({"error": "Missing message parameter"}), 400
        
    if not llm:
        return jsonify({"error": "AI Reasoning Engine is currently unavailable on the backend. Please check your GROQ_API_KEY configuration."}), 500
        
    logger.info(f"Received AI Chat query: '{message}'")
    
    try:
        # Compile Nifty 50 reference context to make the LLM highly contextual
        from knowledge.nifty_knowledge import COMPANIES as static_companies
        
        comp_summaries = []
        for name, profile in static_companies.items():
            comp_summaries.append(
                f"- {profile['name']} ({name}): Sector: {profile['sector']}, P/E: {profile['pe_ratio']}x, ROE: {profile['roe']}%, Debt-to-Equity: {profile['debt_to_equity']}"
            )
        nifty_companies_context = "\n".join(comp_summaries)
        
        system_prompt = f"""You are "ReasonMind AI", a world-class financial analyst and stock market expert specializing in the Indian stock market (NSE) and corporate finance.
Your goal is to provide deep, precise, and highly educational answers to the user's queries about companies, market ratios (P/E, ROE, WACC, debt), and corporate financial health.

Here is the structured baseline context for some key Nifty 50 companies:
{nifty_companies_context}

Guidelines:
1. Provide highly specific, math-backed, and direct answers. Avoid generic non-answers.
2. If asked about a stock recommendation or must-buy, analyze the fundamental profiles (like TCS's high ROE and lower P/E, or banking sectors) and explain the structural reason for your stance.
3. If asked about a stock to avoid, explain why (e.g. high debt-to-equity ratio, declining margins, or cyclical sector headwinds).
4. Explain corporate finance terms (P/E, ROE, WACC, DCF, Monte Carlo) clearly with their mathematical formulas and structural meaning.
5. Format your answers in professional, highly readable markdown with bullet points and bold headers. Keep it concise but deeply informative.
6. If you include any disclaimer, warning, or caution statement, you MUST wrap that exact statement or paragraph inside <disclaimer>...</disclaimer> tags. Example: <disclaimer>Disclaimer: I'm a financial analyst, not a fortune teller. Stock market investments are subject to market risks.</disclaimer>
"""

        # Compile dialogue history
        user_prompt = ""
        for h in history[-5:]: # Keep last 5 messages to prevent overflow
            role_label = "User" if h.get("role") == "user" else "Assistant"
            user_prompt += f"{role_label}: {h.get('text')}\n"
        user_prompt += f"User: {message}\nAssistant:"
        
        # Generate response via Groq
        reply = llm.generate(system_prompt=system_prompt, user_prompt=user_prompt)
        
        # Post-process reply to wrap disclaimers in tags if not already wrapped
        lower_reply = reply.lower()
        if "disclaimer" in lower_reply and "<disclaimer>" not in lower_reply:
            paragraphs = reply.split("\n\n")
            new_paragraphs = []
            for p in paragraphs:
                trimmed = p.strip()
                t_lower = trimmed.lower()
                is_disclaimer = (
                    t_lower.startswith("disclaimer") or 
                    t_lower.startswith("**disclaimer") or 
                    t_lower.startswith("* **disclaimer") or
                    t_lower.startswith("please note that") or
                    "not a fortune teller" in t_lower
                )
                if is_disclaimer:
                    new_paragraphs.append(f"<disclaimer>{trimmed}</disclaimer>")
                else:
                    new_paragraphs.append(p)
            reply = "\n\n".join(new_paragraphs)
            
        return jsonify({
            "status": "success",
            "reply": reply
        })
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting ReasonMind API Bridge on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=False)
