import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import StackSetup from "./pages/StackSetup";
import Dashboard from "./pages/Dashboard";
import RunwayAnalyzer from "./pages/RunwayAnalyzer";
import LiveTerminal from "./pages/LiveTerminal";
import FixPanel from "./pages/FixPanel";
import Settings from "./pages/Settings";

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
    <div className="min-h-screen bg-[#f9f9ff]">
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
          {page === "terminal" && (
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <p className="text-[11px] font-semibold text-primary uppercase tracking-widest mb-1">REAL-TIME</p>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Live Pulse Terminal</h2>
                <p className="text-gray-500 mt-1 text-sm">Watch StackPulse scan the AI ecosystem in real-time.</p>
              </div>
              <div className="bg-[#0a0a0f] border border-[#222233] rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-[#111118] border-b border-[#222233]">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-[#8888aa] text-xs font-mono font-semibold">
                    stackpulse — live_pulse_scanner
                  </span>
                </div>
                <LiveTerminalStatic />
              </div>
            </div>
          )}
          {page === "settings" && <Settings />}
        </main>
      </div>

      {/* Overlays */}
      <LiveTerminal
        visible={terminalVisible}
      />
      <FixPanel
        action={fixAction}
        visible={fixPanelOpen}
        onClose={() => setFixPanelOpen(false)}
        onMarkDone={() => markDoneCallback && markDoneCallback()}
      />
    </div>
  );
}

// Static version of terminal for the /terminal page
function LiveTerminalStatic() {
  const { TERMINAL_LINES } = require("./data/demoData");
  return (
    <div className="terminal-body p-5 h-72 overflow-y-auto font-mono text-sm">
      {TERMINAL_LINES.map((line, i) => (
        <div key={i} className={line.startsWith("✓") ? "text-[#00ff88] font-bold leading-6" : "text-[#00d4ff] leading-6"}>
          {line}
        </div>
      ))}
      <span className="text-[#00d4ff] animate-blink">█</span>
    </div>
  );
}