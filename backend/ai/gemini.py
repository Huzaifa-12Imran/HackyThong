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

    PREVIOUSLY SURFACED ACTIONS (DO NOT REPEAT THESE):
    {json.dumps(seen_actions)}
    IGNORED ACTIONS:
    {json.dumps(ignored_actions)}

    Based on the real news above and the stack, generate EXACTLY 2-3 ACTIONABLE items.
    Focus on: model pricing changes, deprecations, framework updates, cost savings.

    Respond ONLY in this exact JSON format:
    {{
      "actions": [
        {{
          "id": "unique_slug_id",
          "priority": 1,
          "type": "cost_saving|deprecation|opportunity",
          "title": "short title",
          "impact": "specific dollar or time impact",
          "effort": "time estimate",
          "details": "2-3 sentence explanation"
        }}
      ],
      "summary": "one line summary"
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
        return {"actions": [], "summary": f"Could not generate brief: {str(e)}"}

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
      "top_risk": "one sentence about biggest risk right now"
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
        return {"score": 0, "grade": "N/A", "error": str(e)}

def analyze_cost_impact(stack_profile: dict, change_description: str, burn_rate: float = 0) -> dict:
    prompt = f"""
    You are a cost analysis AI for startup technical founders.
    Founder's stack/costs: {json.dumps(stack_profile)}
    Burn Rate: ${burn_rate}/month
    Pricing/Tech Change: {change_description}

    Respond ONLY in JSON:
    {{
      "current_cost": 0,
      "new_cost": 0,
      "monthly_saving": 0,
      "annual_saving": 0,
      "runway_extension_days": 0,
      "runway_extension_message": "...",
      "action_required": "specific change",
      "urgency": "immediate|this_week|this_month",
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
    prompt = f"""
    You are a technical advisor for this startup founder.
    Their stack: {json.dumps(stack_profile)}
    
    Answer this question specifically for their setup:
    {question}
    
    Be specific, practical, and brief. Max 3 sentences.
    Return ONLY JSON: {{"answer": "...", "action": "specific next step or null"}}
    """
    try:
        response = client.models.generate_content(model=MODEL, contents=prompt)
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"): text = text[4:]
        return json.loads(text)
    except Exception as e:
        return {"answer": f"Error: {str(e)}", "action": None}
