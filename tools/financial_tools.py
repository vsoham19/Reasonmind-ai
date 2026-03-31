from knowledge.nifty_knowledge import COMPANIES, SECTORS
from typing import Dict, Any, List, Optional

# --- Phase 1: Retrieval Tools ---

def get_company_metrics(company_name: str) -> Dict[str, Any]:
    """
    Retrieves structured financial metrics for a specific company.
    """
    # Case insensitive search
    for name, data in COMPANIES.items():
        if company_name.lower() in name.lower():
            return data
    return {"error": f"Company '{company_name}' not found in Nifty subset."}

def get_sector_metrics(sector_name: str) -> Dict[str, Any]:
    """
    Retrieves sector-wide metadata and benchmarks.
    """
    # Case insensitive search
    for name, data in SECTORS.items():
        if sector_name.lower() in name.lower():
            return {"sector_name": name, **data}
    return {"error": f"Sector '{sector_name}' not found."}

def list_companies_by_sector(sector_name: str) -> List[str]:
    """
    Lists all companies in the dataset belonging to a specific sector.
    """
    results = []
    for name, data in COMPANIES.items():
        if sector_name.lower() in data["sector"].lower():
            results.append(name)
    return results

# --- Phase 2: Scoring Tools ---

def compute_valuation_score(company_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes a deterministic valuation score (0-100).
    Formula: Weights average of PE vs Sector, ROE, and Growth.
    """
    if "error" in company_data: return company_data
    
    sector_data = get_sector_metrics(company_data["sector"])
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

def compute_risk_score(company_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes a deterministic risk score (0-100, where 100 is max risk).
    """
    if "error" in company_data: return company_data
    
    sector_data = get_sector_metrics(company_data["sector"])
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

def compare_companies(company_a_name: str, company_b_name: str) -> Dict[str, Any]:
    """
    Comprehensive comparison of two companies.
    """
    data_a = get_company_metrics(company_a_name)
    data_b = get_company_metrics(company_b_name)
    
    if "error" in data_a: return data_a
    if "error" in data_b: return data_b
    
    score_a = compute_valuation_score(data_a)
    score_b = compute_valuation_score(data_b)
    
    risk_a = compute_risk_score(data_a)
    risk_b = compute_risk_score(data_b)
    
    return {
        "comparison": f"{data_a['name']} vs {data_b['name']}",
        "metrics_a": data_a,
        "metrics_b": data_b,
        "valuation_a": score_a["valuation_score"],
        "valuation_b": score_b["valuation_score"],
        "risk_a": risk_a["risk_score"],
        "risk_b": risk_b["risk_score"]
    }
