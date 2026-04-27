import React from "react";

export default function Settings() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-[11px] font-semibold text-primary uppercase tracking-widest mb-1">CONFIGURATION</p>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Settings</h2>
        <p className="text-gray-500 mt-1 text-sm">Manage your StackPulse preferences.</p>
      </div>

      <div className="space-y-5">
        {/* API Config */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">api</span>
            Backend Connection
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Backend URL</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                defaultValue="http://REPLACE_WITH_BACKEND_IP:8080"
              />
              <p className="text-xs text-gray-400 mt-1">Your partner's backend Cloud Run URL goes here</p>
            </div>
          </div>
        </div>

        {/* Demo Mode */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">science</span>
            Demo Mode
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Use cached demo responses</p>
              <p className="text-xs text-gray-400 mt-0.5">When on, returns pre-loaded perfect responses. Set DEMO_MODE in src/utils/api.js</p>
            </div>
            <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
            </div>
          </div>
        </div>

        {/* Founder Profile */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span>
            Founder Profile
          </h3>
          <div className="space-y-3">
            {[
              { label: "Founder Name", value: "Sam", type: "text" },
              { label: "Monthly Burn Rate ($)", value: "18000", type: "number" },
              { label: "Runway (months)", value: "14", type: "number" },
            ].map((f) => (
              <div key={f.label}>
                <label className="text-xs font-semibold text-gray-500 block mb-1">{f.label}</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  defaultValue={f.value}
                  type={f.type}
                />
              </div>
            ))}
          </div>
        </div>

        <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-all">
          Save Settings
        </button>
      </div>
    </div>
  );
}