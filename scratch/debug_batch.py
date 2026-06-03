import yfinance as yf

# Let's compare single ticker download vs batch download for a few stocks
tickers = ["WIPRO.NS", "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS"]

print("--- Individual Tickers via yf.Ticker ---")
for t in tickers:
    try:
        ticker = yf.Ticker(t)
        hist = ticker.history(period="1d")
        if not hist.empty:
            print(f"{t}: close = {hist['Close'].iloc[-1]:.2f}")
        else:
            print(f"{t}: empty history")
    except Exception as e:
        print(f"{t}: error {e}")

print("\n--- Batch download via yf.download ---")
try:
    data = yf.download(tickers, period="5d", progress=False)
    if 'Close' in data:
        for t in tickers:
            if t in data['Close'].columns:
                series = data['Close'][t].dropna()
                if not series.empty:
                    print(f"{t}: batch close = {series.iloc[-1]:.2f}")
                else:
                    print(f"{t}: empty series in batch")
            else:
                print(f"{t}: not in batch columns")
    else:
        print("No Close column in batch data")
except Exception as e:
    print(f"Batch error: {e}")
