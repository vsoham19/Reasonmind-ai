import yfinance as yf

nifty_constituents = [
  { "name": "Reliance Industries", "ticker": "RELIANCE.NS", "sector": "Energy", "weight": "10.4%", "basePrice": 2450.25, "change": 1.45 },
  { "name": "HDFC Bank", "ticker": "HDFCBANK.NS", "sector": "Banking", "weight": "9.8%", "basePrice": 1420.50, "change": -0.65 },
  { "name": "ICICI Bank", "ticker": "ICICIBANK.NS", "sector": "Banking", "weight": "7.9%", "basePrice": 906.40, "change": 1.20 },
  { "name": "Infosys", "ticker": "INFY.NS", "sector": "IT", "weight": "5.8%", "basePrice": 1540.15, "change": -1.10 },
  { "name": "Larsen & Toubro", "ticker": "LT.NS", "sector": "Engineering", "weight": "4.4%", "basePrice": 3420.00, "change": 0.85 },
  { "name": "TCS", "ticker": "TCS.NS", "sector": "IT", "weight": "4.2%", "basePrice": 3820.60, "change": 1.15 },
  { "name": "ITC", "ticker": "ITC.NS", "sector": "FMCG", "weight": "3.8%", "basePrice": 412.30, "change": -0.30 },
  { "name": "Hindustan Unilever", "ticker": "HINDUNILVR.NS", "sector": "FMCG", "weight": "2.7%", "basePrice": 2360.90, "change": 0.40 },
  { "name": "Axis Bank", "ticker": "AXISBANK.NS", "sector": "Banking", "weight": "2.5%", "basePrice": 980.50, "change": 1.10 },
  { "name": "State Bank of India", "ticker": "SBIN.NS", "sector": "Banking", "weight": "2.4%", "basePrice": 620.10, "change": -1.35 },
  { "name": "Bharti Airtel", "ticker": "BHARTIARTL.NS", "sector": "Telecom", "weight": "2.3%", "basePrice": 1120.75, "change": 2.10 },
  { "name": "Kotak Mahindra Bank", "ticker": "KOTAKBANK.NS", "sector": "Banking", "weight": "2.2%", "basePrice": 1740.20, "change": -0.90 },
  { "name": "Tata Motors", "ticker": "TATAMOTORS.NS", "sector": "Automobile", "weight": "1.9%", "basePrice": 920.40, "change": 1.65 },
  { "name": "Sun Pharma", "ticker": "SUNPHARMA.NS", "sector": "Pharma", "weight": "1.5%", "basePrice": 1510.30, "change": 0.55 },
  { "name": "NTPC", "ticker": "NTPC.NS", "sector": "Energy", "weight": "1.4%", "basePrice": 312.45, "change": -0.75 },
  { "name": "Maruti Suzuki", "ticker": "MARUTI.NS", "sector": "Automobile", "weight": "1.3%", "basePrice": 11200.00, "change": 0.25 },
  { "name": "HCL Technologies", "ticker": "HCLTECH.NS", "sector": "IT", "weight": "1.2%", "basePrice": 1390.80, "change": -1.05 },
  { "name": "Power Grid", "ticker": "POWERGRID.NS", "sector": "Energy", "weight": "1.1%", "basePrice": 265.30, "change": 0.65 },
  { "name": "UltraTech Cement", "ticker": "ULTRACEMCO.NS", "sector": "Materials", "weight": "1.0%", "basePrice": 9680.00, "change": -0.45 },
  { "name": "Titan Company", "ticker": "TITAN.NS", "sector": "Consumer Durables", "weight": "0.9%", "basePrice": 3410.50, "change": 1.30 },
  { "name": "Adani Enterprises", "ticker": "ADANIENT.NS", "sector": "Diversified", "weight": "0.9%", "basePrice": 3150.00, "change": 0.70 },
  { "name": "Adani Ports", "ticker": "ADANIPORTS.NS", "sector": "Infrastructure", "weight": "0.8%", "basePrice": 1250.00, "change": -0.50 },
  { "name": "Apollo Hospitals", "ticker": "APOLLOHOSP.NS", "sector": "Healthcare", "weight": "0.8%", "basePrice": 5920.00, "change": 1.25 },
  { "name": "Asian Paints", "ticker": "ASIANPAINT.NS", "sector": "Consumer Goods", "weight": "0.8%", "basePrice": 2840.00, "change": -0.95 },
  { "name": "Bajaj Auto", "ticker": "BAJAJ-AUTO.NS", "sector": "Automobile", "weight": "0.8%", "basePrice": 8250.00, "change": 1.40 },
  { "name": "Bajaj Finance", "ticker": "BAJFINANCE.NS", "sector": "Financial Services", "weight": "0.8%", "basePrice": 6850.00, "change": -0.80 },
  { "name": "Bajaj Finserv", "ticker": "BAJAJFINSV.NS", "sector": "Financial Services", "weight": "0.7%", "basePrice": 1580.00, "change": -0.20 },
  { "name": "Bharat Electronics", "ticker": "BEL.NS", "sector": "Engineering", "weight": "0.7%", "basePrice": 195.00, "change": 2.30 },
  { "name": "Cipla", "ticker": "CIPLA.NS", "sector": "Pharma", "weight": "0.7%", "basePrice": 1350.00, "change": 0.60 },
  { "name": "Coal India", "ticker": "COALINDIA.NS", "sector": "Energy", "weight": "0.7%", "basePrice": 410.00, "change": -0.55 },
  { "name": "Dr. Reddy's", "ticker": "DRREDDY.NS", "sector": "Pharma", "weight": "0.6%", "basePrice": 6120.00, "change": 0.90 },
  { "name": "Eicher Motors", "ticker": "EICHERMOT.NS", "sector": "Automobile", "weight": "0.6%", "basePrice": 3950.00, "change": -1.05 },
  { "name": "Grasim Industries", "ticker": "GRASIM.NS", "sector": "Materials", "weight": "0.6%", "basePrice": 2180.00, "change": 0.35 },
  { "name": "HDFC Life", "ticker": "HDFCLIFE.NS", "sector": "Financial Services", "weight": "0.6%", "basePrice": 580.00, "change": -0.80 },
  { "name": "Hindalco Industries", "ticker": "HINDALCO.NS", "sector": "Metals", "weight": "0.5%", "basePrice": 520.00, "change": 1.10 },
  { "name": "InterGlobe Aviation", "ticker": "INDIGO.NS", "sector": "Aviation", "weight": "0.5%", "basePrice": 3120.00, "change": 1.85 },
  { "name": "Jio Financial Services", "ticker": "JIOFIN.NS", "sector": "Financial Services", "weight": "0.5%", "basePrice": 345.00, "change": -0.40 },
  { "name": "JSW Steel", "ticker": "JSWSTEEL.NS", "sector": "Metals", "weight": "0.5%", "basePrice": 810.00, "change": 0.50 },
  { "name": "Mahindra & Mahindra", "ticker": "M&M.NS", "sector": "Automobile", "weight": "0.5%", "basePrice": 1680.00, "change": 1.30 },
  { "name": "Max Healthcare", "ticker": "MAXHEALTH.NS", "sector": "Healthcare", "weight": "0.5%", "basePrice": 720.00, "change": -0.90 },
  { "name": "Nestle India", "ticker": "NESTLEIND.NS", "sector": "FMCG", "weight": "0.5%", "basePrice": 2540.00, "change": -0.15 },
  { "name": "ONGC", "ticker": "ONGC.NS", "sector": "Energy", "weight": "0.4%", "basePrice": 245.00, "change": 1.15 },
  { "name": "SBI Life", "ticker": "SBILIFE.NS", "sector": "Financial Services", "weight": "0.4%", "basePrice": 1450.00, "change": -0.75 },
  { "name": "Shriram Finance", "ticker": "SHRIRAMFIN.NS", "sector": "Financial Services", "weight": "0.4%", "basePrice": 2320.00, "change": 0.95 },
  { "name": "Tata Consumer", "ticker": "TATACONSUM.NS", "sector": "FMCG", "weight": "0.4%", "basePrice": 1150.00, "change": 0.20 },
  { "name": "Tata Steel", "ticker": "TATASTEEL.NS", "sector": "Metals", "weight": "0.4%", "basePrice": 142.00, "change": -1.30 },
  { "name": "Tech Mahindra", "ticker": "TECHM.NS", "sector": "IT", "weight": "0.4%", "basePrice": 1250.00, "change": 0.80 },
  { "name": "Trent", "ticker": "TRENT.NS", "sector": "Retail", "weight": "0.4%", "basePrice": 3980.00, "change": 2.45 },
  { "name": "Wipro", "ticker": "WIPRO.NS", "sector": "IT", "weight": "0.4%", "basePrice": 480.00, "change": -0.35 }
]

