from openai import OpenAI
import os
import json
import time
from ai.parser import parse_or_fallback
from ai.scanner import fetch_latest_ai_news
from utils.calculator import RunwayCalculator
from utils.cache import response_cache

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY", "dummy_key_to_prevent_startup_crash"),
    base_url=os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
)
MODEL = os.getenv("AI_MODEL", "google/gemini-2.5-flash")
# Fallback models if primary hits rate limit
FALLBACK_MODELS = [
    "google/gemini-2.0-flash",
    "google/gemini-2.0-flash-lite",
    "meta-llama/llama-3.1-8b-instruct:free",
]
calc = RunwayCalculator()


def _chat(prompt: str, max_tokens: int = 2048) -> str:
    """Call the AI with automatic model fallback on 429 rate limit."""
    models_to_try = [MODEL] + FALLBACK_MODELS
    last_err = None
    for model in models_to_try:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens
            )
            content = response.choices[0].message.content
            print(f"[AI] Used model: {model}")
            return content
        except Exception as e:
            err_str = str(e)
            if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str or "rate" in err_str.lower():
                print(f"[AI] {model} rate-limited, trying next model...")
                last_err = e
                time.sleep(1)
                continue
            raise  # non-rate-limit errors bubble up immediately
    raise last_err

# ── Fallback responses (never let AI errors crash the demo) ──────────────

BRIEF_FALLBACK = {
    "actions": [
        {
            "id": "fallback-001",
            "priority": 1,
            "type": "opportunity",
            "title": "Stack analysis temporarily unavailable",
            "impact": "Check back in a moment",
            "monthly_saving_hint": 0,
            "urgency": "this_month",
            "effort": "N/A",
            "details": "The AI scanner encountered an issue. Your stack data is safe.",
            "code_fix": "# Re-run analysis to get current recommendations",
            "confidence_score": 0
        }
    ],
    "top_risk": "Manual review recommended",
    "summary": "Temporary analysis issue — your stack data is intact",
    "memory_insight": "",
    "raw_logs": []
}

COST_IMPACT_FALLBACK = {
    "monthly_saving_hint": 0,
    "urgency": "this_week",
    "code_fix": "# Unable to generate fix — please try again",
    "explanation": "Cost analysis temporarily unavailable. Please retry.",
    "bonus_tip": ""
}

HEALTH_FALLBACK = {
    "issues": [],
    "top_risk": "Unable to analyze — showing cached data",
    "breakdown": {
        "cost_efficiency": 75,
        "deprecation_risk": 80,
        "competitive_position": 70
    }
}


# ── Brief Generation ─────────────────────────────────────────────────────

