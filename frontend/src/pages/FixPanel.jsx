import React, { useState, useEffect } from "react";

export default function FixPanel({ action, visible, onClose, onMarkDone }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!visible) setCopied(false);
  }, [visible]);

  function handleCopy() {
    if (!action) return;
    navigator.clipboard.writeText(action.code_fix).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleMarkDone() {
    onMarkDone();
    onClose();
  }

  const TYPE_LABELS = {
    deprecation: { label: "DEPRECATION", bg: "bg-red-100", text: "text-red-700" },
    cost_saving: { label: "COST SAVING", bg: "bg-emerald-100", text: "text-emerald-700" },
    opportunity: { label: "OPPORTUNITY", bg: "bg-blue-100", text: "text-blue-700" },
  };

  const tc = action ? (TYPE_LABELS[action.type] || TYPE_LABELS.opportunity) : null;

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-lg z-50 bg-white shadow-2xl flex flex-col animate-slideInRight">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              build_circle
            </span>
            <span className="text-sm font-bold text-gray-900">One-Click Fix</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 transition-colors p-1"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>close</span>
          </button>
        </div>

        {/* Panel Body */}
        {action && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Context */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {tc && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${tc.bg} ${tc.text}`}>
                    {tc.label}
                  </span>
                )}
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md uppercase">
                  Priority {action.priority}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {action.confidence_score}% confidence
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">{action.title}</h3>
              <p className="text-emerald-600 font-semibold text-sm mt-1">{action.impact}</p>
            </div>

            {/* Why This Fix */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>help</span>
                Why This Fix?
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">{action.details}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>schedule</span>
                  {action.effort}
                </span>
                {action.runway_extension_days > 0 && (
                  <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>trending_up</span>
                    +{action.runway_extension_days} days runway
                  </span>
                )}
              </div>
            </div>

            {/* Code Fix */}
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-400" style={{ fontSize: 14 }}>code</span>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Code Fix</span>
                </div>
              </div>
              <pre className="p-4 text-sm font-mono text-emerald-400 bg-gray-900 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                <code>{action.code_fix}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Panel Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold text-sm py-2.5 rounded-xl hover:bg-gray-50 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              {copied ? "check_circle" : "content_copy"}
            </span>
            {copied ? "Copied!" : "Copy Fix"}
          </button>
          <button
            onClick={handleMarkDone}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-green-800 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: 16 }}>
              task_alt
            </span>
            Mark Done
          </button>
        </div>
      </div>
    </>
  );
}