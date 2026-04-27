import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import StackSetup from "./pages/StackSetup";
import Dashboard from "./pages/Dashboard";
import RunwayAnalyzer from "./pages/RunwayAnalyzer";
import LiveTerminal from "./pages/LiveTerminal";
import FixPanel from "./pages/FixPanel";
import Settings from "./pages/Settings";
import { TERMINAL_LINES } from "./data/demoData";

export default function App() {
  const [page, setPage] = useState("setup");
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [fixAction, setFixAction] = useState(null);
  const [fixPanelOpen, setFixPanelOpen] = useState(false);
  const [markDoneCallback, setMarkDoneCallback] = useState(null);

  function openFix(action, onDone) {
    setFixAction(action);
    setMarkDoneCallback(() => onDone);
    setFixPanelOpen(true);
  }

  const PAGE_TITLES = {
    setup: "Stack Setup",
    dashboard: "Morning Briefing",
    analyzer: "Runway Analyzer",
    terminal: "Live Pulse",
    settings: "Settings",
  };

  return (
    <div className="min-h-screen ambient-bg">
      <Sidebar currentPage={page} onNavigate={setPage} />
      <div className="ml-60 flex flex-col min-h-screen">
        <TopBar title={PAGE_TITLES[page]} />
        <main className="flex-1 p-8">
          {page === "setup" && (
            <StackSetup onComplete={() => setPage("dashboard")} />
          )}
          {page === "dashboard" && (
            <Dashboard
              onViewFix={openFix}
              onGenerating={() => setTerminalVisible(true)}
              onDoneGenerating={() => setTerminalVisible(false)}
            />
          )}
          {page === "analyzer" && <RunwayAnalyzer />}
          {page === "terminal" && <LiveTerminalPage />}
          {page === "settings" && <Settings />}
        </main>
      </div>

      {/* Overlays */}
      <LiveTerminal visible={terminalVisible} />
      <FixPanel
        action={fixAction}
        visible={fixPanelOpen}
        onClose={() => setFixPanelOpen(false)}
        onMarkDone={() => markDoneCallback && markDoneCallback()}
      />
    </div>
  );
}

function LiveTerminalPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-bold text-accent-cyan uppercase tracking-[0.2em] mb-2">
          REAL-TIME
        </p>
        <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Live Pulse Terminal
        </h2>
        <p className="text-text-secondary mt-1 text-sm">
          Watch StackPulse scan the AI ecosystem in real-time.
        </p>
      </div>

      <div className="bg-bg-card border border-border-dark rounded-2xl overflow-hidden shadow-card-dark">
        {/* Mac-style title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0a0c18] border-b border-[#1e2a3b]">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 text-text-muted text-xs font-mono font-semibold">
            stackpulse — live_pulse_scanner
          </span>
        </div>
        {/* Static terminal showing all lines */}
        <div className="terminal-body p-5 h-80 overflow-y-auto font-mono text-sm bg-[#07080f]">
          {TERMINAL_LINES.map((line, i) => (
            <div
              key={i}
              className="leading-7 animate-fadeInUp"
              style={{ animationDelay: `${i * 0.06}s`, opacity: 0, animation: `fadeInUp 0.3s ease ${i * 0.06}s forwards` }}
            >
              {line.startsWith("✓") ? (
                <span className="text-accent-green font-bold">{line}</span>
              ) : (
                <span className="text-accent-cyan">{line}</span>
              )}
            </div>
          ))}
          <span className="text-accent-cyan animate-blink">█</span>
        </div>
        {/* Footer */}
        <div className="px-5 py-3 bg-[#0a0c18] border-t border-[#1e2a3b] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span className="text-text-muted text-xs font-mono">
            Scanning AI ecosystem feeds in real-time...
          </span>
        </div>
      </div>
    </div>
  );
}