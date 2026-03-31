from tools.financial_tools import (
    get_company_metrics, 
    get_sector_metrics, 
    compute_valuation_score, 
    compute_risk_score, 
    compare_companies
)
from tools.nifty_graph_tools import search_financial_entities, get_financial_connections


TOOL_REGISTRY = {
    "get_company_metrics": get_company_metrics,
    "get_sector_metrics": get_sector_metrics,
    "compute_valuation_score": compute_valuation_score,
    "compute_risk_score": compute_risk_score,
    "compare_companies": compare_companies,
    "search_financial_entities": search_financial_entities,
    "get_financial_connections": get_financial_connections
}
