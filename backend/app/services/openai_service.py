import json
import certifi
import httpx
from openai import OpenAI
from app.core.config import settings
from app.core.logging import logger


class OpenAIService:
    def __init__(self):
        self.client = OpenAI(
            api_key=settings.OPENAI_API_KEY,
            http_client=httpx.Client(verify=certifi.where()),
        )

    def qualify_lead(self, name: str, company: str, industry: str, job_title: str) -> dict:
        prompt = f"""You are a B2B sales qualification expert. Analyze this lead and return a JSON object.

Lead Information:
- Name: {name}
- Company: {company}
- Industry: {industry}
- Job Title: {job_title}

Evaluate the lead's potential value based on:
1. Decision-making authority (C-level, VP, Director = higher score)
2. Industry value (Technology, Finance, Healthcare = higher score)
3. Company potential

Return ONLY valid JSON in this exact format:
{{
  "score": <number 0-100>,
  "reason": "<concise qualification reason>"
}}"""

        logger.info("openai_qualify_lead", name=name, company=company)

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3,
        )

        content = response.choices[0].message.content
        result = json.loads(content)

        logger.info("openai_qualify_lead_result", score=result.get("score"))

        return {"score": float(result["score"]), "reason": result["reason"]}

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

        logger.info("openai_generate_email", name=name, company=company)

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.7,
        )

        result = json.loads(response.choices[0].message.content)
        logger.info("openai_generate_email_success", subject=result.get("subject"))
        return result
