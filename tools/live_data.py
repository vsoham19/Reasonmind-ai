import yfinance as yf
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

# Core mapping for supported Nifty 50 stocks
TICKER_RESOLVER = {
    # Nifty 50 constituents
    "reliance": "RELIANCE.NS",
    "reliance industries": "RELIANCE.NS",
    "tcs": "TCS.NS",
    "tata consultancy": "TCS.NS",
    "infosys": "INFY.NS",
    "hdfc bank": "HDFCBANK.NS",
    "hdfc": "HDFCBANK.NS",
    "icici bank": "ICICIBANK.NS",
    "icici": "ICICIBANK.NS",
    "state bank of india": "SBIN.NS",
    "sbi": "SBIN.NS",
    "bharti airtel": "BHARTIARTL.NS",
    "airtel": "BHARTIARTL.NS",
    "l&t": "LT.NS",
    "larsen": "LT.NS",
    "larsen & toubro": "LT.NS",
    "itc": "ITC.NS",
    "hul": "HINDUNILVR.NS",
    "hindustan unilever": "HINDUNILVR.NS",
    "axis bank": "AXISBANK.NS",
    "axis": "AXISBANK.NS",
    "kotak bank": "KOTAKBANK.NS",
    "kotak mahindra": "KOTAKBANK.NS",
    "kotak": "KOTAKBANK.NS",
    "adports": "ADANIPORTS.NS",
    "adani ports": "ADANIPORTS.NS",
    "adani enterprises": "ADANIENT.NS",
    "adanient": "ADANIENT.NS",
    "asian paints": "ASIANPAINT.NS",
    "asianpaints": "ASIANPAINT.NS",
    "apollo hospitals": "APOLLOHOSP.NS",
    "apollohosp": "APOLLOHOSP.NS",
    "bajaj auto": "BAJAJ-AUTO.NS",
    "bajajauto": "BAJAJ-AUTO.NS",
    "bajaj finance": "BAJFINANCE.NS",
    "bajajfinance": "BAJFINANCE.NS",
    "bajaj finserv": "BAJAJFINSV.NS",
    "bajajfinserv": "BAJAJFINSV.NS",
    "bel": "BEL.NS",
    "bharat electronics": "BEL.NS",
    "cipla": "CIPLA.NS",
    "coal india": "COALINDIA.NS",
    "coalindia": "COALINDIA.NS",
    "dr reddy": "DRREDDY.NS",
    "dr. reddy": "DRREDDY.NS",
    "eicher motors": "EICHERMOT.NS",
    "eichermot": "EICHERMOT.NS",
    "grasim": "GRASIM.NS",
    "grasim industries": "GRASIM.NS",
    "hcl tech": "HCLTECH.NS",
    "hcl technologies": "HCLTECH.NS",
    "hdfc life": "HDFCLIFE.NS",
    "hdfclife": "HDFCLIFE.NS",
    "hindalco": "HINDALCO.NS",
    "indigo": "INDIGO.NS",
    "interglobe aviation": "INDIGO.NS",
    "jio financial": "JIOFIN.NS",
    "jiofin": "JIOFIN.NS",
    "jsw steel": "JSWSTEEL.NS",
    "jswsteel": "JSWSTEEL.NS",
    "m&m": "M&M.NS",
    "mahindra": "M&M.NS",
    "maruti": "MARUTI.NS",
    "maruti suzuki": "MARUTI.NS",
    "nestle": "NESTLEIND.NS",
    "nestle india": "NESTLEIND.NS",
    "ntpc": "NTPC.NS",
    "ongc": "ONGC.NS",
    "power grid": "POWERGRID.NS",
    "powergrid": "POWERGRID.NS",
    "sbi life": "SBILIFE.NS",
    "sbilife": "SBILIFE.NS",
    "shriram finance": "SHRIRAMFIN.NS",
    "sun pharma": "SUNPHARMA.NS",
    "sun pharmaceutical": "SUNPHARMA.NS",
    "tata consumer": "TATACONSUM.NS",
    "tata motors": "TATAMOTORS.NS",
    "tatamotors": "TATAMOTORS.NS",
    "tata steel": "TATASTEEL.NS",
    "tatasteel": "TATASTEEL.NS",
    "tech mahindra": "TECHM.NS",
    "techm": "TECHM.NS",
    "titan": "TITAN.NS",
    "trent": "TRENT.NS",
    "ultratech": "ULTRACEMCO.NS",
    "ultratech cement": "ULTRACEMCO.NS",
    "wipro": "WIPRO.NS",
    
    # Global technology giants
    "apple": "AAPL",
    "microsoft": "MSFT",
    "google": "GOOGL",
    "alphabet": "GOOGL",
    "amazon": "AMZN",
    "meta": "META",
    "tesla": "TSLA",
    "nvidia": "NVDA"
}

