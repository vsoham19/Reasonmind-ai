import random
import math
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

def calculate_dcf_valuation(
    company_data: Dict[str, Any],
    growth_rate: float = 0.08,      # 8% growth default
    discount_rate: float = 0.10,    # 10% WACC default
    terminal_growth_rate: float = 0.03 # 3% perpetuity default
) -> Dict[str, Any]:
    """
    Computes intrinsic value of a company using a 5-Year Free Cash Flow (FCF) Discounted Cash Flow model.
    Formula: PV of 5-year FCF projections + PV of Terminal Value.
    """
    if "error" in company_data:
        return company_data

    company_name = company_data["name"]
    
    # 1. Estimate initial Free Cash Flow (FCF)
    # yfinance does not always expose freeCashFlow directly. We estimate it based on Market Cap and P/E
    # Net Income = Market Cap / PE
    # FCF is typically ~70-90% of Net Income in established firms.
    pe = company_data.get("pe_ratio", 25.0)
    
    # Try parsing market cap string (e.g. "14,50,000 Cr" or "USD 750 B")
    market_cap_str = company_data.get("market_cap", "0")
    market_cap_val = 0.0
    
    try:
        clean_cap = market_cap_str.replace("Cr", "").replace("B", "").replace(",", "").strip()
        parts = clean_cap.split()
        if len(parts) == 2: # e.g. "USD 750"
            val = float(parts[1])
            market_cap_val = val * (1e9 if "B" in market_cap_str else 1e7)
        else:
            market_cap_val = float(parts[0]) * 10000000 # Convert Crores to Rupees
    except Exception:
        market_cap_val = 100000 * 10000000 # Default to 1 Lakh Cr Rupees if parse fails
        
    net_income_estimate = market_cap_val / pe if pe > 0 else market_cap_val / 25.0
    initial_fcf = net_income_estimate * 0.80 # Assume 80% FCF conversion
    
    # Ensure rates are in decimal form
    if growth_rate > 1.0: growth_rate /= 100.0
    if discount_rate > 1.0: discount_rate /= 100.0
    if terminal_growth_rate > 1.0: terminal_growth_rate /= 100.0
    
    # Check for math bounds
    if discount_rate <= terminal_growth_rate:
        discount_rate = terminal_growth_rate + 0.02 # Force discount rate to be larger than perpetuity growth
        
    # 2. Project FCFs for 5 years
    projected_fcfs = []
    pv_fcfs = []
    current_fcf = initial_fcf
    
    for year in range(1, 6):
        current_fcf = current_fcf * (1 + growth_rate)
        projected_fcfs.append(current_fcf)
        pv = current_fcf / ((1 + discount_rate) ** year)
        pv_fcfs.append(pv)
        
    # 3. Terminal Value
    terminal_value = (projected_fcfs[-1] * (1 + terminal_growth_rate)) / (discount_rate - terminal_growth_rate)
    pv_terminal_value = terminal_value / ((1 + discount_rate) ** 5)
    
    # 4. Total Intrinsic Enterprise Value
    intrinsic_value = sum(pv_fcfs) + pv_terminal_value
    
    # Valuation gap
    valuation_gap = ((intrinsic_value - market_cap_val) / market_cap_val) * 100.0 if market_cap_val > 0 else 0.0
    
    # Determine currency
    currency = company_data.get("currency", "INR")
    
    # Format results
    def format_money(val_bytes):
        if currency == "INR":
            return f"₹ {val_bytes / 10000000:,.2f} Cr"
        return f"{currency} {val_bytes / 1000000000:,.2f} B"
        
    return {
        "company": company_name,
        "model": "Discounted Cash Flow (DCF)",
        "current_market_cap": format_money(market_cap_val),
        "estimated_initial_fcf": format_money(initial_fcf),
        "projected_fcfs": [format_money(f) for f in projected_fcfs],
        "pv_projected_fcfs": [format_money(pv) for pv in pv_fcfs],
        "terminal_value": format_money(terminal_value),
        "pv_terminal_value": format_money(pv_terminal_value),
        "intrinsic_value": format_money(intrinsic_value),
        "intrinsic_value_raw": intrinsic_value,
        "market_cap_raw": market_cap_val,
        "valuation_gap_percent": round(valuation_gap, 2),
        "stance": "Undervalued" if valuation_gap > 10.0 else "Overvalued" if valuation_gap < -10.0 else "Fairly Valued",
        "assumptions": {
            "growth_rate_applied": f"{growth_rate*100:.1f}%",
            "discount_rate_applied": f"{discount_rate*100:.1f}% (WACC)",
            "terminal_growth_rate_applied": f"{terminal_growth_rate*100:.1f}%"
        }
    }

