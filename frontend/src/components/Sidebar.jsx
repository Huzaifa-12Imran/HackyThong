import React, { useState, useEffect } from "react";
import { apiCall } from "../utils/api";

const navItems = [
  { icon: "wb_sunny", label: "Morning Briefing", page: "dashboard" },
  { icon: "policy", label: "Reality Check", page: "reality" },
  { icon: "group", label: "Founder Sync", page: "sync" },
  { icon: "analytics", label: "Impact Analyzer", page: "analyzer" },
  { icon: "search", label: "Margin Spy", page: "margin" },
  { icon: "translate", label: "Paul Translation", page: "paul" },
  { icon: "explosion", label: "Blast Radius", page: "blast" },
  { icon: "monitoring", label: "Live Pulse", page: "terminal" },
  { icon: "layers", label: "Stack Setup", page: "setup" },
  { icon: "settings", label: "Settings", page: "settings" },
];

export default function Sidebar({ currentPage, onNavigate }) {
  const [systemStatus, setSystemStatus] = useState("live");

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await apiCall("/health", {}, "GET");
        setSystemStatus(res.success ? "live" : "offline");
      } catch {
        setSystemStatus("offline");
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-white border-r border-border-dark flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center px-4 py-5 border-b border-border-dark">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mr-3 flex-shrink-0">
          <span
            className="material-symbols-outlined text-white"
            style={{ fontVariationSettings: "'FILL' 1", fontSize: 18 }}
          >
            bolt
          </span>
        </div>
        <div>
          <h1 className="text-[14px] font-bold text-text-primary leading-none">
            CoFounder AI
          </h1>
          <p className="text-[10px] text-text-muted mt-0.5 uppercase tracking-wider font-medium">
            Chief of Staff
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-100 group ${
                active
                  ? "nav-active text-primary"
                  : "text-text-muted hover:text-text-primary hover:bg-bg-card-hover"
              }`}
            >
              <span
                className={`material-symbols-outlined mr-3 transition-colors`}
                style={{
                  fontSize: 17,
                  fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                  color: active ? "#3b5bdb" : undefined,
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom: system status + user */}
      <div className="border-t border-border-dark p-3">
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
              systemStatus === "live" ? "bg-primary" : "bg-accent-red"
            }`}
          >
            AI
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
              System Status
            </p>
            <p className="text-[11px] text-text-muted truncate">
              {systemStatus === "live" ? "Syncing Minds..." : "Connection lost"}
            </p>
          </div>
          <span
            className={`w-2 h-2 rounded-full ml-auto flex-shrink-0 ${
              systemStatus === "live" ? "bg-accent-green animate-pulse" : "bg-accent-red"
            }`}
          />
        </div>
      </div>
    </aside>
  );
}