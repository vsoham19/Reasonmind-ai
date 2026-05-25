import asyncio
import random
from typing import Dict, Any, List, AsyncGenerator
from knowledge.nifty_knowledge import COMPANIES, SECTORS
# Assuming these functions are now async or replaced by streaming logic
# from tools.live_data import fetch_live_metrics, fetch_live_sector_benchmark 
# We will simulate the live data fetching using async generators.

# --- Helper Functions for Simulation ---

async def simulate_live_metrics_stream(company_name: str) -> AsyncGenerator[Dict[str, Any], None]:
    """Simulates streaming real-time metrics for a company."""
    print(f"--- Starting simulated stream for {company_name} ---")
    base_metrics = COMPANIES.get(company_name, {})
    if not base_metrics:
        yield {"error": f"Company '{company_name}' not found in mock database."}
        return

    # Simulate initial data point
    yield {
        "name": company_name,
        "pe_ratio": base_metrics.get("pe_ratio", 20.0) * (1 + random.uniform(-0.05, 0.05)),
        "roe": base_metrics.get("roe", 0.15) * (1 + random.uniform(-0.02, 0.02)),
        "revenue_growth": base_metrics.get("revenue_growth", 0.10) * (1 + random.uniform(-0.01, 0.01)),
        "sector": base_metrics.get("sector", "Unknown"),
        "debt_to_equity": base_metrics.get("debt_to_equity", 1.0) * (1 + random.uniform(-0.05, 0.05)),
        "timestamp": asyncio.get_event_loop().time()
    }

    # Simulate subsequent updates (the stream)
    for i in range(5):
        await asyncio.sleep(0.5) # Simulate network latency/update interval
        
        # Simulate slight random fluctuations
        yield {
            "name": company_name,
            "pe_ratio": round(base_metrics.get("pe_ratio", 20.0) * (1 + random.uniform(-0.01, 0.01)), 2),
            "roe": round(base_metrics.get("roe", 0.15) * (1 + random.uniform(-0.005, 0.005)), 4),
            "revenue_growth": round(base_metrics.get("revenue_growth", 0.10) * (1 + random.uniform(-0.005, 0.005)), 4),
            "sector": base_metrics.get("sector", "Unknown"),
            "debt_to_equity": round(base_metrics.get("debt_to_equity", 1.0) * (1 + random.uniform(-0.01, 0.01)), 2),
            "timestamp": asyncio.get_event_loop().time() + i
        }

async def simulate_sector_metrics_stream(sector_name: str) -> AsyncGenerator[Dict[str, Any], None]:
    """Simulates streaming sector-wide metadata and benchmarks."""
    print(f"--- Starting simulated stream for {sector_name} ---")
    
    # Initial static data point
    yield {
        "sector_name": sector_name, 
        "avg_pe": 25.0 + random.uniform(-2.0, 2.0), 
        "risk_level": "Medium", 
        "cyclical_or_defensive": "Cyclical",
        "timestamp": asyncio.get_event_loop().time()
    }
    
    # Simulate subsequent updates
    for i in range(3):
        await asyncio.sleep(0.5)
        yield {
            "sector_name": sector_name, 
            "avg_pe": round(25.0 + random.uniform(-2.0, 2.0), 2), 
            "risk_level": "Medium", 
            "cyclical_or_defensive": "Cyclical",
            "timestamp": asyncio.get_event_loop().time() + i
        }


# --- Phase 1: Retrieval Tools (Now Streaming) ---

async def get_company_metrics(company_name: str) -> AsyncGenerator[Dict[str, Any], None]:
    """
    Asynchronously streams structured financial metrics for a specific company.
    Yields a dictionary for each real-time update.
    """
    # Use the simulation helper function
    async for metrics in simulate_live_metrics_stream(company_name):
        yield metrics

async def get_sector_metrics(sector_name: str) -> AsyncGenerator[Dict[str, Any], None]:
    """
    Asynchronously streams sector-wide metadata and benchmarks.
    Yields a dictionary for each real-time update.
    """
    # Use the simulation helper function
    async for sector_data in simulate_sector_metrics_stream(sector_name):
        yield sector_data

async def list_companies_by_sector(sector_name: str) -> List[str]:
    """
    Lists all companies in the dataset belonging to a specific sector.
    (This remains synchronous as it's a static lookup).
    """
    results = []
    for name, data in COMPANIES.items():
        if sector_name.lower() in data["sector"].lower():
            results.append(name)
    return results

