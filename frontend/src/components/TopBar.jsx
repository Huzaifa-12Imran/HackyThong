import React from "react";

export default function TopBar({ title }) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 bg-bg-secondary border-b border-border-dark flex items-center justify-between px-8 h-14">
      {/* Left: page title */}
      <div className="flex items-center gap-3">
        <div className="w-px h-5 bg-gradient-to-b from-accent-green to-transparent rounded-full" />
        <h2 className="text-sm font-bold text-text-primary">{title}</h2>
      </div>

      {/* Right: meta info */}
      <div className="flex items-center gap-5">
        {/* Demo badge */}
        <div className="flex items-center gap-1.5 bg-accent-purple bg-opacity-15 border border-accent-purple border-opacity-25 text-accent-purple-bright text-[10px] font-bold px-2.5 py-1 rounded-full">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}
          >
            psychology
          </span>
          AI ACTIVE
        </div>

        {/* Sam's context */}
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}
          >
            account_circle
          </span>
          <span className="font-medium text-text-secondary">Sam</span>
          <span className="text-border-bright">·</span>
          <span>demo-founder-001</span>
        </div>

        {/* Time */}
        <div className="text-xs text-text-muted font-mono">
          {dateStr} · {timeStr}
        </div>
      </div>
    </header>
  );
}