# Sector defaults when yfinance info is incomplete or for benchmarking fallback
SECTOR_BENCHMARKS = {
    "it": {"risk_level": "Medium", "cyclical_or_defensive": "Cyclical", "avg_pe": 28.0},
    "technology": {"risk_level": "Medium", "cyclical_or_defensive": "Cyclical", "avg_pe": 32.0},
    "banking": {"risk_level": "Medium", "cyclical_or_defensive": "Cyclical", "avg_pe": 18.0},
    "financial services": {"risk_level": "Medium", "cyclical_or_defensive": "Cyclical", "avg_pe": 18.0},
    "fmcg": {"risk_level": "Low", "cyclical_or_defensive": "Defensive", "avg_pe": 38.0},
    "consumer defensive": {"risk_level": "Low", "cyclical_or_defensive": "Defensive", "avg_pe": 35.0},
    "energy": {"risk_level": "Medium", "cyclical_or_defensive": "Cyclical", "avg_pe": 22.0},
    "oil & gas": {"risk_level": "Medium", "cyclical_or_defensive": "Cyclical", "avg_pe": 15.0},
    "pharma": {"risk_level": "Low", "cyclical_or_defensive": "Defensive", "avg_pe": 30.0},
    "healthcare": {"risk_level": "Low", "cyclical_or_defensive": "Defensive", "avg_pe": 28.0},
    "engineering": {"risk_level": "High", "cyclical_or_defensive": "Cyclical", "avg_pe": 35.0},
    "industrials": {"risk_level": "High", "cyclical_or_defensive": "Cyclical", "avg_pe": 28.0}
}

def resolve_ticker(company_name: str) -> str:
    """
    Resolves a friendly company name or code to a yfinance ticker symbol.
    """
    clean_name = company_name.strip().lower()
    
    # Check direct dictionary lookup
    if clean_name in TICKER_RESOLVER:
        return TICKER_RESOLVER[clean_name]
    
    # Try fuzzy checking
    for key, ticker in TICKER_RESOLVER.items():
        if key in clean_name or clean_name in key:
            return ticker
            
    # Default: assume the user input itself is the ticker (e.g. AAPL, Reliance.NS)
    # If it is alphabetic and short, capitalize it.
    if len(clean_name) <= 6 and clean_name.isalpha():
        return company_name.upper()
    return company_name

