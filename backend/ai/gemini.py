import google.genai as genai
import os
import json

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

def generate_brief(stack_profile: dict) -> dict:
    prompt = f"""
    You are a technical intelligence AI for startup founders.

    Founder's tech stack:
    {json.dumps(stack_profile, indent=2)}

    Based on recent AI ecosystem developments, generate EXACTLY 2-3 actionable items
    that are specifically relevant to this founder's stack and cost profile.

    Focus on: model pricing changes, deprecations, framework updates, cost savings.

    Respond ONLY in this exact JSON format, no markdown, no explanation:
    {{
      "actions": [
        {{
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
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text)
    except Exception as e:
        return {
            "actions": [
                {
                    "priority": 1,
                    "type": "opportunity",
                    "title": "AI analysis temporarily unavailable",
                    "impact": "Retry in a moment",
                    "effort": "N/A",
                    "details": str(e)
                }
            ],
            "summary": "Could not generate brief at this time"
        }

def analyze_cost_impact(stack_profile: dict, change_description: str) -> dict:
    prompt = f"""
    You are a cost analysis AI for startup technical founders.

    Founder's stack and costs:
    {json.dumps(stack_profile, indent=2)}

    Pricing or technology change:
    {change_description}

    Calculate the exact financial impact on this founder's specific setup.

    Respond ONLY in this exact JSON format, no markdown, no explanation:
    {{
      "current_cost": 0,
      "new_cost": 0,
      "monthly_saving": 0,
      "action_required": "specific 1-2 line config change needed",
      "urgency": "immediate|this_week|this_month",
      "explanation": "2-3 sentences"
    }}
    """
    try:
        response = client.models.generate_content(model=MODEL, contents=prompt)
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text)
    except Exception as e:
        return {
            "current_cost": 0,
            "new_cost": 0,
            "monthly_saving": 0,
            "action_required": "Could not analyze",
            "urgency": "unknown",
            "explanation": str(e)
        }
