import yfinance as yf
from tools.live_data import TICKER_RESOLVER

nse_tickers = list(set([t for t in TICKER_RESOLVER.values() if t.endswith('.NS')]))
query_tickers = nse_tickers + ['^NSEI']

print("Downloading tickers...")
data = yf.download(query_tickers, period="5d", progress=False)

print("\n--- Downloaded Prices ---")
for t in sorted(nse_tickers):
    if 'Close' in data and t in data['Close'].columns:
        series = data['Close'][t].dropna()
        if not series.empty:
            print(f"{t}: yfinance={series.iloc[-1]:.2f}")
        else:
            print(f"{t}: empty series")
    else:
        print(f"{t}: not found in columns")

