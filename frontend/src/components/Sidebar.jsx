import React, { useState, useEffect } from "react";
import { apiCall } from "../utils/api";

const navItems = [
  { icon: "layers", label: "Stack Setup", page: "setup" },
  { icon: "dashboard", label: "Dashboard", page: "dashboard" },
  { icon: "analytics", label: "Impact Analyzer", page: "analyzer" },
  { icon: "monitoring", label: "Live Pulse", page: "terminal" },
  { icon: "settings", label: "Settings", page: "settings" },
];

export default function Sidebar({ currentPage, onNavigate }) {
  const [systemStatus, setSystemStatus] = useState("live"); // 'live', 'offline'

  useEffect(() => {
    // Poll backend health every 15 seconds
    const checkHealth = async () => {
      try {
        const res = await apiCall("/health", {}, "GET");
        if (res.success) {
          setSystemStatus("live");
        } else {
          setSystemStatus("offline");
        }
      } catch (err) {
        setSystemStatus("offline");
      }
    };

    checkHealth(); // Initial check
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-bg-sidebar border-r border-border-dark flex flex-col p-3 z-50">
      {/* Ambient top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-green to-transparent opacity-60" />

      {/* Logo */}
      <div className="flex items-center px-3 py-5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-green-cyan flex items-center justify-center mr-3 flex-shrink-0 shadow-glow-green">
          <span
            className="material-symbols-outlined text-white"
            style={{ fontVariationSettings: "'FILL' 1", fontSize: 20 }}
          >
            terminal
          </span>
        </div>
        <div>
          <h1 className="text-[15px] font-black text-text-primary tracking-tight leading-none">
            StackPulse
          </h1>
          <p className="text-[9px] uppercase tracking-[0.18em] text-accent-green font-bold mt-0.5">
            AI Intelligence Layer
          </p>
        </div>
      </div>

      {/* Section label */}
      <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] px-3 mb-2">
        Navigation
      </p>

      {/* Nav */}
      <nav className="space-y-0.5 flex-1">
        {navItems.map((item) => {
          const active = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 group ${
                active
                  ? "nav-active text-text-primary"
                  : "text-text-muted hover:text-text-primary hover:bg-bg-card"
              }`}
            >
              <span
                className={`material-symbols-outlined mr-3 text-[18px] transition-colors ${
                  active ? "text-accent-green" : "group-hover:text-text-secondary"
                }`}
                style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              {item.label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-green" />
              )}
            </button>
          );
        })}
      </nav>

      {/* System status */}
      <div className="mt-auto pt-3 border-t border-border-dark">
        <div className="bg-bg-card border border-border-dark rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              System
            </span>
            <span className="flex items-center gap-1.5">
              <span 
                className={`w-1.5 h-1.5 rounded-full ${
                  systemStatus === "live" ? "bg-accent-green animate-pulse" : "bg-red-500 animate-pulse"
                }`} 
              />
              <span 
                className={`text-[10px] font-semibold ${
                  systemStatus === "live" ? "text-accent-green" : "text-red-500"
                }`}
              >
                {systemStatus === "live" ? "Live" : "Offline"}
              </span>
            </span>
          </div>
          <div className="w-full bg-border-dark h-1 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                systemStatus === "live" ? "" : "w-0"
              }`}
              style={{
                width: systemStatus === "live" ? "99%" : "0%",
                background: systemStatus === "live" ? "linear-gradient(90deg, #10b981, #06b6d4)" : "#ef4444",
              }}
            />
          </div>
          <p className="text-[10px] text-text-muted mt-1.5">
            {systemStatus === "live" ? "99.9% uptime · AI feeds active" : "Connection to backend lost"}
          </p>
        </div>
      </div>
    </aside>
  );
}