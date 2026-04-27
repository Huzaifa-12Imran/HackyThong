# StackPulse 🚀

StackPulse is an AI-powered intelligence layer for your tech stack. It analyzes your infrastructure, AI models, and SaaS tools against the latest ecosystem news to surface cost-saving opportunities and breaking deprecation risks.

## 🛠 Tech Stack
We built StackPulse using a modern, scalable architecture:

**Frontend:**
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />

**Backend:**
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" />

**Database & Infrastructure:**
<img src="https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase" />
<img src="https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white" />

---

## 🧠 How we used Google AI

Google AI is the core intelligence engine behind StackPulse. We leverage **Google Gemini 2.5 Flash** to continuously monitor the ever-changing AI and cloud ecosystem. 

Here is exactly how it powers our application:
1. **Contextual Analysis:** We feed Gemini the user's specific tech stack (e.g., Cloud Run, Pinecone, specific LLMs) alongside a real-time feed of API deprecations, pricing changes, and new releases.
2. **Prioritized Action Generation:** Gemini processes this complex data and generates a "Morning Briefing" containing actionable, prioritized insights (e.g., "Switch to Firestore Vector Search to save $200/mo on Pinecone").
3. **Resilient Fallbacks:** To ensure 99.9% uptime for the presentation, our Python backend implements a robust exponential backoff and automatic model-fallback chain (cascading to `gemini-2.0-flash` if rate limits are hit).
4. **Calculated Impact:** While Gemini provides the context and risk assessment, all financial arithmetic (runway extension, exact cost savings) is strictly handled by our Python engine to guarantee deterministic, hallucination-free numbers.

---

## ⚙️ Installation Instructions (For Judges)

To run StackPulse locally on your machine, follow these steps.

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Huzaifa-12Imran/HackyThong.git
cd HackyThong
```

### 2. Start the Backend (Flask + Gemini AI)
Open a terminal and navigate to the backend folder:
```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the Flask server (runs on port 8080)
python app.py
```
*(Note: The repository already includes a `.env` file with a pre-configured API key specifically provisioned for this hackathon evaluation).*

### 3. Start the Frontend (React + Tailwind)
Open a **new** terminal and navigate to the frontend folder:
```bash
cd frontend

# Install Node dependencies
npm install

# Start the React development server (runs on port 3000)
npm start
```

### 4. Experience StackPulse
Once both servers are running:
1. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)
2. You will land on the **Stack Setup** page. Select a few models and infrastructure tools, and hit Complete.
3. On the **Dashboard**, click **"Generate Today's Brief"** to see Google Gemini analyze your stack in real-time!