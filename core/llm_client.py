import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

class LLMClient:
    def __init__(self, model="llama-3.1-8b-instant"):
        # Explicitly load .env from the project root relative to this file
        dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
        load_dotenv(dotenv_path, override=True)
        
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError(f"GROQ_API_KEY not found in {dotenv_path} or environment")

        self.client = Groq(api_key=api_key)
        self.model = model
    
    def generate(self, system_prompt: str, user_prompt: str)-> str:
        response = self.client.chat.completions.create(
            model = self.model,
            messages=[
                {"role": "system","content":system_prompt},
                {"role": "user","content":user_prompt}
            ],
            temperature = 0.2
        )
        return response.choices[0].message.content

    @staticmethod
    def extract_json(text: str) -> dict:
        """
        Extracts and parses JSON from a string that may contain markdown or other text.
        """
        if not text:
            raise ValueError("Empty response from LLM")
            
        original_text = text
        text = text.strip()
        
        # 1. Try direct parsing
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass

        # 2. Extract from markdown blocks
        extracted = None
        if "```json" in text:
            extracted = text.split("```json")[-1].split("```")[0].strip()
        elif "```" in text:
            parts = text.split("```")
            if len(parts) >= 3:
                extracted = parts[1].strip()
        
        if extracted:
            try:
                return json.loads(extracted)
            except json.JSONDecodeError:
                # If block extraction fails, try finding braces inside the block
                text = extracted
        
        # 3. Aggressive Braces Finding
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1:
            potential_json = text[start:end+1]
            try:
                return json.loads(potential_json)
            except json.JSONDecodeError:
                # One last try: remove common LLM conversational starters
                pass
        
        # 4. Final Fallback: if we still don't have a valid dict, it's a structural failure
        print(f"DEBUG: JSON extraction failed. Raw Response: {original_text}")
        raise ValueError(f"The engine expected a structured JSON response but received malformed data. Raw sample: {original_text[:100]}...")