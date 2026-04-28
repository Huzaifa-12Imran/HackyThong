import React, { useState } from 'react';

export default function BlastRadius() {
  const [deprecation, setDeprecation] = useState("Firebase Auth v8 deprecation announced for end of Q4.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyze = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult({
        impactLevel: "High",
        affectedFiles: ["/src/middleware/auth.js", "/src/pages/Login.jsx", "/src/pages/Signup.jsx", "/backend/auth_handler.py"],
        explanation: "Firebase Auth v8 uses a singleton pattern that was completely rewritten in v9 (modular approach). This will break all current authentication flows and API token verification.",
        estimatedTime: "4 hours"
      });
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <div className="mb-8 text-center">
        <p className="text-xs font-bold text-accent-amber uppercase tracking-[0.2em] mb-2">DEPENDENCY RISK</p>
        <h2 className="text-3xl font-black text-text-primary tracking-tight">Blast Radius Visualizer</h2>
        <p className="text-text-secondary mt-1 text-sm">Predicts exactly which files in your codebase will break when an external dependency is deprecated.</p>
      </div>

      <div className="glass p-6 rounded-2xl border border-border-dark mb-8 flex flex-col items-center">
        <div className="w-full flex items-center bg-bg-base border border-border-dark rounded-xl overflow-hidden mb-4">
          <span className="material-symbols-outlined text-accent-red ml-4">warning</span>
          <input
            type="text"
            className="flex-1 bg-transparent border-none text-text-primary p-4 outline-none placeholder:text-text-muted text-sm"
            placeholder="Enter deprecation event..."
            value={deprecation}
            onChange={(e) => setDeprecation(e.target.value)}
          />
        </div>
        <button
          onClick={analyze}
          disabled={loading || !deprecation.trim()}
          className="font-black px-8 py-3 rounded-xl flex items-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 text-white"
          style={{ background: loading ? "rgba(245,158,11,0.3)" : "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)" }}
        >
          {loading ? "Calculating impact radius..." : "Simulate Blast Radius"}
        </button>
      </div>

      {result && (
        <div className="animate-fadeInUp">
          <div className="glass rounded-2xl border border-accent-amber border-opacity-30 overflow-hidden shadow-glow-amber mb-6">
            <div className="p-8 text-center relative">
              <div className="absolute inset-0 bg-accent-amber opacity-[0.03]" />
              <h3 className="text-[10px] font-black text-accent-amber uppercase tracking-[0.2em] mb-2 relative">Impact Level</h3>
              <div className="text-7xl font-black text-accent-red relative stat-glow">{result.impactLevel}</div>
              <p className="text-text-secondary mt-4 max-w-xl mx-auto relative">{result.explanation}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-2xl border border-border-dark">
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>file_copy</span> Affected Files
              </h4>
              <ul className="space-y-2">
                {result.affectedFiles.map((file, i) => (
                  <li key={i} className="flex items-center gap-3 bg-bg-base p-2.5 rounded-lg border border-border-dark">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
                    <span className="font-mono text-sm text-text-primary">{file}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass p-6 rounded-2xl border border-border-dark flex flex-col justify-center items-center text-center">
              <span className="material-symbols-outlined text-text-muted mb-2" style={{ fontSize: 32 }}>schedule</span>
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-[0.1em] mb-1">Estimated Fix Time</h4>
              <div className="text-3xl font-black text-text-primary">{result.estimatedTime}</div>
              <p className="text-xs text-text-secondary mt-2">Based on historical velocity for auth-related tasks.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
