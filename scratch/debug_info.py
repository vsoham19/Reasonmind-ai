import yfinance as yf

tickers = ["WIPRO.NS", "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS"]

for t in tickers:
    tick = yf.Ticker(t)
    info = tick.info
    print(f"\n--- {t} ---")
    print(f"Currency: {info.get('currency')}")
    print(f"Long Name: {info.get('longName')}")
    print(f"Financial Currency: {info.get('financialCurrency')}")
    print(f"Current Price (info): {info.get('currentPrice')}")
    print(f"Ask: {info.get('ask')}")
    print(f"Bid: {info.get('bid')}")
    print(f"Previous Close: {info.get('previousClose')}")
