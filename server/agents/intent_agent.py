import os
from openai import OpenAI
from agents.base_agent import BaseAgent
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class IntentAgent(BaseAgent):
    def run(self, task: dict) -> str:
        prompt = f"""
You are an AI assistant whose job is to infer the user's implied intent.

User message:
{task['user_message']}

Respond with a helpful solution based on inferred intent.
Do not ask follow-up questions.
"""

        response = client.chat.completions.create(
            model=self.model,
            temperature=self.temperature,
            messages=[
                {"role": "system", "content": self.role},
                {"role": "user", "content": prompt}
            ]
        )

        return response.choices[0].message.content.strip()
