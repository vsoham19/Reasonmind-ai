import json 
from pathlib import Path
from core.llm_client import LLMClient

class ReasoningSynthesizer:
    def __init__(self):
        self.llm = LLMClient()
        BASE_DIR = Path(__file__).resolve().parent.parent
        prompt_path = BASE_DIR / "prompts" / "synthesizer_prompt.txt"
        self.system_prompt = prompt_path.read_text(encoding="utf-8")

    def synthesize(self, user_query:str, tool_results: dict) -> dict:
        user_input = f"""
        User Query: {user_query}
        Tool Results: {tool_results}
        """

        response = self.llm.generate(
            system_prompt=self.system_prompt,
            user_prompt=user_input
        )

        return self.llm.extract_json(response)