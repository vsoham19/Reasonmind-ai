import json
import os
from typing import List, Dict, Any

KG_PATH = os.path.join(os.path.dirname(__file__), "..", "knowledge", "nifty_kg.json")

def _load_kg():
    if not os.path.exists(KG_PATH):
        return {"nodes": [], "edges": []}
    with open(KG_PATH, "r") as f:
        return json.load(f)

def search_financial_entities(query: str) -> List[Dict[str, Any]]:
    """
    Finds companies, sectors, or indices in the Nifty KG.
    """
    kg = _load_kg()
    query = query.lower()
    return [node for node in kg["nodes"] if query in node["name"].lower() or query in node.get("id", "").lower()]

def get_financial_connections(entity_id: str) -> Dict[str, Any]:
    """
    Retrieves relationships for a Nifty entity (e.g., competitors, sector membership).
    """
    kg = _load_kg()
    entity = next((node for node in kg["nodes"] if node["id"] == entity_id), None)
    if not entity:
        return {"error": f"Entity '{entity_id}' not found in Nifty KG."}

    outbound = [edge for edge in kg["edges"] if edge["source"] == entity_id]
    inbound = [edge for edge in kg["edges"] if edge["target"] == entity_id]

    enriched_outbound = []
    for edge in outbound:
        target_node = next((n for n in kg["nodes"] if n["id"] == edge["target"]), None)
        enriched_outbound.append({
            "relation": edge["relation"],
            "target_id": edge["target"],
            "target_name": target_node["name"] if target_node else "Unknown",
            "metadata": {k: v for k, v in edge.items() if k not in ["source", "target", "relation"]}
        })

    enriched_inbound = []
    for edge in inbound:
        source_node = next((n for n in kg["nodes"] if n["id"] == edge["source"]), None)
        enriched_inbound.append({
            "relation": edge["relation"],
            "source_id": edge["source"],
            "source_name": source_node["name"] if source_node else "Unknown",
            "metadata": {k: v for k, v in edge.items() if k not in ["source", "target", "relation"]}
        })

    return {
        "entity": entity,
        "outbound_connections": enriched_outbound,
        "inbound_connections": enriched_inbound
    }
