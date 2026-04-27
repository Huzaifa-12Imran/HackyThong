import React from "react";

export default function TopBar({ title }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-6 h-12">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 16 }}>
            search
          </span>
          <input
            className="pl-8 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs w-64 focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search resources..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button className="text-gray-500 hover:bg-gray-50 p-1.5 rounded transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
        </button>
        <button className="text-gray-500 hover:bg-gray-50 p-1.5 rounded transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>help_outline</span>
        </button>
        <div className="h-6 w-px bg-gray-200 mx-1" />
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
            S
          </div>
          <span className="text-sm font-medium text-gray-900">DevSaaS</span>
        </div>
      </div>
    </header>
  );
}