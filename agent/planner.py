import json
from pathlib import Path
from core.llm_client import LLMClient

class ReasoningPlanner:
    def __init__(self):
        self.llm = LLMClient()
        BASE_DIR = Path(__file__).resolve().parent.parent
        prompt_path = BASE_DIR / "prompts" / "planner_prompt.txt"
        self.system_prompt = prompt_path.read_text(encoding="utf-8")

    def create_plan(self, user_query: str)->dict:
        response = self.llm.generate(system_prompt = self.system_prompt,
        user_prompt = user_query)

        return self.llm.extract_json(response)