def calculate_ddm_valuation(
    company_data: Dict[str, Any],
    cost_of_equity: float = 0.09,      # 9% default discount rate
    dividend_growth_rate: float = 0.04 # 4% expected growth of dividends
) -> Dict[str, Any]:
    """
    Computes intrinsic value of a company using the Gordon Growth Dividend Discount Model (DDM).
    Formula: Value = (D0 * (1 + g)) / (r - g)
    """
    if "error" in company_data:
        return company_data
        
    company_name = company_data["name"]
    div_yield = company_data.get("dividend_yield", 0.0)
    
    # Check if dividend yield is 0
    if div_yield == 0:
        return {
            "company": company_name,
            "error": "Gordon DDM is not suitable for zero or negligible dividend yield companies. Please use the DCF model."
        }
        
    pe = company_data.get("pe_ratio", 25.0)
    market_cap_str = company_data.get("market_cap", "0")
    market_cap_val = 0.0
    
    try:
        clean_cap = market_cap_str.replace("Cr", "").replace("B", "").replace(",", "").strip()
        parts = clean_cap.split()
        if len(parts) == 2:
            val = float(parts[1])
            market_cap_val = val * (1e9 if "B" in market_cap_str else 1e7)
        else:
            market_cap_val = float(parts[0]) * 10000000
    except Exception:
        market_cap_val = 100000 * 10000000
        
    # Est annual dividend payout
    annual_dividends = market_cap_val * (div_yield / 100.0)
    
    # Rates format check
    if cost_of_equity > 1.0: cost_of_equity /= 100.0
    if dividend_growth_rate > 1.0: dividend_growth_rate /= 100.0
    
    # GGM requirement: cost of equity MUST be larger than growth
    if cost_of_equity <= dividend_growth_rate:
        cost_of_equity = dividend_growth_rate + 0.02
        
    # Projected Dividend D1
    projected_div_d1 = annual_dividends * (1 + dividend_growth_rate)
    
    # Gordon Value
    intrinsic_value = projected_div_d1 / (cost_of_equity - dividend_growth_rate)
    valuation_gap = ((intrinsic_value - market_cap_val) / market_cap_val) * 100.0 if market_cap_val > 0 else 0.0
    
    currency = company_data.get("currency", "INR")
    def format_money(v):
        if currency == "INR":
            return f"₹ {v / 10000000:,.2f} Cr"
        return f"{currency} {v / 1000000000:,.2f} B"
        
    return {
        "company": company_name,
        "model": "Gordon Growth Dividend Discount Model (DDM)",
        "current_market_cap": format_money(market_cap_val),
        "annual_dividends_paid": format_money(annual_dividends),
        "projected_dividends_d1": format_money(projected_div_d1),
        "intrinsic_value": format_money(intrinsic_value),
        "intrinsic_value_raw": intrinsic_value,
        "market_cap_raw": market_cap_val,
        "valuation_gap_percent": round(valuation_gap, 2),
        "stance": "Undervalued" if valuation_gap > 10.0 else "Overvalued" if valuation_gap < -10.0 else "Fairly Valued",
        "assumptions": {
            "cost_of_equity": f"{cost_of_equity*100:.1f}%",
            "dividend_growth_rate": f"{dividend_growth_rate*100:.1f}%"
        }
    }

def run_monte_carlo_simulation(
    company_data: Dict[str, Any],
    simulations: int = 1000,
    expected_return: float = 0.12, # 12% expected annual return
    volatility: float = 0.25      # 25% expected annual volatility
) -> Dict[str, Any]:
    """
    Simulates 1,000 potential future stock valuation distributions in 1 year using Geometric Brownian Motion.
    """
    if "error" in company_data:
        return company_data
        
    company_name = company_data["name"]
    pe = company_data.get("pe_ratio", 25.0)
    
    # We simulate starting from the estimated current valuation (Market Cap)
    market_cap_str = company_data.get("market_cap", "0")
    market_cap_val = 0.0
    
    try:
        clean_cap = market_cap_str.replace("Cr", "").replace("B", "").replace(",", "").strip()
        parts = clean_cap.split()
        if len(parts) == 2:
            val = float(parts[1])
            market_cap_val = val * (1e9 if "B" in market_cap_str else 1e7)
        else:
            market_cap_val = float(parts[0]) * 10000000
    except Exception:
        market_cap_val = 100000 * 10000000
        
    if expected_return > 1.0: expected_return /= 100.0
    if volatility > 1.0: volatility /= 100.0
    
    simulated_values = []
    
    # Geometric Brownian Motion simulation formula for t = 1 year
    # S_t = S_0 * exp((r - 0.5 * sigma^2) * t + sigma * W_t)
    drift = expected_return - 0.5 * (volatility ** 2)
    
    for _ in range(simulations):
        # Generate random standard normal Z using Box-Muller transform
        u1 = random.random()
        u2 = random.random()
        z = math.sqrt(-2.0 * math.log(u1)) * math.cos(2.0 * math.pi * u2)
        
        sim_val = market_cap_val * math.exp(drift + volatility * z)
        simulated_values.append(sim_val)
        
    # Sort for quantiles
    simulated_values.sort()
    
    mean_val = sum(simulated_values) / len(simulated_values)
    worst_case_5pct = simulated_values[int(len(simulated_values) * 0.05)]
    best_case_95pct = simulated_values[int(len(simulated_values) * 0.95)]
    median_val = simulated_values[int(len(simulated_values) * 0.50)]
    
    currency = company_data.get("currency", "INR")
    def format_money(v):
        if currency == "INR":
            return f"₹ {v / 10000000:,.2f} Cr"
        return f"{currency} {v / 1000000000:,.2f} B"
        
    return {
        "company": company_name,
        "model": "Monte Carlo Valuation Path Simulator",
        "current_market_cap": format_money(market_cap_val),
        "simulations_run": simulations,
        "simulated_mean_value": format_money(mean_val),
        "simulated_median_value": format_money(median_val),
        "worst_case_5th_percentile": format_money(worst_case_5pct),
        "best_case_95th_percentile": format_money(best_case_95pct),
        "expected_growth_trajectory": f"Simulated average 1-year change: {((mean_val - market_cap_val)/market_cap_val)*100:.2f}%",
        "assumptions": {
            "expected_return": f"{expected_return*100:.1f}%",
            "historical_volatility": f"{volatility*100:.1f}%"
        }
    }
