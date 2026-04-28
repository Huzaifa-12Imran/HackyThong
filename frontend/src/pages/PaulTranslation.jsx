import React, { useState } from 'react';

export default function PaulTranslation() {
  const [techInput, setTechInput] = useState("Migrating primary vector search from Pinecone to pgvector on existing Supabase instance. Refactoring standard LLM calls from GPT-4o to Gemini 2.5 Flash for non-reasoning tasks.");
  const [loading, setLoading] = useState(false);
  const [translation, setTranslation] = useState(null);

  const translate = () => {
    setLoading(true);
    setTranslation(null);
    setTimeout(() => {
      setTranslation({
        summary: "Technical Update: Sam is migrating our database structure and switching AI models.",
        impact: "Product ships might be delayed by 1 day, but our unit economics will improve by 30%, giving us significantly better margins for the upcoming YC application and reducing our monthly burn by $850.",
        risk: "Low. Users will not experience any downtime."
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <div className="mb-8">
        <p className="text-xs font-bold text-accent-cyan uppercase tracking-[0.2em] mb-2">COMMUNICATION LAYER</p>
        <h2 className="text-3xl font-black text-text-primary tracking-tight">The "Paul" Translation</h2>
        <p className="text-text-secondary mt-1 text-sm">Automatically translates technical backend changes into business and financial impacts.</p>
      </div>

      <div className="glass p-5 rounded-2xl border border-border-dark mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 18 }}>code</span>
          <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider">Technical Log (Sam)</h3>
        </div>
        <textarea
          className="w-full h-32 bg-bg-base border border-border-dark rounded-xl p-4 text-sm font-mono text-accent-cyan focus:border-accent-cyan outline-none resize-none leading-relaxed"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
        />
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={translate}
          disabled={loading || !techInput.trim()}
          className="font-black px-8 py-3 rounded-xl flex items-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 text-white shadow-glow-cyan"
          style={{ background: loading ? "rgba(6,182,212,0.3)" : "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)" }}
        >
          {loading ? "Translating..." : "Generate Business Translation"}
        </button>
      </div>

      {translation && (
        <div className="glass rounded-2xl border border-accent-green border-opacity-30 overflow-hidden shadow-glow-green animate-fadeInUp">
          <div className="bg-accent-green bg-opacity-10 p-4 border-b border-accent-green border-opacity-20 flex items-center gap-2">
            <span className="material-symbols-outlined text-accent-green">record_voice_over</span>
            <span className="font-bold text-accent-green uppercase tracking-widest text-xs">Translated for Paul</span>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Summary</h4>
              <p className="text-text-primary">{translation.summary}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Business & Financial Impact</h4>
              <p className="text-text-primary text-lg leading-relaxed font-medium bg-bg-sidebar p-4 rounded-xl border border-border-dark">
                {translation.impact}
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Execution Risk</h4>
              <p className="text-text-secondary">{translation.risk}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