# --- Phase 2: Scoring Tools (Adapted for Streaming) ---

# NOTE: Scoring functions are complex to adapt fully to streaming, 
# as they require a complete, stable dataset (A and B) at the time of calculation.
# For simplicity, we will assume the scoring functions receive the *latest* 
# available metrics from the stream and calculate the score based on that.

async def compute_valuation_score(company_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes a deterministic valuation score (0-100) based on the latest metrics.
    """
    if "error" in company_data: return company_data
    
    # Since we are streaming, we must await the sector data stream to get the latest value
    async for sector_data in get_sector_metrics(company_data["sector"]):
        sector_data = sector_data # Use the latest received data point
        break # Only need the latest value for calculation
    
    avg_pe = sector_data.get("avg_pe", 25.0)
    
    # 1. PE Score (Inverse - lower PE relative to sector is better)
    pe_ratio = company_data["pe_ratio"]
    pe_score = max(0, min(100, (avg_pe / pe_ratio) * 50))
    
    # 2. ROE Score (Higher is better)
    roe = company_data["roe"]
    roe_score = min(100, roe * 2) # Assume 50% ROE is perfection
    
    # 3. Growth Score
    growth = company_data["revenue_growth"]
    growth_score = min(100, growth * 4) # Assume 25% growth is perfection
    
    final_score = (pe_score * 0.4) + (roe_score * 0.3) + (growth_score * 0.3)
    
    return {
        "company": company_data["name"],
        "valuation_score": round(final_score, 2),
        "components": {
            "pe_relative_score": round(pe_score, 2),
            "roe_score": round(roe_score, 2),
            "growth_score": round(growth_score, 2)
        },
        "logic": "Weighted average: PE (40%), ROE (30%), Growth (30%)"
    }

async def compute_risk_score(company_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes a deterministic risk score (0-100, where 100 is max risk) based on the latest metrics.
    """
    if "error" in company_data: return company_data
    
    # Await the sector data stream to get the latest risk level
    async for sector_data in get_sector_metrics(company_data["sector"]):
        sector_data = sector_data
        break
        
    sector_risk_map = {"Low": 20, "Medium": 50, "High": 80}
    base_risk = sector_risk_map.get(sector_data["risk_level"], 50)
    
    # Debt impact
    der = company_data["debt_to_equity"]
    # For banks, DER is less of a risk factor than for IT/FMCG
    if company_data["sector"] == "Banking":
        debt_risk = min(40, der * 20)
    else:
        debt_risk = min(50, der * 40)
        
    final_score = base_risk + debt_risk
    
    # Caps
    final_score = min(100, final_score)
    
    return {
        "company": company_data["name"],
        "risk_score": round(final_score, 2),
        "level": "Aggressive" if final_score > 70 else "Moderate" if final_score > 40 else "Safe",
        "logic": f"Base sector risk ({base_risk}) + Leverage risk ({round(debt_risk, 2)})"
    }

async def compare_companies(company_a_name: str, company_b_name: str) -> Dict[str, Any]:
    """
    Comprehensive comparison of two companies.
    This function now needs to manage two concurrent streams.
    """
    # We will use the latest available data point from each stream for comparison
    
    # Get the latest metrics for A and B
    async def get_latest_metrics(name: str) -> Dict[str, Any]:
        async for metrics in get_company_metrics(name):
            return metrics
        return {"error": f"Could not retrieve metrics for {name}"}

    data_a = await get_latest_metrics(company_a_name)
    data_b = await get_latest_metrics(company_b_name)
    
    if "error" in data_a: return data_a
    if "error" in data_b: return data_b
    
    # Calculate scores based on the latest data points
    score_a = await compute_valuation_score(data_a)
    score_b = await compute_valuation_score(data_b)
    
    risk_a = await compute_risk_score(data_a)
    risk_b = await compute_risk_score(data_b)
    
    return {
        "comparison": f"{data_a['name']} vs {data_b['name']}",
        "metrics_a": data_a,
        "metrics_b": data_b,
        "valuation_a": score_a["valuation_score"],
        "valuation_b": score_b["valuation_score"],
        "risk_a": risk_a["risk_score"],
        "risk_b": risk_b["risk_score"]
    }