tickers = [c["ticker"] for c in nifty_constituents]
print("Downloading prices for all constituents...")
data = yf.download(tickers, period="5d", progress=False)

updated_constituents = []
for c in nifty_constituents:
    t = c["ticker"]
    price = c["basePrice"]
    change = c["change"]
    if 'Close' in data and t in data['Close'].columns:
        series = data['Close'][t].dropna()
        if not series.empty:
            price = round(float(series.iloc[-1]), 2)
            if len(series) >= 2:
                change = round(float(((series.iloc[-1] - series.iloc[-2]) / series.iloc[-2]) * 100.0), 2)
        else:
            print(f"Empty series for {t}, using default {price}")
    else:
        print(f"Ticker {t} not found in columns, using default {price}")
    
    updated_constituents.append({
        "name": c["name"],
        "ticker": t,
        "sector": c["sector"],
        "weight": c["weight"],
        "basePrice": price,
        "change": change
    })

print("\n--- GENERATED JS CODE ---")
print("const NIFTY_50_CONSTITUENTS = [")
for c in updated_constituents:
    print(f'  {{ name: "{c["name"]}", ticker: "{c["ticker"]}", sector: "{c["sector"]}", weight: "{c["weight"]}", basePrice: {c["basePrice"]}, change: {c["change"]} }},')
print("]")
