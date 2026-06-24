import json
import certifi
import httpx
from openai import OpenAI
from app.core.config import settings
from app.core.logging import logger


class GeminiService:
    def __init__(self):
        self.client = OpenAI(
            api_key=settings.GEMINI_API_KEY,
            base_url="https://openrouter.ai/api/v1",
            http_client=httpx.Client(verify=certifi.where()),
        )

    def generate_email(self, name: str, company: str, industry: str, job_title: str) -> dict:
        prompt = f"""You are an expert B2B sales copywriter. Write a personalized outreach email.

Prospect Details:
- Name: {name}
- Company: {company}
- Industry: {industry}
- Job Title: {job_title}

Requirements:
- Professional yet conversational tone
- Highlight specific value proposition for their role and industry
- Keep email body under 150 words
- Include a clear call to action

Return ONLY valid JSON in this exact format:
{{
  "subject": "<compelling email subject line>",
  "email": "<full personalized email body>",
  "cta": "<specific call to action>"
}}"""

        logger.info("gemini_generate_email", name=name, company=company)

        response = self.client.chat.completions.create(
            model="google/gemini-2.5-flash",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.7,
        )

        result = json.loads(response.choices[0].message.content)
        logger.info("gemini_generate_email_success", subject=result.get("subject"))
        return result