def generate_brief(stack_profile: dict, behavior_profile: dict = None) -> dict:
    """Generate morning briefing. Gemini provides context, Python does math."""

    # Check cache first
    cache_key = response_cache.make_key("brief", stack_profile)
    cached = response_cache.get(cache_key)
    if cached:
        return cached

    news = fetch_latest_ai_news()

    memory_instruction = ""
    if behavior_profile and behavior_profile.get('has_history'):
        memory_instruction = f"""
        IMPORTANT — Personalization based on this founder's history:
        - Completion rate: {behavior_profile['completion_rate']}%
        - Most ignored action type: {behavior_profile.get('most_ignored_type', 'none')}
        - Most acted on type: {behavior_profile.get('most_acted_type', 'none')}
        - Rank {behavior_profile.get('most_acted_type', 'deprecation')} actions higher.
        - If showing {behavior_profile.get('most_ignored_type', 'none')} actions,
          add a note that this founder tends to delay these.
        """

    prompt = f"""
    You are a technical intelligence AI for startup co-founders.

    Founder stack profile:
    {json.dumps(stack_profile, indent=2)}

    Recent AI ecosystem developments from live scan:
    {json.dumps(news[:5], indent=2)}

    {memory_instruction}

    Generate EXACTLY 2-3 actionable items specific to this founder's stack.

    CRITICAL RULES:
    - Do NOT calculate any numbers. Leave monthly_saving_hint as your best estimate.
      The system calculates all finances separately.
    - Focus on: what changed in the ecosystem and what the founder must do.
    - code_fix must be actual executable code, not pseudocode.
    - confidence_score is your certainty 0-100 that this action is correct.
    - Each action MUST have a unique id string.

    Respond ONLY in this exact JSON. No markdown. No explanation. No preamble:
    {{
      "actions": [
        {{
          "id": "unique_string_id",
          "priority": 1,
          "type": "cost_saving|deprecation|opportunity",
          "title": "short title",
          "monthly_saving_hint": 0,
          "urgency": "immediate|this_week|this_month",
          "effort": "time estimate string",
          "details": "2-3 sentences",
          "code_fix": "actual code snippet or config change",
          "confidence_score": 95
        }}
      ],
      "top_risk": "one sentence about the biggest risk",
      "summary": "one line summary",
      "memory_insight": "insight about founder behavior or empty string"
    }}
    """

    try:
        raw_content = _chat(prompt, max_tokens=2048)
        print("RAW RESPONSE START\n", raw_content, "\nRAW RESPONSE END")
        parsed = parse_or_fallback(raw_content, BRIEF_FALLBACK)

        # Python handles all the numbers — never Gemini
        if parsed != BRIEF_FALLBACK:
            total_saving = 0
            for action in parsed.get('actions', []):
                hint = action.get('monthly_saving_hint', 0)
                if hint and hint > 0:
                    impact_calc = calc.calculate_impact(stack_profile, hint)
                    action['runway_extension_days'] = impact_calc['runway_extension_days']
                    action['impact'] = (
                        f"${hint}/month saved — "
                        f"{impact_calc['runway_extension_days']} days runway"
                    )
                    total_saving += hint
                else:
                    action['runway_extension_days'] = 0
                    if not action.get('impact'):
                        action['impact'] = action.get('title', 'Action needed')

            health = calc.calculate_health_score(
                stack_profile, parsed.get('actions', [])
            )
            parsed['health_score'] = health['score']
            parsed['health_grade'] = health['grade']
            parsed['health_explanation'] = health['explanation']

            # Add memory insight if behavior profile provided
            if behavior_profile and behavior_profile.get('has_history'):
                if not parsed.get('memory_insight'):
                    parsed['memory_insight'] = behavior_profile.get('insight', '')

            # Add raw logs for terminal animation
            parsed['raw_logs'] = [n.get('title', '') for n in news[:8]]

        # Cache the result
        response_cache.set(cache_key, parsed)
        return parsed

    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Gemini brief generation failed: {e}")
        return BRIEF_FALLBACK


# ── Cost Impact Analysis ─────────────────────────────────────────────────

def analyze_cost_impact(stack_profile: dict, change_description: str,
                        burn_rate: float = 18000) -> dict:
    """Analyze cost impact. Gemini provides context, Python does ALL math."""

    # Ensure stack_profile has burn_rate and total_monthly_cost
    stack_profile['burn_rate'] = burn_rate or stack_profile.get('burn_rate', 18000)
    stack_profile['total_monthly_cost'] = stack_profile.get(
        'total_monthly_cost', calc._sum_costs(stack_profile)
    )

    prompt = f"""
    You are a financial impact AI for startup founders.

    Founder stack (with monthly costs):
    {json.dumps(stack_profile, indent=2)}

    Burn rate: ${stack_profile['burn_rate']}/month

    Change to analyze:
    {change_description}

    Identify which tool/model is affected and estimate the monthly saving.

    CRITICAL: Do NOT calculate runway extension or annual savings.
    The system does all arithmetic. Just provide monthly_saving_hint.

    Respond ONLY in this JSON format. No markdown. No explanation:
    {{
      "affected_tool": "name of the tool/model affected",
      "current_cost": 420,
      "monthly_saving_hint": 126,
      "urgency": "immediate|this_week|this_month",
      "code_fix": "exact config line or code to change",
      "bonus_tip": "optional additional optimization suggestion",
      "explanation": "2-3 sentences explaining the change"
    }}
    """

    try:
        parsed = parse_or_fallback(_chat(prompt, max_tokens=2048), COST_IMPACT_FALLBACK)

        if parsed != COST_IMPACT_FALLBACK:
            monthly_saving = parsed.get('monthly_saving_hint', 0)
            current_cost = parsed.get('current_cost', 0)

            # Python does ALL the math
            impact = calc.calculate_impact(stack_profile, monthly_saving)

            # Merge Gemini's context with Python's math
            result = {
                "current_cost": current_cost or impact['current_cost'],
                "new_cost": (current_cost - monthly_saving) if current_cost else impact['new_cost'],
                "monthly_saving": impact['monthly_saving'],
                "annual_saving": impact['annual_saving'],
                "saving_percentage": impact['saving_percentage'],
                "runway_extension_days": impact['runway_extension_days'],
                "runway_extension_explanation": impact['runway_extension_explanation'],
                "urgency": parsed.get('urgency', 'this_week'),
                "code_fix": parsed.get('code_fix', '# No fix needed'),
                "bonus_tip": parsed.get('bonus_tip', ''),
                "explanation": parsed.get('explanation', ''),
                "affected_tool": parsed.get('affected_tool', '')
            }
            return result

        return parsed

    except Exception as e:
        print(f"Gemini cost impact failed: {e}")
        return COST_IMPACT_FALLBACK


