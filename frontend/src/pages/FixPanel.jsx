import React, { useState, useEffect } from "react";

const TYPE_LABELS = {
  deprecation: { label: "DEPRECATION", badgeClass: "badge-deprecation" },
  cost_saving: { label: "COST SAVING", badgeClass: "badge-cost" },
  opportunity: { label: "OPPORTUNITY", badgeClass: "badge-opportunity" },
};

export default function FixPanel({ action, visible, onClose, onMarkDone }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!visible) setCopied(false);
  }, [visible]);

  function handleCopy() {
    if (!action?.code_fix) return;
    navigator.clipboard.writeText(action.code_fix).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleMarkDone() {
    onMarkDone();
    onClose();
  }

  const tc = action ? TYPE_LABELS[action.type] || TYPE_LABELS.opportunity : null;

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-lg z-50 flex flex-col animate-slideInRight"
        style={{ background: "#0d0f1c", borderLeft: "1px solid #1e2a3b" }}>

        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-green to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-dark flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent-green bg-opacity-15 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-accent-green"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: 16 }}
              >
                build_circle
              </span>
            </div>
            <span className="text-sm font-bold text-text-primary">One-Click Fix</span>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-bg-card"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              close
            </span>
          </button>
        </div>

        {/* Body */}
        {action && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Context */}
            <div>
              <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                {tc && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${tc.badgeClass}`}>
                    {tc.label}
                  </span>
                )}
                <span className="text-[10px] font-bold text-text-muted bg-border-dark px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Priority {action.priority}
                </span>
                <span className="text-[10px] font-bold text-accent-green bg-accent-green bg-opacity-10 border border-accent-green border-opacity-20 px-2 py-0.5 rounded-md">
                  {action.confidence_score}% confidence
                </span>
              </div>
              <h3 className="text-xl font-black text-text-primary leading-tight">
                {action.title}
              </h3>
              <p className="text-accent-green font-bold text-sm mt-1">
                {action.impact}
              </p>
            </div>

            {/* Why This Fix */}
            <div className="glass rounded-xl p-4 border border-border-dark">
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-[0.12em] mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>
                  help
                </span>
                Why This Fix?
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                {action.details}
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-text-muted flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>schedule</span>
                  {action.effort}
                </span>
                {action.runway_extension_days > 0 && (
                  <span className="text-accent-green flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>trending_up</span>
                    +{action.runway_extension_days} days runway
                  </span>
                )}
              </div>
            </div>

            {/* Code Fix */}
            <div className="rounded-xl overflow-hidden border border-border-dark">
              <div className="flex items-center justify-between px-4 py-2.5 bg-bg-sidebar border-b border-border-dark">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-accent-green"
                    style={{ fontSize: 13 }}
                  >
                    code
                  </span>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.12em]">
                    Code Fix
                  </span>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-accent-red opacity-60" />
                  <div className="w-2 h-2 rounded-full bg-accent-amber opacity-60" />
                  <div className="w-2 h-2 rounded-full bg-accent-green opacity-60" />
                </div>
              </div>
              <pre className="p-5 text-sm font-mono text-accent-green bg-bg-base overflow-x-auto leading-relaxed whitespace-pre-wrap">
                <code>{action.code_fix}</code>
              </pre>
            </div>

            {/* Past similar resolved */}
            {action.past_similar_resolved > 0 && (
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span
                  className="material-symbols-outlined text-accent-green"
                  style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                StackPulse has resolved {action.past_similar_resolved} similar{" "}
                {action.past_similar_resolved === 1 ? "issue" : "issues"} for this stack before.
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-border-dark px-6 py-4 flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 border border-border-bright text-text-secondary font-bold text-sm py-3 rounded-xl hover:bg-bg-card transition-all"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16, fontVariationSettings: copied ? "'FILL' 1" : "'FILL' 0" }}
            >
              {copied ? "check_circle" : "content_copy"}
            </span>
            {copied ? "Copied!" : "Copy Fix"}
          </button>
          <button
            onClick={handleMarkDone}
            className="flex-1 flex items-center justify-center gap-2 font-black text-sm py-3 rounded-xl transition-all text-white"
            style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)" }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: 16 }}
            >
              task_alt
            </span>
            Mark Done
          </button>
        </div>
      </div>
    </>
  );
}