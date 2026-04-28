import React from "react";

const SETTINGS_SECTIONS = [
  {
    title: "Demo Configuration",
    icon: "science",
    color: "text-accent-purple-bright",
    items: [
      {
        label: "Demo Mode",
        description: "Use cached responses for reliable demo presentation",
        type: "toggle",
        value: false,
        hint: "Set DEMO_MODE = true in src/utils/api.js before presenting",
      },
      {
        label: "Founder ID",
        description: "Active founder profile for all API calls",
        type: "text",
        value: "demo-founder-001",
      },
    ],
  },
  {
    title: "AI Stack",
    icon: "smart_toy",
    color: "text-accent-green",
    items: [
      {
        label: "AI Model",
        description: "Backend model via OpenRouter",
        type: "badge",
        value: "google/gemini-2.5-flash",
      },
      {
        label: "Backend URL",
        description: "Flask API endpoint",
        type: "badge",
        value: "https://stackpulse-backend-977549320612.us-central1.run.app",
      },
      {
        label: "Demo Cache Endpoints",
        description: "Endpoints with pre-loaded fallback data",
        type: "list",
        value: ["/brief/generate", "/analyze/cost-impact", "/stack/register"],
      },
    ],
  },
  {
    title: "Data & Memory",
    icon: "psychology",
    color: "text-accent-cyan",
    items: [
      {
        label: "Firestore Project",
        description: "Firebase project for stack and memory storage",
        type: "badge",
        value: "hackythong-2026",
      },
      {
        label: "Memory Actions Seeded",
        description: "Historical actions for behavior profile",
        type: "badge",
        value: "8 actions",
      },
    ],
  },
];

export default function Settings() {
  return (
    <div className="max-w-2xl mx-auto animate-fadeInUp">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold text-accent-purple-bright uppercase tracking-[0.2em] mb-2">
          CONFIGURATION
        </p>
        <h2 className="text-3xl font-black text-text-primary tracking-tight">
          Settings
        </h2>
        <p className="text-text-secondary mt-1.5 text-sm">
          System configuration and demo setup reference.
        </p>
      </div>

      <div className="space-y-5">
        {SETTINGS_SECTIONS.map((section) => (
          <div
            key={section.title}
            className="glass rounded-2xl border border-border-dark overflow-hidden"
          >
            {/* Section header */}
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border-dark bg-bg-sidebar">
              <span
                className={`material-symbols-outlined ${section.color}`}
                style={{ fontVariationSettings: "'FILL' 1", fontSize: 18 }}
              >
                {section.icon}
              </span>
              <h3 className="text-sm font-bold text-text-primary">
                {section.title}
              </h3>
            </div>

            {/* Items */}
            <div className="divide-y divide-border-dark">
              {section.items.map((item) => (
                <div key={item.label} className="px-5 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary">
                      {item.label}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {item.description}
                    </p>
                    {item.hint && (
                      <p className="text-xs text-accent-amber mt-1 font-mono">
                        ⚡ {item.hint}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {item.type === "toggle" && (
                      <div
                        className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors cursor-pointer ${
                          item.value ? "bg-accent-green" : "bg-border-bright"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform shadow ${
                            item.value ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </div>
                    )}
                    {item.type === "badge" && (
                      <span className="text-xs font-mono font-bold text-accent-cyan bg-accent-cyan bg-opacity-10 border border-accent-cyan border-opacity-20 px-2.5 py-1 rounded-lg">
                        {item.value}
                      </span>
                    )}
                    {item.type === "text" && (
                      <span className="text-xs font-mono text-text-secondary bg-border-dark px-2.5 py-1 rounded-lg">
                        {item.value}
                      </span>
                    )}
                    {item.type === "list" && (
                      <div className="flex flex-col gap-1 items-end">
                        {item.value.map((v) => (
                          <span
                            key={v}
                            className="text-[10px] font-mono text-accent-green bg-accent-green bg-opacity-10 border border-accent-green border-opacity-15 px-2 py-0.5 rounded"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Quick commands box */}
        <div className="glass rounded-2xl border border-border-dark overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border-dark bg-bg-sidebar">
            <span
              className="material-symbols-outlined text-accent-amber"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: 18 }}
            >
              terminal
            </span>
            <h3 className="text-sm font-bold text-text-primary">Quick Commands</h3>
          </div>
          <div className="p-5 space-y-3">
            {[
              { label: "Start backend", cmd: "cd backend && python app.py" },
              { label: "Seed demo data", cmd: "POST https://stackpulse-backend-977549320612.us-central1.run.app/seed-demo" },
              { label: "Start frontend", cmd: "cd frontend && npm start" },
              { label: "Deploy backend", cmd: "gcloud run deploy stackpulse-backend --source . --region us-central1 --allow-unauthenticated" },
            ].map((c) => (
              <div key={c.label}>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
                  {c.label}
                </p>
                <pre className="text-xs font-mono text-accent-cyan bg-bg-base border border-border-dark rounded-lg px-3 py-2 overflow-x-auto">
                  {c.cmd}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}