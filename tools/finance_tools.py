def compare_investments(company_a: str, company_b: str) -> dict:
    """
    Deterministic mock finance tool.
    """

    return {
        "company_a": {
            "name": company_a,
            "risk": "medium",
            "growth": "high"
        },
        "company_b": {
            "name": company_b,
            "risk": "low",
            "growth": "medium"
        }
    }
