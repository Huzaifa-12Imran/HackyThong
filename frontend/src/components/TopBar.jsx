import React from "react";

export default function TopBar({ title }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border-dark flex items-center justify-between px-8 h-14">
      {/* Left: page title + date */}
      <div className="flex items-center gap-3">
        <h2 className="text-base font-semibold text-text-primary">{title}</h2>
        <span className="text-border-bright">|</span>
        <span className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            calendar_today
          </span>
          {dateStr}
        </span>
      </div>

      {/* Right: search + icons + avatar */}
      <div className="flex items-center gap-4">
        {/* Search bar */}
        <div className="flex items-center gap-2 bg-bg-base border border-border-dark rounded-lg px-3 py-1.5 w-44">
          <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 15 }}>
            search
          </span>
          <span className="text-xs text-text-muted">Search insights...</span>
        </div>

        {/* Notification */}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-card-hover transition-colors text-text-muted">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>notifications</span>
        </button>

        {/* Help */}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-card-hover transition-colors text-text-muted">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>help_outline</span>
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
          S
        </div>
      </div>
    </header>
  );
}