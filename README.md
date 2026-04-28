# StackPulse 🚀

> Your AI stack. Monitored. Summarized. Acted on.

StackPulse is an AI-powered intelligence layer for technical co-founders building AI products. It analyzes your specific infrastructure, AI models, and SaaS tools against a real-time feed of ecosystem news to surface cost-saving opportunities, deprecation risks, and competitive insights — delivered as a prioritized daily brief.

---

## 🌐 Live Demo

- **Frontend:** https://hackythong-2026.web.app
- **Backend:** https://stackpulse-backend-977549320612.us-central1.run.app

---

## 🛠 Tech Stack

**Frontend:**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Backend:**

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)

**AI & Infrastructure:**

![Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)
![Cloud Run](https://img.shields.io/badge/Cloud%20Run-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)

---

## 📝 What We Built

**The Problem:**
Technical co-founders building AI products lose 4+ hours every week manually tracking model releases, pricing changes, and deprecation notices across a fragmented AI ecosystem. Missing one pricing change costs thousands. Missing one deprecation breaks production at 2am. No existing tool solves this with the specificity it requires.

**The Solution:**
Tell StackPulse your stack once — which AI models you use, which infrastructure you run, which SaaS tools you pay for, and how much you spend monthly. Every day, Gemini 2.5 Flash scans real AI ecosystem news, filters it through your specific architecture and cost profile, and delivers exactly 2-3 actionable items worth acting on today.

Not a feed. Not a chatbot. A personalized intelligence brief built for one specific person: the technical co-founder.

**Who It's For:**
Technical co-founders at pre-seed and seed stage startups building AI products — founders who need to stay current with the AI ecosystem as a competitive obligation, not a nice-to-have.

---

## 🧠 How We Used Google AI

Google Gemini 2.5 Flash is the core intelligence engine behind StackPulse. It is not a feature — it is the product. Without it, StackPulse cannot exist.

Here is exactly how it powers the application:

**1. Real-Time Ecosystem Scanning**
Our backend scrapes live news feeds from Hacker News, Google Cloud release notes, and AI research sources. This raw data is fed directly into Gemini alongside the founder's stack profile so every brief is based on what is actually happening today — not training data.

**2. Stack-Aware Prioritization**
Gemini receives the founder's complete stack profile and filters the entire ecosystem through their specific architecture. A Gemini price change is irrelevant to a founder not using Gemini. Relevant to one using it at $420/month. Gemini understands this distinction and surfaces only what matters to this specific founder.

**3. Prioritized Action Generation**
Gemini processes the filtered data and generates a structured morning brief containing exactly 2-3 prioritized actions — cost savings, deprecation warnings, or competitive opportunities — each with a specific impact estimate and effort level.

**4. Cost Impact Analysis**
When a pricing change is detected, Gemini calculates the exact dollar impact on the founder's specific usage pattern. Input: "Gemini 2.5 Flash price reduced 30%." Output: "Your spend drops from $420 to $294/month. Save $126/month. Change one line in your config. Do it this week."

**5. Resilient AI Pipeline**
Our backend implements exponential backoff and an automatic model fallback chain — cascading from gemini-2.5-flash to gemini-2.0-flash if rate limits are hit — ensuring the demo never fails during judging.

**6. Hallucination-Free Financials**
All financial arithmetic — runway extension, exact cost savings, monthly deltas — is handled deterministically in Python. Gemini provides context and risk assessment. Python handles the math. This guarantees accurate numbers every time.

---

## ⚙️ Installation Instructions

### Prerequisites
- Node.js v18+
- Python 3.10+
- Git
- Google Cloud CLI (gcloud)

### 1. Clone the Repository
```bash
git clone https://github.com/Huzaifa-12Imran/HackyThong.git
cd HackyThong
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory using the provided `.env.example` as a template:
```bash
cp .env.example .env
```
Fill in your own API keys in the `.env` file.

### 3. Start the Backend
Open a terminal and navigate to the backend folder:
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs on http://localhost:8080

### 4. Start the Frontend
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
npm start
```
Frontend runs on http://localhost:3000

### 5. Experience StackPulse
1. Open http://localhost:3000
2. Land on the Stack Setup page — select your AI models, infrastructure tools, and monthly costs
3. Click Complete Setup
4. On the Dashboard click "Generate Today's Brief" to see Gemini analyze your stack in real time
5. Try the Cost Analyzer — paste any pricing change and watch StackPulse calculate your exact dollar impact

---

## 🏗 System Architecture

```
React Frontend (Firebase Hosting)
        ↓ All API calls via config.js
Flask Backend (Google Cloud Run)
        ↓ Real news scraping (HN, GCP release notes)
        ↓ Gemini 2.5 Flash (google-genai SDK)
        ↓ Deterministic cost calculations (Python)
Firebase Firestore
        ↓ Stack profiles + brief history + action tracking
        ↓ Results back to frontend
React Dashboard
```

---

## ☁️ Deployment

**Backend — Google Cloud Run:**
```bash
cd backend
gcloud run deploy stackpulse-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --project hackythong-2026
```

**Frontend — Firebase Hosting:**
```bash
cd frontend
firebase deploy
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Server health check |
| POST | /stack/register | Register founder's tech stack |
| GET | /stack/:founder_id | Retrieve stack profile |
| POST | /brief/generate | Generate AI daily brief |
| GET | /brief/history/:founder_id | Retrieve past briefs |
| POST | /analyze/cost-impact | Analyze cost impact of a change |
| GET | /stack/health/:founder_id | Get stack health score |
| POST | /chat | Natural language stack query |

All responses follow:
```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

---

## 📦 Third-Party Tools & Libraries Disclosure

| Tool | Purpose |
|---|---|
| Google Gemini 2.5 Flash | Core AI intelligence engine |
| google-genai SDK | Gemini API integration |
| Firebase Firestore | Stack profiles and brief history |
| Firebase Hosting | Frontend deployment |
| Google Cloud Run | Backend deployment |
| Flask | Backend API framework |
| flask-cors | Cross-origin request handling |
| python-dotenv | Environment variable management |
| BeautifulSoup4 | Real-time news scraping |
| requests | HTTP client for news feeds |
| React | Frontend framework |
| Tailwind CSS | UI styling |
| Antigravity IDE | AI-assisted development |
| Google Stitch MCP | UI generation tooling |

---

## 👥 Team

Built in 24 hours at Build with AI Hackathon 2026
Huzaifa Imran, Muhammad Arslan, Muhammad Ahmad
GDG on Campus, FAST NUCES CFD

---

*Built with Gemini 2.5 Flash · Firebase · Google Cloud Run · React*