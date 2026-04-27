import React, { useState, useEffect } from "react";
import { apiCall } from "../utils/api";

const TYPE_CONFIG = {
  deprecation: {
    label: "DEPRECATION",
    badgeClass: "badge-deprecation",
    iconColor: "text-accent-red",
    icon: "warning",
    ringClass: "priority-1",
  },
  cost_saving: {
    label: "COST SAVING",
    badgeClass: "badge-cost",
    iconColor: "text-accent-green",
    icon: "savings",
    ringClass: "priority-2",
  },
  opportunity: {
    label: "OPPORTUNITY",
    badgeClass: "badge-opportunity",
    iconColor: "text-accent-purple-bright",
    icon: "bolt",
    ringClass: "priority-3",
  },
};

const URGENCY_CONFIG = {
  immediate: { label: "IMMEDIATE", color: "text-accent-red" },
  this_week: { label: "THIS WEEK", color: "text-accent-amber" },
  this_month: { label: "THIS MONTH", color: "text-accent-green" },
};

export default function Dashboard({ onViewFix, onGenerating, onDoneGenerating }) {
  const [brief, setBrief] = useState(null);
  const [initialCost, setInitialCost] = useState(1150);
  const [loading, setLoading] = useState(false);
  const [memoryExpanded, setMemoryExpanded] = useState(false);
  const [doneActions, setDoneActions] = useState([]);

  useEffect(() => {
    // Fetch initial stack data so the cost is accurate before brief generation
    apiCall("/stack/demo-founder-001", {}, "GET")
      .then(res => {
        if (res.success && res.data && res.data.stack) {
          setInitialCost(res.data.stack.total_monthly_cost || 1150);
        }
      })
      .catch(e => console.error("Failed to load initial stack data:", e));
  }, []);

  async function generateBrief() {
    setLoading(true);
    onGenerating();
    try {
      const res = await apiCall("/brief/generate", {
        founder_id: "demo-founder-001",
      });
      setBrief(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    onDoneGenerating();
  }

  const score = brief ? brief.health_score : 74;
  const grade = brief ? brief.health_grade : "C+";

  const scoreColor =
    score >= 85
      ? "text-accent-green"
      : score >= 65
      ? "text-accent-amber"
      : "text-accent-red";

  const scoreBarColor =
    score >= 85
      ? "from-accent-green to-accent-cyan"
      : score >= 65
      ? "from-accent-amber to-yellow-400"
      : "from-accent-red to-orange-500";

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold text-accent-green uppercase tracking-[0.2em] mb-2">
          MORNING BRIEFING
        </p>
        <h2 className="text-3xl font-black text-text-primary tracking-tight">
          {brief ? "Today's Intelligence Report" : "System Ready — Awaiting Brief"}
        </h2>
        {!brief && (
          <p className="text-text-secondary mt-1.5 text-sm">
            Click below to scan the AI ecosystem through your stack's lens.
          </p>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Health Score */}
        <div className="glass rounded-2xl p-5 border border-border-dark relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-accent-green opacity-5 -translate-y-8 translate-x-8" />
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-3">
            Health Score
          </p>
          <div className="flex items-baseline gap-2">
            <span className={`text-5xl font-black ${scoreColor} stat-glow`}>
              {score}
            </span>
            <span
              className={`text-sm font-black px-2 py-0.5 rounded-lg bg-opacity-15 ${scoreColor} ${
                score >= 85
                  ? "bg-accent-green"
                  : score >= 65
                  ? "bg-accent-amber"
                  : "bg-accent-red"
              }`}
              style={{
                background:
                  score >= 85
                    ? "rgba(16,185,129,0.15)"
                    : score >= 65
                    ? "rgba(245,158,11,0.15)"
                    : "rgba(239,68,68,0.15)",
              }}
            >
              {grade}
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-border-dark rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${scoreBarColor} transition-all duration-700 rounded-full`}
              style={{ width: `${score}%` }}
            />
          </div>
          {brief && (
            <p className="text-[11px] text-text-muted mt-2">
              {brief.health_explanation}
            </p>
          )}
        </div>

        {/* Monthly Spend */}
        <div className="glass rounded-2xl p-5 border border-border-dark relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-accent-cyan opacity-5 -translate-y-8 translate-x-8" />
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-3">
            Monthly Spend
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black text-text-primary">
              ${brief && brief.total_monthly_cost ? brief.total_monthly_cost.toLocaleString() : initialCost.toLocaleString()}
            </span>
            <span className="text-sm text-text-muted">/mo</span>
          </div>
          <div className="mt-3 flex items-center text-xs text-accent-green font-bold">
            <span
              className="material-symbols-outlined mr-1"
              style={{ fontSize: 14 }}
            >
              trending_down
            </span>
            4% under budget
          </div>
        </div>

        {/* Top Risk */}
        <div className="glass rounded-2xl p-5 border border-border-dark relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-accent-red opacity-5 -translate-y-8 translate-x-8" />
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-3">
            Top Risk
          </p>
          <div className="flex items-start gap-2">
            <span
              className="material-symbols-outlined text-accent-red mt-0.5 flex-shrink-0"
              style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
            <p className="text-sm text-text-secondary leading-snug">
              {brief
                ? brief.top_risk
                : "Run your morning brief to surface risks."}
            </p>
          </div>
        </div>
      </div>

      {/* Memory Badge */}
      {brief?.memory_insight && (
        <div className="mb-5">
          <button
            onClick={() => setMemoryExpanded((v) => !v)}
            className="flex items-center gap-2 bg-accent-purple bg-opacity-10 border border-accent-purple border-opacity-25 text-accent-purple-bright text-xs font-bold px-3 py-1.5 rounded-full hover:bg-opacity-20 transition-all"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}
            >
              psychology
            </span>
            Memory Active
            {brief.memory_summary && (
              <span className="opacity-70 font-normal">
                — {brief.memory_summary}
              </span>
            )}
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 14 }}
            >
              {memoryExpanded ? "expand_less" : "expand_more"}
            </span>
          </button>
          {memoryExpanded && (
            <div className="mt-2 bg-accent-purple bg-opacity-10 border border-accent-purple border-opacity-20 rounded-xl px-4 py-3 text-sm text-accent-purple-bright animate-fadeInUp">
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
          className="w-full font-black py-5 rounded-2xl text-base mb-8 transition-all active:scale-[0.99] animate-pulse_glow disabled:opacity-60 flex items-center justify-center gap-3 text-white"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1", fontSize: 22 }}
          >
            wb_sunny
          </span>
          Generate Today's Brief
        </button>
      )}

      {/* Regenerate button */}
      {brief && (
        <div className="flex justify-end mb-5">
          <button
            onClick={generateBrief}
            className="flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-text-primary border border-border-dark rounded-xl px-4 py-2 transition-all hover:border-border-bright"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16 }}
            >
              refresh
            </span>
            Regenerate
          </button>
        </div>
      )}

      {/* Action Cards */}
      {brief && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.15em]">
              {brief.actions.length} Prioritized Actions
            </h3>
            <div className="flex-1 h-px bg-border-dark" />
          </div>

          {brief.actions.map((action, idx) => {
            const tc = TYPE_CONFIG[action.type] || TYPE_CONFIG.opportunity;
            const uc = URGENCY_CONFIG[action.urgency] || URGENCY_CONFIG.this_month;
            const done = doneActions.includes(action.id);

            return (
              <div
                key={action.id || idx}
                className={`glass rounded-2xl p-5 border transition-all duration-200 animate-fadeInUp ${
                  done
                    ? "opacity-40 border-border-dark"
                    : `border-border-dark hover:border-border-bright ${tc.ringClass}`
                }`}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Priority circle */}
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 font-black text-sm text-white"
                      style={{
                        background:
                          action.priority === 1
                            ? "linear-gradient(135deg, #ef4444, #f97316)"
                            : action.priority === 2
                            ? "linear-gradient(135deg, #f59e0b, #eab308)"
                            : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      }}
                    >
                      {action.priority}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${tc.badgeClass}`}>
                          {tc.label}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${uc.color}`}>
                          {uc.label}
                        </span>
                      </div>

                      <h4 className={`font-bold text-text-primary text-sm mb-1 ${done ? "line-through opacity-60" : ""}`}>
                        {action.title}
                      </h4>

                      <p className="text-accent-green text-sm font-bold">
                        {action.impact}
                      </p>

                      <p className="text-text-secondary text-xs mt-1.5 leading-relaxed">
                        {action.details}
                      </p>

                      <div className="flex items-center gap-4 mt-2.5 text-xs text-text-muted flex-wrap">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>schedule</span>
                          {action.effort}
                        </span>
                        {action.runway_extension_days > 0 && (
                          <span className="flex items-center gap-1 text-accent-green font-semibold">
                            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>trending_up</span>
                            +{action.runway_extension_days} days runway
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>verified</span>
                          {action.confidence_score}% confidence
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onViewFix(action, () =>
                        setDoneActions((p) => [...p, action.id])
                      )
                    }
                    className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-xl transition-all text-white"
                    style={{
                      background: "linear-gradient(135deg, #10b981, #06b6d4)",
                    }}
                  >
                    View Fix →
                  </button>
                </div>
              </div>
            );
          })}

          {/* Summary */}
          <div className="glass border border-border-dark rounded-2xl px-5 py-4 text-sm text-text-secondary flex items-start gap-3">
            <span
              className="material-symbols-outlined text-accent-purple-bright mt-0.5 flex-shrink-0"
              style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}
            >
              summarize
            </span>
            <span>{brief.summary}</span>
          </div>
        </div>
      )}
    </div>
  );
}