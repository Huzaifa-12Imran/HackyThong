import React from "react";

const navItems = [
  { icon: "layers", label: "Stack Setup", page: "setup" },
  { icon: "dashboard", label: "Dashboard", page: "dashboard" },
  { icon: "analytics", label: "Impact Analyzer", page: "analyzer" },
  { icon: "monitoring", label: "Live Pulse", page: "terminal" },
  { icon: "settings", label: "Settings", page: "settings" },
];

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200 flex flex-col p-3 z-50">
      {/* Logo */}
      <div className="flex items-center px-2 py-4 mb-4">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center mr-3 flex-shrink-0">
          <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1", fontSize: 18 }}>
            terminal
          </span>
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-900 tracking-tighter leading-none">StackPulse</h1>
          <p className="text-[10px] uppercase tracking-widest text-primary font-bold mt-0.5">Production Ready</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="space-y-0.5 flex-1">
        {navItems.map((item) => {
          const active = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`w-full flex items-center px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-150 ${
                active
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span className="material-symbols-outlined mr-3 text-[20px]">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* System Health */}
      <div className="mt-auto pt-3 border-t border-gray-100">
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter mb-1">System Health</div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600">Stable</span>
            <span className="text-[10px] text-gray-400">99.9% Up</span>
          </div>
          <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: "99%" }} />
          </div>
        </div>
      </div>
    </aside>
  );
}