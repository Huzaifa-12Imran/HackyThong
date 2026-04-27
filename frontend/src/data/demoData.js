export const DEMO_STACK = {
  founder_id: "demo-founder-001",
  name: "Sam",
  burn_rate: 18000,
  runway_months: 14,
  stack: {
    models: [
      { name: "gemini-2.5-flash", monthly_cost: 420 },
      { name: "text-embedding-004", monthly_cost: 80 },
    ],
    infrastructure: [
      { name: "Cloud Run", monthly_cost: 340 },
      { name: "Firebase Firestore", monthly_cost: 60 },
    ],
    saas_tools: [
      { name: "Pinecone", monthly_cost: 200 },
      { name: "Resend", monthly_cost: 50 },
    ],
    total_monthly_cost: 1150,
  },
};

export const DEMO_BRIEF = {
  health_score: 74,
  health_grade: "C+",
  health_explanation: "Three cost optimizations available. One deprecation risk in 18 days.",
  top_risk: "Pinecone embedding endpoint deprecates August 14th — affects your search feature",
  memory_insight: "Sam has ignored cost-saving actions twice before. Deprecation alerts are flagged higher as a result.",
  summary: "One breaking change needs immediate action. Two cost saves available worth $232/month combined.",
  actions: [
    {
      id: "act-1",
      priority: 1,
      type: "deprecation",
      title: "Pinecone v1 endpoint deprecates in 18 days",
      impact: "Breaks your semantic search feature",
      runway_extension_days: 0,
      urgency: "immediate",
      effort: "45 minutes",
      details:
        "Pinecone deprecated their v1 REST endpoint. Your codebase still uses it. Migration to v2 is a 3-line change but must happen before August 14th or your search feature stops working in production.",
      code_fix:
        `# Change in /backend/ai/embeddings.py\n# Before:\nindex = pinecone.Index('prod-index')\n\n# After:\npc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))\nindex = pc.Index('prod-index')`,
      confidence_score: 97,
    },
    {
      id: "act-2",
      priority: 2,
      type: "cost_saving",
      title: "Replace Pinecone paid tier with Firestore vector search",
      impact: "$200/month eliminated",
      runway_extension_days: 11,
      urgency: "this_week",
      effort: "3 hours",
      details:
        "Firebase recently launched native vector search in Firestore. You already pay for Firestore. Migrating your embeddings storage eliminates your $200/month Pinecone bill entirely.",
      code_fix:
        `# Replace pinecone client with Firestore vector\nfrom google.cloud import firestore\ndb = firestore.Client()\n\n# Store embeddings as Firestore vector fields\n# Full migration guide:\n# firebase.google.com/docs/firestore/vector-search`,
      confidence_score: 91,
    },
    {
      id: "act-3",
      priority: 3,
      type: "cost_saving",
      title: "Switch text-embedding-004 to text-embedding-005",
      impact: "$32/month saved, 15% better quality",
      runway_extension_days: 2,
      urgency: "this_month",
      effort: "10 minutes",
      details:
        "Google released text-embedding-005 last month. It costs 40% less per token and benchmarks 15% better on semantic similarity tasks. Your current usage at $80/month drops to $48/month with one line change.",
      code_fix:
        `# In config.py, change:\nEMBEDDING_MODEL = 'text-embedding-004'\n\n# To:\nEMBEDDING_MODEL = 'text-embedding-005'`,
      confidence_score: 99,
    },
  ],
};

export const DEMO_IMPACT = {
  current_cost: 420,
  new_cost: 294,
  monthly_saving: 126,
  annual_saving: 1512,
  runway_extension_days: 7,
  runway_extension_explanation:
    "At $18,000/month burn rate, saving $126/month extends runway by 7 days",
  urgency: "this_week",
  code_fix:
    `# In config.py:\nGEMINI_MODEL = 'gemini-2.5-flash'  # already set — no change needed\n# Pricing update is automatic. No action required.\n\n# Optional: reduce max_tokens for non-critical calls:\n# This alone saves an additional $40/month\nmax_tokens = 1024  # was 2048`,
  bonus_tip:
    "Reducing max_tokens on your summarization calls saves an additional $40/month on top of the price drop.",
  explanation:
    "Gemini 2.5 Flash's 30% price reduction applies automatically to all API calls from today. Your current $420/month drops to $294/month with zero code changes.",
};

export const TERMINAL_LINES = [
  "→ Initializing StackPulse intelligence layer...",
  "→ Connecting to AI ecosystem feeds...",
  "→ Scanning google.ai... found 2 relevant updates",
  "→ Checking OpenAI changelog...",
  "→ Scanning GitHub blog...",
  "→ Filtering for your stack: gemini-2.5-flash, Cloud Run, Pinecone...",
  "→ Analyzing cost delta vs your stack profile...",
  "→ Checking deprecation notices...",
  "→ Running personalization engine...",
  "→ Loading memory profile: 8 past actions detected",
  "→ Adjusting priorities based on Sam's behavior...",
  "→ Generating prioritized actions...",
  "✓ Brief ready.",
];