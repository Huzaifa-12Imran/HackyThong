import React, { useState, useEffect, useRef } from "react";
import { apiCall } from "../utils/api";

const DEFAULT_INPUT =
  "Gemini 2.5 Flash announced a 30% price reduction effective immediately.";

export default function RunwayAnalyzer() {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [barWidth, setBarWidth] = useState(0);
  const barTriggered = useRef(false);

  async function calculate() {
    setLoading(true);
    setResult(null);
    setBarWidth(0);
    barTriggered.current = false;
    try {
      const res = await apiCall("/analyze/cost-impact", {
        founder_id: "demo-founder-001",
        change_description: input,
      });
      setResult(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (result && !barTriggered.current) {
      barTriggered.current = true;
      const target = Math.min((result.runway_extension_days / 30) * 100, 100);
      setTimeout(() => setBarWidth(target), 100);
    }
  }, [result]);

  return (
    <div className="max-w-3xl mx-auto animate-fadeInUp">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-xs font-bold text-accent-cyan uppercase tracking-[0.2em] mb-2">
          EFFICIENCY ENGINE
        </p>
        <h2 className="text-3xl font-black text-text-primary tracking-tight">
          Runway Impact Analyzer
        </h2>
        <p className="text-text-secondary mt-2 text-sm">
          Paste a pricing change or ecosystem news. Get the exact dollar impact on your stack.
        </p>
      </div>

      {/* Input Card */}
      <div className="glass rounded-2xl overflow-hidden mb-6 border border-border-dark">
        {/* Terminal-style header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-bg-sidebar border-b border-border-dark">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-accent-cyan"
              style={{ fontSize: 14 }}
            >
              code
            </span>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.12em]">
              CHANGE_DESCRIPTION
            </span>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-red opacity-70" />
            <span className="w-2.5 h-2.5 rounded-full bg-accent-amber opacity-70" />
            <span className="w-2.5 h-2.5 rounded-full bg-accent-green opacity-70" />
          </div>
        </div>

        <div className="p-4">
          <textarea
            className="w-full h-28 font-mono text-sm p-4 border border-border-dark rounded-xl focus:outline-none focus:border-accent-cyan resize-none bg-bg-base text-text-primary placeholder:text-text-muted transition-colors"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="px-4 pb-4 flex justify-center">
          <button
            onClick={calculate}
            disabled={loading || !input.trim()}
            className="font-black px-10 py-3.5 rounded-xl flex items-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 text-white shadow-glow-cyan"
            style={{
              background: loading
                ? "rgba(6,182,212,0.3)"
                : "linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)",
            }}
          >
            {loading ? (
              <>
                <span
                  className="material-symbols-outlined animate-spin_slow"
                  style={{ fontSize: 18 }}
                >
                  refresh
                </span>
                Running runway analysis...
              </>
            ) : (
              <>
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: 18 }}
                >
                  calculate
                </span>
                Calculate Impact →
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fadeInUp">
          {/* Cost Comparison Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Before */}
            <div className="glass rounded-2xl p-5 border border-border-dark">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.12em]">
                  Current Cost
                </span>
                <span className="text-[9px] font-black text-text-muted bg-border-dark px-2 py-0.5 rounded uppercase tracking-wider">
                  BEFORE
                </span>
              </div>
              <div className="text-5xl font-black text-text-primary">
                ${(result.current_cost || 0).toLocaleString()}
                <span className="text-sm font-medium text-text-muted">/mo</span>
              </div>
              <div className="mt-4 pt-4 border-t border-border-dark">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-text-muted">Current runway</span>
                  <span className="font-bold text-text-secondary">14 months</span>
                </div>
                <div className="w-full h-2 bg-border-dark rounded-full overflow-hidden">
                  <div className="h-full bg-text-muted rounded-full" style={{ width: "60%" }} />
                </div>
              </div>
            </div>

            {/* After */}
            <div className="glass rounded-2xl p-5 border border-accent-green border-opacity-30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-accent-green bg-opacity-15 text-accent-green text-[9px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Optimized
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-accent-green uppercase tracking-[0.12em]">
                  New Cost
                </span>
              </div>
              <div className="text-5xl font-black text-accent-green stat-glow">
                ${(result.new_cost || 0).toLocaleString()}
                <span className="text-sm font-medium text-accent-green opacity-60">/mo</span>
              </div>
              <div className="mt-4 pt-4 border-t border-accent-green border-opacity-20">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-accent-green opacity-70">Extended runway</span>
                  <span className="font-black text-accent-green">
                    14 months (+{result.runway_extension_days || 0}d)
                  </span>
                </div>
                <div className="w-full h-2 bg-accent-green bg-opacity-10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: "75%", background: "linear-gradient(90deg, #10b981, #06b6d4)" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Trophy Moment — Big Savings */}
          <div className="glass rounded-2xl p-8 text-center border border-accent-green border-opacity-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-accent-green opacity-[0.03] rounded-2xl" />
            <div className="relative">
              <div
                className="text-6xl font-black text-accent-green mb-2 stat-glow"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                +${(result.monthly_saving || 0).toLocaleString()}
                <span className="text-2xl">/month saved</span>
              </div>
              <div className="text-text-muted text-sm">
                ${(result.annual_saving || 0).toLocaleString()} saved annually
              </div>
              {result.saving_percentage > 0 && (
                <div className="mt-2 inline-flex items-center gap-1.5 bg-accent-green bg-opacity-10 border border-accent-green border-opacity-25 text-accent-green text-xs font-bold px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>trending_down</span>
                  {result.saving_percentage}% cost reduction
                </div>
              )}
            </div>
          </div>

          {/* Runway Bar — THE TROPHY MOMENT */}
          <div className="glass rounded-2xl p-6 border border-border-dark">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-text-primary">
                Runway Extension
              </span>
              <span className="text-sm font-black text-accent-green">
                +{result.runway_extension_days} days
              </span>
            </div>
            <div className="w-full h-4 bg-border-dark rounded-full overflow-hidden">
              <div
                className="runway-bar h-full"
                style={{ width: `${barWidth}%` }}
              />
            </div>
            <p className="text-xs text-text-muted mt-3">
              {result.runway_extension_explanation}
            </p>
          </div>

          {/* Code Fix */}
          <div className="glass rounded-2xl overflow-hidden border border-border-dark">
            <div className="flex items-center gap-2 px-4 py-3 bg-bg-sidebar border-b border-border-dark">
              <span
                className="material-symbols-outlined text-accent-green"
                style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}
              >
                code
              </span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.12em]">
                Recommended Fix
              </span>
            </div>
            <pre className="p-5 text-sm font-mono text-accent-green bg-bg-base overflow-x-auto leading-relaxed">
              <code>{result.code_fix}</code>
            </pre>
          </div>

          {/* Explanation */}
          <div className="glass rounded-2xl p-5 border border-accent-cyan border-opacity-20">
            <div className="flex items-start gap-3">
              <span
                className="material-symbols-outlined text-accent-cyan mt-0.5 flex-shrink-0"
                style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
              >
                info
              </span>
              <div>
                <p className="text-sm text-text-secondary leading-relaxed mb-1">
                  {result.explanation}
                </p>
                {result.bonus_tip && (
                  <p className="text-xs text-accent-cyan font-semibold">
                    💡 {result.bonus_tip}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action tray */}
          <div className="flex justify-center gap-6 text-text-muted py-2 border-t border-border-dark">
            <button
              onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
                const a = document.createElement('a');
                a.setAttribute("href", dataStr);
                a.setAttribute("download", "runway-impact-report.json");
                a.click();
              }}
              className="flex items-center gap-2 text-xs hover:text-text-primary transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>download</span>
              Export Report
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Share link copied to clipboard!");
              }}
              className="flex items-center gap-2 text-xs hover:text-text-primary transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>share</span>
              Share Dashboard
            </button>
            <button
              onClick={() => alert("Runway impact history will be available in v2!")}
              className="flex items-center gap-2 text-xs hover:text-text-primary transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>history</span>
              View History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}