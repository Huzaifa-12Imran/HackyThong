from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv('../.env')

client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

prompt = "Respond with a JSON object: {'ok': true}"

try:
    response = client.chat.completions.create(
        model=os.getenv("AI_MODEL", "gemini-2.5-flash"),
        messages=[{"role": "user", "content": prompt}]
    )
    print("SUCCESS")
    print(response.choices[0].message.content)
except Exception as e:
    import traceback
    traceback.print_exc()
