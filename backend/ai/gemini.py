import google.genai as genai
import os
import json
from ai.scanner import fetch_latest_ai_news

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

def generate_brief(stack_profile: dict, memory: dict = None) -> dict:
    news = fetch_latest_ai_news()
    
    seen_actions = memory.get('seen', []) if memory else []
    ignored_actions = memory.get('ignored', []) if memory else []
    
    prompt = f"""
    You are a technical intelligence AI for startup founders.

    Founder's tech stack:
    {json.dumps(stack_profile, indent=2)}

    REAL-TIME ECOSYSTEM NEWS:
    {json.dumps(news, indent=2)}

    PREVIOUSLY SURFACED ACTIONS: {json.dumps(seen_actions)}

    Based on news and stack, generate 2-3 ACTIONABLE items.
    For each item, you MUST provide a "code_fix" snippet (Python/JS/Config).

    Respond ONLY in JSON:
    {{
      "actions": [
        {{
          "id": "unique_id",
          "type": "cost_saving|deprecation|opportunity",
          "title": "...",
          "impact": "...",
          "effort": "...",
          "details": "...",
          "code_fix": "exact code block or config change"
        }}
      ],
      "summary": "...",
      "raw_logs": {json.dumps([n['title'] for n in news[:8]])}
    }}
    """
    try:
        response = client.models.generate_content(model=MODEL, contents=prompt)
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"): text = text[4:]
        return json.loads(text)
    except Exception as e:
        return {"actions": [], "summary": f"Error: {str(e)}", "raw_logs": []}

def calculate_stack_health(stack_profile: dict) -> dict:
    news = fetch_latest_ai_news()
    prompt = f"""
    Analyze this founder's AI stack health.
    Stack: {json.dumps(stack_profile)}
    Recent news: {json.dumps(news)}
    
    Return ONLY JSON:
    {{
      "score": 0-100,
      "grade": "A-F",
      "breakdown": {{
        "cost_efficiency": 0-100,
        "deprecation_risk": 0-100,
        "competitive_position": 0-100
      }},
      "top_risk": "..."
    }}
    """
    try:
        response = client.models.generate_content(model=MODEL, contents=prompt)
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"): text = text[4:]
        return json.loads(text)
    except Exception as e:
        return {"score": 0, "grade": "N/A"}

def analyze_cost_impact(stack_profile: dict, change_description: str, burn_rate: float = 0) -> dict:
    prompt = f"""
    Founder's stack: {json.dumps(stack_profile)}
    Burn Rate: ${burn_rate}/month
    Change: {change_description}

    Calculate exact impact.
    Return ONLY JSON:
    {{
      "current_cost": 0,
      "new_cost": 0,
      "monthly_saving": 0,
      "runway_extension_days": 0,
      "runway_extension_message": "...",
      "explanation": "..."
    }}
    """
    try:
        response = client.models.generate_content(model=MODEL, contents=prompt)
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"): text = text[4:]
        return json.loads(text)
    except Exception as e:
        return {"error": str(e)}

def get_chat_response(stack_profile: dict, question: str) -> dict:
    prompt = f"Advisor Chat. Stack: {json.dumps(stack_profile)}. Question: {question}. Return JSON: {{\"answer\": \"...\", \"action\": \"...\"}}"
    try:
        response = client.models.generate_content(model=MODEL, contents=prompt)
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"): text = text[4:]
        return json.loads(text)
    except Exception as e:
        return {"answer": str(e)}
