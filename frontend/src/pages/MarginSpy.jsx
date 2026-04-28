import React, { useState } from 'react';
import { apiCall } from '../utils/api';

export default function MarginSpy() {
  const [competitor, setCompetitor] = useState("AcmeCorp AI");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeCompetitor = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const res = await apiCall('/features/margin-spy', { competitor }, 'POST');
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      console.error(err);
      setResult({
        inferredStack: "Error communicating with AI.",
        userStack: "Gemini 2.5 Flash, Cloud Run, Firebase",
        insight: "Backend connection failed. Displaying simulated fallback.",
        advantage: "Unknown",
        marginDelta: "N/A"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <div className="text-center mb-8">
        <p className="text-xs font-bold text-accent-green uppercase tracking-[0.2em] mb-2">
          COMPETITIVE INTELLIGENCE
        </p>
        <h2 className="text-3xl font-black text-text-primary tracking-tight">
          Margin Spy
        </h2>
        <p className="text-text-secondary mt-2 text-sm">
          Infer a competitor's likely tech stack and calculate your defensive margin advantage.
        </p>
      </div>

      <div className="glass rounded-2xl overflow-hidden mb-8 border border-border-dark flex items-center p-2">
        <span className="material-symbols-outlined text-text-muted ml-4" style={{ fontSize: 24 }}>search</span>
        <input
          type="text"
          className="flex-1 bg-transparent border-none text-text-primary p-4 outline-none placeholder:text-text-muted"
          placeholder="Enter competitor name (e.g. AcmeCorp AI)"
          value={competitor}
          onChange={(e) => setCompetitor(e.target.value)}
        />
        <button
          onClick={analyzeCompetitor}
          disabled={loading || !competitor.trim()}
          className="font-black px-6 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 text-white"
          style={{ background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)" }}
        >
          {loading ? "Spying..." : "Analyze Stack"}
        </button>
      </div>

      {result && (
        <div className="space-y-6 animate-fadeInUp">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-2xl border border-border-dark opacity-60 grayscale">
              <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-4">Inferred Competitor Stack</h4>
              <div className="text-lg font-medium text-text-secondary">{result.inferredStack}</div>
            </div>
            <div className="glass p-6 rounded-2xl border border-accent-cyan border-opacity-30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-accent-cyan bg-opacity-20 text-accent-cyan text-[9px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Your Stack
              </div>
              <h4 className="text-[10px] font-bold text-accent-cyan uppercase tracking-[0.15em] mb-4">Actual StackPulse Data</h4>
              <div className="text-lg font-black text-text-primary">{result.userStack}</div>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 text-center border border-accent-green border-opacity-40 relative overflow-hidden shadow-glow-green">
            <div className="absolute inset-0 bg-accent-green opacity-[0.05] rounded-2xl" />
            <div className="relative">
              <div className="text-[10px] font-bold text-accent-green uppercase tracking-[0.2em] mb-4">Strategic Advantage: {result.advantage}</div>
              <div className="text-6xl font-black text-accent-green mb-6 stat-glow">
                {result.marginDelta} <span className="text-2xl text-accent-green opacity-80">Cost Advantage</span>
              </div>
              <div className="bg-bg-sidebar border border-border-dark p-5 rounded-xl inline-block max-w-2xl text-left">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-accent-cyan" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
                  <p className="text-sm text-text-primary leading-relaxed">
                    {result.insight}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