# ── Health Analysis ───────────────────────────────────────────────────────

def generate_health_analysis(stack_profile: dict) -> dict:
    """Get AI analysis of stack issues. Score is calculated in Python."""

    cache_key = response_cache.make_key("health", stack_profile)
    cached = response_cache.get(cache_key)
    if cached:
        return cached

    news = fetch_latest_ai_news()

    prompt = f"""
    Analyze this founder's AI stack for issues.
    Stack: {json.dumps(stack_profile)}
    Recent ecosystem news: {json.dumps(news[:3])}

    Identify any deprecation risks, cost savings, or opportunities.
    Do NOT calculate scores — just list the issues.

    Return ONLY JSON:
    {{
      "issues": [
        {{
          "type": "deprecation|cost_saving|opportunity",
          "urgency": "immediate|this_week|this_month",
          "description": "brief description"
        }}
      ],
      "top_risk": "one sentence about the biggest risk",
      "breakdown": {{
        "cost_efficiency": 0-100,
        "deprecation_risk": 0-100,
        "competitive_position": 0-100
      }}
    }}
    """

    try:
        parsed = parse_or_fallback(_chat(prompt, max_tokens=2048), HEALTH_FALLBACK)
        response_cache.set(cache_key, parsed)
        return parsed
    except Exception as e:
        print(f"Gemini health analysis failed: {e}")
        return HEALTH_FALLBACK


# ── Stack Health (legacy — used by stack.py route) ────────────────────────

def calculate_stack_health(stack_profile: dict) -> dict:
    """Backwards-compatible health endpoint for stack.py route."""
    analysis = generate_health_analysis(stack_profile)
    issues = analysis.get('issues', [])
    health = calc.calculate_health_score(stack_profile, issues)

    return {
        "score": health['score'],
        "grade": health['grade'],
        "explanation": health['explanation'],
        "top_risk": analysis.get('top_risk', 'No immediate risks'),
        "breakdown": analysis.get('breakdown', {})
    }


# ── Chat ──────────────────────────────────────────────────────────────────

def get_chat_response(stack_profile: dict, question: str) -> dict:
    """Chat with context of the founder's stack."""

    prompt = f"""
    You are a technical advisor AI for a startup founder.
    You know their exact tech stack and costs.

    Founder's stack: {json.dumps(stack_profile)}

    The founder asks: {question}

    Provide a helpful, specific answer referencing their actual tools.
    If you can suggest a concrete action, include it.

    Respond ONLY in JSON:
    {{
      "answer": "your detailed answer",
      "suggested_action": "a concrete next step or empty string",
      "confidence": 85
    }}
    """

    fallback = {
        "answer": "I'm having trouble processing that right now. Please try again.",
        "suggested_action": "",
        "confidence": 0
    }

    try:
        return parse_or_fallback(_chat(prompt, max_tokens=2048), fallback)
    except Exception as e:
        print(f"Gemini chat failed: {e}")
        return fallback

