import os
from dotenv import load_dotenv
load_dotenv('../.env')

from ai.gemini import generate_brief
DEMO_STACK = {
  "founder_id": "demo-founder-001",
  "name": "Sam",
  "burn_rate": 18000,
  "runway_months": 14,
  "stack": {
    "models": [
      { "name": "gemini-2.5-flash", "monthly_cost": 420 }
    ],
    "infrastructure": [],
    "saas_tools": [],
    "total_monthly_cost": 420
  }
}

res = generate_brief(DEMO_STACK, {})
print(res)
