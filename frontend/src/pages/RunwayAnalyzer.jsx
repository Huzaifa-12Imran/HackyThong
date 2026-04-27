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
    const res = await apiCall("/analyze/cost-impact", { change_description: input });
    setResult(res.data);
    setLoading(false);
  }

  useEffect(() => {
    if (result && !barTriggered.current) {
      barTriggered.current = true;
      const target = Math.min((result.runway_extension_days / 30) * 100, 100);
      setTimeout(() => setBarWidth(target), 50);
    }
  }, [result]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-[11px] font-semibold text-primary uppercase tracking-widest mb-1">EFFICIENCY ENGINE</p>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Runway Impact Analyzer</h2>
        <p className="text-gray-500 mt-2 text-sm">
          Paste a pricing change or ecosystem news. Get the exact dollar impact on your stack.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-400" style={{ fontSize: 16 }}>code</span>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">CHANGE_DESCRIPTION</span>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
          </div>
        </div>
        <div className="p-4">
          <textarea
            className="w-full h-28 font-mono text-sm p-4 border border-gray-100 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none bg-gray-50 text-gray-800"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="px-4 pb-4 flex justify-center">
          <button
            onClick={calculate}
            disabled={loading || !input.trim()}
            className="bg-primary hover:bg-green-800 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-3 transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>refresh</span>
                Running runway analysis...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: 18 }}>calculate</span>
                Calculate Impact
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-5 animate-fadeInUp">
          {/* Cost Comparison */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Current Cost</span>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">BEFORE</span>
              </div>
              <div className="text-4xl font-extrabold text-gray-900">
                ${result.current_cost.toLocaleString()}
                <span className="text-sm font-medium text-gray-400">/mo</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-400">Current runway</span>
                  <span className="font-semibold">14 months</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-400" style={{ width: "60%" }} />
                </div>
              </div>
            </div>

            <div className="bg-white border border-emerald-200 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-tight">
                Optimized
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">New Cost</span>
              </div>
              <div className="text-4xl font-extrabold text-emerald-600">
                ${result.new_cost.toLocaleString()}
                <span className="text-sm font-medium text-emerald-400">/mo</span>
              </div>
              <div className="mt-4 pt-4 border-t border-emerald-100">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-emerald-600">Extended runway</span>
                  <span className="font-bold text-emerald-700">14 months (+{result.runway_extension_days}d)</span>
                </div>
                <div className="w-full h-1.5 bg-emerald-50 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: "75%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Big Savings Number */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <div className="text-5xl font-extrabold text-emerald-500 mb-1">
              +${result.monthly_saving.toLocaleString()}/month saved
            </div>
            <div className="text-gray-500 text-sm">${result.annual_saving.toLocaleString()} annually</div>
          </div>

          {/* Runway Bar */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Runway Extension</span>
              <span className="text-sm font-bold text-emerald-600">+{result.runway_extension_days} days</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${barWidth}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">{result.runway_extension_explanation}</p>
          </div>

          {/* Code Fix */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>code</span>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Recommended Fix</span>
            </div>
            <pre className="p-4 text-sm font-mono text-emerald-700 bg-gray-900 overflow-x-auto leading-relaxed">
              <code>{result.code_fix}</code>
            </pre>
          </div>

          {/* Explanation */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-500 mt-0.5" style={{ fontSize: 18 }}>info</span>
              <div>
                <p className="text-sm text-blue-800 mb-1">{result.explanation}</p>
                {result.bonus_tip && (
                  <p className="text-xs text-blue-600 font-medium">💡 {result.bonus_tip}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Tray */}
          <div className="flex justify-center gap-6 text-gray-400 py-2 border-t border-gray-100">
            {[
              { icon: "download", label: "Export Report" },
              { icon: "share", label: "Share Dashboard" },
              { icon: "history", label: "View History" },
            ].map((btn) => (
              <button key={btn.label} className="flex items-center gap-2 text-sm hover:text-gray-900 transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{btn.icon}</span>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}