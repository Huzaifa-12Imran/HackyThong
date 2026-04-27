import React, { useState } from "react";
import { DEMO_BRIEF } from "../data/demoData";
import { apiCall } from "../utils/api";

const TYPE_COLORS = {
  deprecation: { bg: "bg-red-100", text: "text-red-700", label: "DEPRECATION" },
  cost_saving: { bg: "bg-emerald-100", text: "text-emerald-700", label: "COST SAVING" },
  opportunity: { bg: "bg-blue-100", text: "text-blue-700", label: "OPPORTUNITY" },
};

const URGENCY_COLORS = {
  immediate: "text-red-600",
  this_week: "text-amber-600",
  this_month: "text-emerald-600",
};

export default function Dashboard({ onViewFix, onGenerating, onDoneGenerating }) {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [memoryExpanded, setMemoryExpanded] = useState(false);
  const [doneActions, setDoneActions] = useState([]);

  async function generateBrief() {
    setLoading(true);
    onGenerating();
    const res = await apiCall("/brief/generate", {});
    setBrief(res.data);
    setLoading(false);
    onDoneGenerating();
  }

  const score = brief ? brief.health_score : 74;
  const grade = brief ? brief.health_grade : "C+";
  const gradeColor =
    score >= 85 ? "text-emerald-600 bg-emerald-50" :
    score >= 65 ? "text-amber-600 bg-amber-50" :
    "text-red-600 bg-red-50";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold text-primary uppercase tracking-widest mb-1">MORNING BRIEFING</p>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {brief ? "Today's Intelligence Report" : "System Status: Ready"}
        </h2>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {/* Health Score */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Health Score</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-gray-900">{score}</span>
            <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${gradeColor}`}>{grade}</span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${score}%` }}
            />
          </div>
          {brief && <p className="text-xs text-gray-500 mt-2">{brief.health_explanation}</p>}
        </div>

        {/* Monthly Spend */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Monthly Spend</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-gray-900">$1,150</span>
            <span className="text-sm text-gray-400">/mo</span>
          </div>
          <div className="mt-3 flex items-center text-xs text-emerald-600 font-semibold">
            <span className="material-symbols-outlined mr-1" style={{ fontSize: 14 }}>trending_down</span>
            4% under budget
          </div>
        </div>

        {/* Top Risk */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Top Risk</p>
          <div className="flex items-start gap-2 mt-1">
            <span className="material-symbols-outlined text-red-500 mt-0.5" style={{ fontSize: 18 }}>warning</span>
            <p className="text-sm text-gray-700 leading-snug">
              {brief ? brief.top_risk : "Run your morning brief to surface risks."}
            </p>
          </div>
        </div>
      </div>

      {/* Memory Badge */}
      {brief?.memory_insight && (
        <div className="mb-5">
          <button
            onClick={() => setMemoryExpanded((v) => !v)}
            className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>
              psychology
            </span>
            Memory Active
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              {memoryExpanded ? "expand_less" : "expand_more"}
            </span>
          </button>
          {memoryExpanded && (
            <div className="mt-2 bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3 text-sm text-indigo-800 animate-fadeInUp">
              {brief.memory_insight}
            </div>
          )}
        </div>
      )}

      {/* Generate Button */}
      {!brief && (
        <button
          onClick={generateBrief}
          disabled={loading}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl text-base mb-8 transition-all hover:bg-green-800 active:scale-[0.99] animate-pulse_glow disabled:opacity-70 flex items-center justify-center gap-3"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
          Generate Today's Brief
        </button>
      )}

      {/* Regenerate small button */}
      {brief && (
        <div className="flex justify-end mb-5">
          <button
            onClick={generateBrief}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary border border-gray-200 rounded-lg px-3 py-1.5 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
            Regenerate
          </button>
        </div>
      )}

      {/* Action Cards */}
      {brief && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {brief.actions.length} Prioritized Actions
          </h3>
          {brief.actions.map((action) => {
            const tc = TYPE_COLORS[action.type] || TYPE_COLORS.opportunity;
            const done = doneActions.includes(action.id);
            return (
              <div
                key={action.id}
                className={`bg-white border rounded-xl p-5 transition-all animate-fadeInUp ${
                  done ? "opacity-60 border-gray-100" : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Priority Badge */}
                    <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {action.priority}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${tc.bg} ${tc.text}`}>
                          {tc.label}
                        </span>
                        <span className={`text-[10px] font-semibold uppercase ${URGENCY_COLORS[action.urgency]}`}>
                          {action.urgency.replace("_", " ")}
                        </span>
                      </div>
                      <h4 className={`font-bold text-gray-900 text-sm mb-1 ${done ? "line-through" : ""}`}>
                        {action.title}
                      </h4>
                      <p className="text-emerald-600 text-sm font-semibold">{action.impact}</p>
                      <p className="text-gray-500 text-xs mt-1">{action.details}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>schedule</span>
                          {action.effort}
                        </span>
                        {action.runway_extension_days > 0 && (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>trending_up</span>
                            +{action.runway_extension_days} days runway
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>verified</span>
                          {action.confidence_score}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onViewFix(action, () => setDoneActions((p) => [...p, action.id]))}
                    className="flex-shrink-0 bg-gray-900 hover:bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                  >
                    View Fix
                  </button>
                </div>
              </div>
            );
          })}

          {/* Summary */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm text-gray-600 flex items-start gap-2">
            <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: 16 }}>summarize</span>
            {brief.summary}
          </div>
        </div>
      )}
    </div>
  );
}