def fetch_live_metrics(company_name: str) -> Dict[str, Any]:
    """
    Queries yfinance to fetch fundamental ratios and information for a company.
    """
    ticker_symbol = resolve_ticker(company_name)
    logger.info(f"Querying yfinance for resolved ticker: {ticker_symbol}")
    
    try:
        ticker = yf.Ticker(ticker_symbol)
        info = ticker.info
        
        if not info or len(info) <= 5:
            # If yfinance returned empty/invalid dict, raise error to trigger fallback
            raise ValueError("Incomplete info structure returned from yfinance.")
            
        # Parse sector & determine canonical sector name
        raw_sector = info.get("sector", "Other")
        sector_lower = raw_sector.lower()
        if "tech" in sector_lower:
            sector = "IT"
        elif "bank" in sector_lower or "financial" in sector_lower:
            sector = "Banking"
        elif "defensive" in sector_lower or "fmcg" in sector_lower or "consumer pack" in sector_lower:
            sector = "FMCG"
        elif "energy" in sector_lower or "oil" in sector_lower or "gas" in sector_lower:
            sector = "Energy"
        elif "pharma" in sector_lower or "health" in sector_lower or "drug" in sector_lower:
            sector = "Pharma"
        elif "industrial" in sector_lower or "engineer" in sector_lower or "machinery" in sector_lower:
            sector = "Engineering"
        else:
            sector = raw_sector
            
        # P/E Ratio parsing
        pe_ratio = info.get("trailingPE") or info.get("forwardPE")
        if not pe_ratio:
            # Try computing from marketCap/netIncome if available
            market_cap_val = info.get("marketCap")
            net_income = info.get("netIncomeToCommon")
            if market_cap_val and net_income and net_income > 0:
                pe_ratio = market_cap_val / net_income
            else:
                pe_ratio = 25.0 # Sensible default if unavailable
                
        # Debt-to-Equity parsing
        debt_to_equity = info.get("debtToEquity")
        if debt_to_equity is not None:
            # yfinance returns debtToEquity in percentage (e.g. 35.0 for 0.35)
            # If it's a bank, it can naturally be higher.
            if debt_to_equity > 5.0:
                debt_to_equity = debt_to_equity / 100.0
        else:
            debt_to_equity = 0.05 # Safe default
            
        # ROE (Return on Equity) parsing
        roe = info.get("returnOnEquity")
        if roe is not None:
            # yfinance returns ROE as decimal fraction (e.g. 0.395 for 39.5%)
            roe = roe * 100.0
        else:
            roe = 15.0 # Standard corporate default
            
        # Revenue Growth parsing
        rev_growth = info.get("revenueGrowth")
        if rev_growth is not None:
            # yfinance returns growth as decimal fraction (e.g. 0.085 for 8.5%)
            rev_growth = rev_growth * 100.0
        else:
            rev_growth = 8.0 # Standard growth default
            
        # Dividend Yield parsing
        div_yield = info.get("dividendYield")
        if div_yield is not None:
            div_yield = div_yield * 100.0
        else:
            div_yield = 0.5
            
        # Market Cap formatting
        raw_cap = info.get("marketCap")
        currency = info.get("currency", "INR")
        if raw_cap:
            if currency == "INR":
                # Convert to Crores
                market_cap = f"{raw_cap / 10000000:,.2f} Cr"
            else:
                # Convert to Billions (USD/others)
                market_cap = f"{currency} {raw_cap / 1000000000:,.2f} B"
        else:
            market_cap = "N/A"
            
        return {
            "id": ticker_symbol.replace(".", "_").lower(),
            "name": info.get("longName") or info.get("shortName") or company_name,
            "sector": sector,
            "pe_ratio": round(pe_ratio, 2),
            "debt_to_equity": round(debt_to_equity, 2),
            "roe": round(roe, 2),
            "revenue_growth": round(rev_growth, 2),
            "market_cap": market_cap,
            "dividend_yield": round(div_yield, 2),
            "currency": currency,
            "live_fetched": True
        }
    except Exception as e:
        logger.error(f"Error fetching live metrics for '{company_name}' ({ticker_symbol}): {e}")
        return {"error": str(e)}

def fetch_live_sector_benchmark(sector_name: str) -> Dict[str, Any]:
    """
    Computes a dynamically resolved sector benchmark.
    """
    clean_sector = sector_name.lower().strip()
    
    # Try dynamic aggregation by mapping a few major sector peers
    peers_map = {
        "it": ["TCS.NS", "INFY.NS", "WIPRO.NS", "HCLTECH.NS"],
        "banking": ["HDFCBANK.NS", "ICICIBANK.NS", "SBIN.NS", "AXISBANK.NS"],
        "fmcg": ["HINDUNILVR.NS", "ITC.NS", "NESTLEIND.NS", "BRITANNIA.NS"],
        "energy": ["RELIANCE.NS", "ONGC.NS", "POWERGRID.NS", "NTPC.NS"],
        "pharma": ["SUNPHARMA.NS", "CIPLA.NS", "DRREDDY.NS"],
        "engineering": ["LT.NS", "SIEMENS.NS", "ABB.NS"]
    }
    
    # Identify key sector keyword
    matching_sector = None
    for k in peers_map.keys():
        if k in clean_sector:
            matching_sector = k
            break
            
    if matching_sector:
        tickers = peers_map[matching_sector]
        pes = []
        for t in tickers:
            try:
                info = yf.Ticker(t).info
                pe = info.get("trailingPE") or info.get("forwardPE")
                if pe: pes.append(pe)
            except Exception:
                pass
        
        if pes:
            avg_pe = sum(pes) / len(pes)
            # Find default static risk metadata
            static_meta = SECTOR_BENCHMARKS.get(matching_sector, {"risk_level": "Medium", "cyclical_or_defensive": "Cyclical"})
            return {
                "sector_name": sector_name,
                "avg_pe": round(avg_pe, 2),
                "risk_level": static_meta["risk_level"],
                "cyclical_or_defensive": static_meta["cyclical_or_defensive"],
                "dynamic_aggregated": True,
                "peers_analyzed": len(pes)
            }

    # Fallback to static sector benchmark dictionary
    for name, data in SECTOR_BENCHMARKS.items():
        if name in clean_sector:
            return {"sector_name": sector_name, **data, "dynamic_aggregated": False}
            
    # Universal fallback
    return {
        "sector_name": sector_name,
        "avg_pe": 25.0,
        "risk_level": "Medium",
        "cyclical_or_defensive": "Cyclical",
        "dynamic_aggregated": False
    }
