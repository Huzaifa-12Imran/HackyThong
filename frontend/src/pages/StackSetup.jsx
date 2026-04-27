import React, { useState } from "react";
import { DEMO_STACK } from "../data/demoData";
import { apiCall } from "../utils/api";

const AI_MODELS = ["Gemini 2.5 Flash", "GPT-4o", "Claude Sonnet"];
const INFRA = ["Cloud Run", "Firebase", "Vertex AI", "Render"];

export default function StackSetup({ onComplete }) {
  const [selectedModels, setSelectedModels] = useState(["Gemini 2.5 Flash"]);
  const [customModel, setCustomModel] = useState("");
  const [selectedInfra, setSelectedInfra] = useState(["Cloud Run", "Firebase"]);
  const [saasTools, setSaasTools] = useState(
    DEMO_STACK.stack.saas_tools.map((t, i) => ({ id: i, name: t.name, cost: t.monthly_cost }))
  );
  const [burnRate, setBurnRate] = useState(DEMO_STACK.burn_rate);
  const [loading, setLoading] = useState(false);

  function toggleModel(m) {
    setSelectedModels((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  }

  function toggleInfra(i) {
    setSelectedInfra((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  }

  function addRow() {
    setSaasTools((prev) => [...prev, { id: Date.now(), name: "", cost: "" }]);
  }

  function updateTool(id, field, value) {
    setSaasTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  }

  function removeTool(id) {
    setSaasTools((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleSubmit() {
    setLoading(true);
    await apiCall("/stack/register", {
      models: selectedModels,
      infrastructure: selectedInfra,
      saas_tools: saasTools,
      burn_rate: burnRate,
    });
    setLoading(false);
    onComplete();
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold text-primary uppercase tracking-widest mb-1">ONBOARDING</p>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Register Your Stack</h2>
        <p className="text-gray-500 mt-1 text-sm">Tell StackPulse what you're running. You only do this once.</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* AI Models */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">smart_toy</span>
            AI Models
          </h3>
          <div className="space-y-2">
            {AI_MODELS.map((m) => (
              <label key={m} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedModels.includes(m)}
                  onChange={() => toggleModel(m)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{m}</span>
              </label>
            ))}
            <div className="pt-2">
              <input
                type="text"
                placeholder="+ Custom model name"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Infrastructure */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">dns</span>
            Infrastructure
          </h3>
          <div className="space-y-2">
            {INFRA.map((i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedInfra.includes(i)}
                  onChange={() => toggleInfra(i)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{i}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* SaaS Tools Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">apps</span>
            SaaS Tools & Monthly Costs
          </h3>
          <button
            onClick={addRow}
            className="text-xs font-semibold text-primary border border-primary rounded-lg px-3 py-1.5 hover:bg-primary hover:text-white transition-all"
          >
            + Add Row
          </button>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-1">
            <div className="col-span-7">Tool Name</div>
            <div className="col-span-4">Monthly Cost ($)</div>
            <div className="col-span-1"></div>
          </div>
          {saasTools.map((tool) => (
            <div key={tool.id} className="grid grid-cols-12 gap-3 items-center">
              <input
                className="col-span-7 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g. Pinecone"
                value={tool.name}
                onChange={(e) => updateTool(tool.id, "name", e.target.value)}
              />
              <input
                className="col-span-4 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="200"
                value={tool.cost}
                onChange={(e) => updateTool(tool.id, "cost", e.target.value)}
                type="number"
              />
              <button
                onClick={() => removeTool(tool.id)}
                className="col-span-1 text-gray-300 hover:text-red-400 transition-colors flex justify-center"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
              </button>
            </div>
          ))}
        </div>

        {/* Total Burn Rate */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-4">
          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
            Total Monthly Burn Rate ($)
          </label>
          <input
            type="number"
            value={burnRate}
            onChange={(e) => setBurnRate(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-40"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-primary hover:bg-green-800 text-white font-bold py-4 rounded-xl text-base transition-all active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <span className="material-symbols-outlined animate-spin" style={{ fontSize: 20 }}>refresh</span>
            Analyzing your stack...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: 20 }}>rocket_launch</span>
            Analyze My Stack
          </>
        )}
      </button>
    </div>
  );
}