# ── New Strategic Features ────────────────────────────────────────────────

def analyze_reality_gap(promise: str, reality: str) -> dict:
    """Compare external promise vs internal reality to detect conflicts."""
    prompt = f"""
    You are an alignment AI for startup co-founders.
    External Promise (What was communicated to investors/customers):
    {promise}
    
    Internal Reality (Jira/Slack/Notion current state):
    {reality}
    
    Identify conflicts between the promise and reality.
    Return ONLY JSON:
    {{
      "results": [
        {{
          "id": "unique_string",
          "severity": "Critical|High|Medium",
          "mismatch": "exact conflict description",
          "fix": "recommended immediate action"
        }}
      ]
    }}
    """
    fallback = {
      "results": [
        {{
          "id": "fallback-1",
          "severity": "High",
          "mismatch": "AI analysis temporarily unavailable. Please review manually.",
          "fix": "Check back shortly."
        }}
      ]
    }
    try:
        return parse_or_fallback(_chat(prompt, max_tokens=1024), fallback)
    except Exception as e:
        print(f"Reality check failed: {e}")
        return fallback

def translate_to_paul(tech_update: str) -> dict:
    """Translate technical updates to business/financial impact."""
    prompt = f"""
    You are a 'Technical-to-Business' translation AI.
    The technical co-founder (Sam) just completed this work:
    {tech_update}
    
    Translate this into a business update for the non-technical co-founder (Paul).
    Focus on financial impact, risk, and product timeline.
    Return ONLY JSON:
    {{
      "summary": "1 sentence technical summary",
      "impact": "Detailed business, financial, and timeline impact",
      "risk": "Assessment of execution/downtime risk"
    }}
    """
    fallback = {
        "summary": "Technical update received.",
        "impact": "AI analysis unavailable.",
        "risk": "Unknown"
    }
    try:
        return parse_or_fallback(_chat(prompt, max_tokens=1024), fallback)
    except Exception as e:
        return fallback

def infer_competitor_margin(competitor: str, user_stack: str) -> dict:
    """Infer competitor stack and calculate margin advantage."""
    prompt = f"""
    You are a competitive intelligence AI.
    Competitor Name: {competitor}
    Your Stack: {user_stack}
    
    Infer what tech stack {competitor} is likely using (be highly specific, guess if necessary).
    Compare it to 'Your Stack' and deduce a margin/cost advantage.
    Return ONLY JSON:
    {{
      "inferredStack": "e.g., OpenAI GPT-4, AWS, Vercel",
      "userStack": "{user_stack}",
      "insight": "Detailed strategic insight on why your stack is cheaper/better",
      "advantage": "e.g., Pricing Power, Iteration Speed",
      "marginDelta": "e.g., +80%, 10x Cheaper"
    }}
    """
    fallback = {
        "inferredStack": "Unknown",
        "userStack": user_stack,
        "insight": "AI intelligence unavailable.",
        "advantage": "Unknown",
        "marginDelta": "N/A"
    }
    try:
        return parse_or_fallback(_chat(prompt, max_tokens=1024), fallback)
    except Exception as e:
        return fallback

def calculate_blast_radius(deprecation: str) -> dict:
    """Predict blast radius of an ecosystem deprecation."""
    prompt = f"""
    You are a Senior Staff Engineer AI.
    A dependency deprecation was announced: {deprecation}
    
    Estimate the 'Blast Radius' for a typical modern React/Node/Python stack.
    Return ONLY JSON:
    {{
      "impactLevel": "Critical|High|Medium|Low",
      "affectedFiles": ["/src/example.js", "/backend/example.py"],
      "explanation": "Why this breaks things",
      "estimatedTime": "e.g., 4 hours, 2 days"
    }}
    """
    fallback = {
        "impactLevel": "Unknown",
        "affectedFiles": [],
        "explanation": "AI estimation unavailable.",
        "estimatedTime": "Unknown"
    }
    try:
        return parse_or_fallback(_chat(prompt, max_tokens=1024), fallback)
    except Exception as e:
        return fallback
