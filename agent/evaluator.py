import json
from pathlib import Path
from core.llm_client import LLMClient

class Evaluator:
    def __init__(self):
        self.llm = LLMClient()
        try:
            BASE_DIR = Path(__file__).resolve().parent.parent
            prompt_path = BASE_DIR / "prompts" / "evaluator_prompt.txt"
            self.system_prompt = prompt_path.read_text(encoding="utf-8")
        except FileNotFoundError:
            raise FileNotFoundError("Evaluator prompt file not found at prompts/evaluator_prompt.txt")

    def evaluate(self, user_query: str, final_answer: str) -> dict:
        user_input = f"""
        User Query: {user_query}
        Agent's Final Answer: {final_answer}
        """

        response = self.llm.generate(
            system_prompt=self.system_prompt,
            user_prompt=user_input
        )

        try:
            evaluation = self.llm.extract_json(response)
            if "is_satisfactory" not in evaluation or "feedback" not in evaluation:
                raise ValueError("Evaluator output missing required fields")
            return evaluation
        except (json.JSONDecodeError, ValueError) as e:
            # Fallback if parsing fails
            return {
                "is_satisfactory": False,
                "feedback": f"Failed to parse evaluator response: {str(e)}"
            }
