import json
import re


def safe_parse_gemini(raw_response: str) -> dict:
    """
    Extracts valid JSON from Gemini response regardless of formatting.
    Handles: raw JSON, markdown fences, partial responses,
             extra text before/after, single quotes instead of double.
    """
    if not raw_response:
        return None

    # Strategy 1: direct parse (best case)
    try:
        return json.loads(raw_response.strip())
    except Exception:
        pass

    # Strategy 2: strip markdown code fences
    cleaned = re.sub(r'```(?:json)?\n?', '', raw_response).strip()
    try:
        return json.loads(cleaned)
    except Exception:
        pass

    # Strategy 3: find the outermost JSON object
    start = raw_response.find('{')
    end = raw_response.rfind('}')
    if start != -1 and end != -1:
        try:
            return json.loads(raw_response[start:end + 1])
        except Exception:
            pass

    # Strategy 4: find JSON array
    start = raw_response.find('[')
    end = raw_response.rfind(']')
    if start != -1 and end != -1:
        try:
            return json.loads(raw_response[start:end + 1])
        except Exception:
            pass

    # Strategy 5: fix common Gemini quirks
    fixed = raw_response.replace("'", '"') \
                        .replace('True', 'true') \
                        .replace('False', 'false') \
                        .replace('None', 'null')
    try:
        return json.loads(fixed)
    except Exception:
        pass

    # Strategy 6: return None, caller uses fallback
    return None


def parse_or_fallback(raw_response: str, fallback: dict) -> dict:
    """Parse Gemini response or return fallback if all strategies fail."""
    result = safe_parse_gemini(raw_response)
    if result is None:
        return fallback
    return result
