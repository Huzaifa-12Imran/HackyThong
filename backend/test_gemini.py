import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env'))

import google.genai as genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

print(f"Using model: {MODEL}")
print(f"API key starts with: {os.getenv('GEMINI_API_KEY')[:10]}...")

try:
    r = client.models.generate_content(
        model=MODEL,
        contents='Return ONLY valid JSON, no markdown: {"greeting": "hello", "status": "ok"}'
    )
    print(f"Raw response type: {type(r.text)}")
    print(f"Raw response: {repr(r.text[:500])}")
    
    from ai.parser import parse_or_fallback
    parsed = parse_or_fallback(r.text, {"fallback": True})
    print(f"Parsed: {parsed}")
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
