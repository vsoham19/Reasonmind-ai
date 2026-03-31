# Nifty 50 Structured Knowledge Layer
DATA_AS_OF = "February 2026 (Mock Data for Demo)"

COMPANIES = {
    "Reliance": {
        "id": "reliance",
        "name": "Reliance Industries Limited",
        "sector": "Energy",
        "pe_ratio": 28.5,
        "debt_to_equity": 0.35,
        "roe": 14.2,
        "revenue_growth": 12.0,
        "market_cap": "18,00,000 Cr",
        "dividend_yield": 0.3
    },
    "TCS": {
        "id": "tcs",
        "name": "Tata Consultancy Services",
        "sector": "IT",
        "pe_ratio": 32.1,
        "debt_to_equity": 0.05,
        "roe": 39.5,
        "revenue_growth": 8.5,
        "market_cap": "14,50,000 Cr",
        "dividend_yield": 1.1
    },
    "Infosys": {
        "id": "infosys",
        "name": "Infosys Limited",
        "sector": "IT",
        "pe_ratio": 29.8,
        "debt_to_equity": 0.08,
        "roe": 31.2,
        "revenue_growth": 7.2,
        "market_cap": "7,50,000 Cr",
        "dividend_yield": 1.4
    },
    "HDFC Bank": {
        "id": "hdfc_bank",
        "name": "HDFC Bank Limited",
        "sector": "Banking",
        "pe_ratio": 20.2,
        "debt_to_equity": 0.85, # Banks normally have higher leverage
        "roe": 17.5,
        "revenue_growth": 22.0,
        "market_cap": "12,00,000 Cr",
        "dividend_yield": 0.9
    },
    "ITC": {
        "id": "itc",
        "name": "ITC Limited",
        "sector": "FMCG",
        "pe_ratio": 25.4,
        "debt_to_equity": 0.01,
        "roe": 29.1,
        "revenue_growth": 6.5,
        "market_cap": "5,50,000 Cr",
        "dividend_yield": 2.8
    },
    "HUL": {
        "id": "hul",
        "name": "Hindustan Unilever Limited",
        "sector": "FMCG",
        "pe_ratio": 55.6,
        "debt_to_equity": 0.04,
        "roe": 20.5,
        "revenue_growth": 5.0,
        "market_cap": "6,00,000 Cr",
        "dividend_yield": 1.5
    },
    "Sun Pharma": {
        "id": "sun_pharma",
        "name": "Sun Pharmaceutical Industries",
        "sector": "Pharma",
        "pe_ratio": 35.5,
        "debt_to_equity": 0.12,
        "roe": 15.8,
        "revenue_growth": 10.5,
        "market_cap": "3,50,000 Cr",
        "dividend_yield": 0.8
    },
    "L&T": {
        "id": "l&t",
        "name": "Larsen & Toubro Limited",
        "sector": "Engineering",
        "pe_ratio": 38.2,
        "debt_to_equity": 1.2,
        "roe": 12.8,
        "revenue_growth": 15.2,
        "market_cap": "4,80,000 Cr",
        "dividend_yield": 0.7
    }
}

SECTORS = {
    "IT": {
        "risk_level": "Medium",
        "cyclical_or_defensive": "Cyclical",
        "avg_pe": 30.0
    },
    "Banking": {
        "risk_level": "Medium",
        "cyclical_or_defensive": "Cyclical",
        "avg_pe": 18.0
    },
    "FMCG": {
        "risk_level": "Low",
        "cyclical_or_defensive": "Defensive",
        "avg_pe": 40.0
    },
    "Energy": {
        "risk_level": "Medium",
        "cyclical_or_defensive": "Cyclical",
        "avg_pe": 25.0
    },
    "Pharma": {
        "risk_level": "Low",
        "cyclical_or_defensive": "Defensive",
        "avg_pe": 32.0
    },
    "Engineering": {
        "risk_level": "High",
        "cyclical_or_defensive": "Cyclical",
        "avg_pe": 35.0
    }
}
