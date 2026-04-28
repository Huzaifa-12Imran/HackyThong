import React, { useState } from 'react';
import { apiCall } from '../utils/api';

export default function RealityCheck() {
  const [promise, setPromise] = useState("We are launching the AI agent feature by Friday, fully integrated with Stripe for billing, as promised to our seed investors.");
  const [reality, setReality] = useState("- Jira Sprint: AI Agent API is still returning 500 errors.\n- Notion Notes: Stripe integration blocked by compliance review.\n- Slack: 'We might need to push the agent to next week.'");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const analyzeGap = async () => {
    setLoading(true);
    setResults(null);
    
    try {
      const res = await apiCall('/features/reality-check', { promise, reality }, 'POST');
      if (res.success && res.data && res.data.results) {
        setResults(res.data.results);
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      console.error(err);
      // Fallback in case of failure so demo doesn't crash completely
      setResults([{
        id: "err",
        severity: "Medium",
        mismatch: "Backend connection failed. Displaying simulated fallback.",
        fix: "Check your Cloud Run deployment or OpenRouter API key."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeInUp">
      <div className="mb-8">
        <p className="text-xs font-bold text-accent-red uppercase tracking-[0.2em] mb-2">
          FOUNDER ALIGNMENT
        </p>
        <h2 className="text-3xl font-black text-text-primary tracking-tight">
          Reality Check Engine
        </h2>
        <p className="text-text-secondary mt-2 text-sm">
          Detect contradictions between what is promised externally and what is actually happening internally.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass p-5 rounded-2xl border border-border-dark">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-accent-cyan" style={{ fontSize: 18 }}>campaign</span>
            <h3 className="font-bold text-text-primary">External Promise</h3>
          </div>
          <textarea
            className="w-full h-40 bg-bg-base border border-border-dark rounded-xl p-4 text-sm text-text-secondary focus:border-accent-cyan outline-none resize-none"
            value={promise}
            onChange={(e) => setPromise(e.target.value)}
          />
        </div>

        <div className="glass p-5 rounded-2xl border border-border-dark">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-accent-amber" style={{ fontSize: 18 }}>construction</span>
            <h3 className="font-bold text-text-primary">Internal Reality</h3>
          </div>
          <textarea
            className="w-full h-40 bg-bg-base border border-border-dark rounded-xl p-4 text-sm text-text-secondary focus:border-accent-amber outline-none resize-none"
            value={reality}
            onChange={(e) => setReality(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-center mb-10">
        <button
          onClick={analyzeGap}
          disabled={loading || !promise.trim() || !reality.trim()}
          className="font-black px-10 py-3.5 rounded-xl flex items-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 text-white shadow-glow-cyan"
          style={{ background: loading ? "rgba(6,182,212,0.3)" : "linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)" }}
        >
          {loading ? (
            <><span className="material-symbols-outlined animate-spin_slow">refresh</span> Cross-referencing logic...</>
          ) : (
            <><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>policy</span> Scan for Contradictions</>
          )}
        </button>
      </div>

      {results && (
        <div className="space-y-4 animate-fadeInUp">
          <h3 className="text-xl font-black text-text-primary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-accent-red">warning</span> Detected Conflicts
          </h3>
          {results.map((r) => (
            <div key={r.id} className="glass p-6 rounded-2xl border border-accent-red border-opacity-30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent-red" />
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-accent-red bg-opacity-20 text-accent-red text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                  {r.severity} SEVERITY
                </span>
              </div>
              <p className="text-text-primary text-sm leading-relaxed mb-4">
                <strong>Mismatch:</strong> {r.mismatch}
              </p>
              <div className="bg-bg-sidebar p-4 rounded-xl border border-border-dark flex gap-3 items-start">
                <span className="material-symbols-outlined text-accent-green mt-0.5" style={{ fontSize: 16 }}>build</span>
                <div>
                  <span className="text-xs font-bold text-accent-green uppercase tracking-wider block mb-1">Recommended Fix Action</span>
                  <p className="text-sm text-text-secondary">{r.fix}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
