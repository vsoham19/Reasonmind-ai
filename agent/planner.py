import json
from pathlib import Path
from core.llm_client import LLMClient

class ReasoningPlanner:
    def __init__(self):
        self.llm = LLMClient()
        BASE_DIR = Path(__file__).resolve().parent.parent
        prompt_path = BASE_DIR / "prompts" / "planner_prompt.txt"
        self.system_prompt = prompt_path.read_text(encoding="utf-8")

    def create_plan(self, user_query: str, previous_feedback: str = None)->dict:
        user_prompt = user_query
        if previous_feedback:
            user_prompt = f"""
Original User Query: {user_query}

⚠️ PREVIOUS ATTEMPT FAILED EVALUATION!
Evaluator Feedback: {previous_feedback}

Please create an improved reasoning plan. Adjust your tool selection, parameters, or logic specifically to address and fix the feedback from the evaluator.
"""
        response = self.llm.generate(
            system_prompt = self.system_prompt,
            user_prompt = user_prompt
        )

        return self.llm.extract_json(response)