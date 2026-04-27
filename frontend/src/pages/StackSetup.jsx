import React, { useState } from "react";
import { DEMO_STACK } from "../data/demoData";
import { apiCall } from "../utils/api";

// Default monthly costs for known tools (approximate, editable via SaaS table)
const AI_MODELS = [
  { name: "Gemini 2.5 Flash", default_cost: 420 },
  { name: "GPT-4o",           default_cost: 380 },
  { name: "Claude Sonnet",    default_cost: 150 },
];
const INFRA = [
  { name: "Cloud Run",  default_cost: 340 },
  { name: "Firebase",   default_cost: 60  },
  { name: "Vertex AI",  default_cost: 120 },
  { name: "Render",     default_cost: 85  },
];

export default function StackSetup({ onComplete }) {
  const [selectedModels, setSelectedModels] = useState(["Gemini 2.5 Flash"]);
  const [customModel, setCustomModel] = useState("");
  const [selectedInfra, setSelectedInfra] = useState(["Cloud Run", "Firebase"]);
  const [saasTools, setSaasTools] = useState(
    DEMO_STACK.stack.saas_tools.map((t, i) => ({
      id: i,
      name: t.name,
      cost: t.monthly_cost,
    }))
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

    // Build models array using default costs for known models
    const formattedModels = selectedModels.map(name => {
      const known = AI_MODELS.find(m => m.name === name);
      return { name, monthly_cost: known ? known.default_cost : 0 };
    });
    if (customModel.trim()) {
      formattedModels.push({ name: customModel.trim(), monthly_cost: 0 });
    }

    // Build infra array using default costs for known infra
    const formattedInfra = selectedInfra.map(name => {
      const known = INFRA.find(i => i.name === name);
      return { name, monthly_cost: known ? known.default_cost : 0 };
    });

    // Map the frontend tools state to the format the backend expects
    const formattedSaasTools = saasTools
      .filter(t => t.name.trim())
      .map(t => ({
        name: t.name,
        monthly_cost: Number(t.cost) || 0,
      }));

    // Backend expects: { founder_id, stack: { models, infrastructure, saas_tools }, burn_rate }
    await apiCall("/stack/register", {
      founder_id: "demo-founder-001",
      stack: {
        models: formattedModels,
        infrastructure: formattedInfra,
        saas_tools: formattedSaasTools,
      },
      burn_rate: Number(burnRate) || 0,
    });
    setLoading(false);
    onComplete();
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold text-accent-green uppercase tracking-[0.2em] mb-2">
          ONBOARDING
        </p>
        <h2 className="text-3xl font-black text-text-primary tracking-tight">
          Register Your Stack
        </h2>
        <p className="text-text-secondary mt-1.5 text-sm">
          Tell StackPulse what you're running. You only do this once.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* AI Models */}
        <div className="glass rounded-2xl p-5 border border-border-dark">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2 text-sm">
            <span
              className="material-symbols-outlined text-accent-green"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              smart_toy
            </span>
            AI Models
          </h3>
          <div className="space-y-2.5">
            {AI_MODELS.map((m) => (
              <label key={m.name} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedModels.includes(m.name)}
                  onChange={() => toggleModel(m.name)}
                  className="w-4 h-4"
                />
                <span
                  className={`text-sm transition-colors ${
                    selectedModels.includes(m.name)
                      ? "text-text-primary font-medium"
                      : "text-text-secondary group-hover:text-text-primary"
                  }`}
                >
                  {m.name}
                </span>
                <span className="ml-auto text-[10px] text-text-muted">~${m.default_cost}/mo</span>
                {selectedModels.includes(m.name) && (
                  <span className="text-accent-green text-[10px] font-bold bg-accent-green bg-opacity-10 px-2 py-0.5 rounded-full border border-accent-green border-opacity-20">
                    ACTIVE
                  </span>
                )}
              </label>
            ))}
            <div className="pt-1">
              <input
                type="text"
                placeholder="+ Custom model name"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                className="w-full text-sm border border-border-dark rounded-lg px-3 py-2 focus:outline-none focus:border-accent-purple transition-colors bg-transparent text-text-primary placeholder:text-text-muted"
              />
            </div>
          </div>
        </div>

        {/* Infrastructure */}
        <div className="glass rounded-2xl p-5 border border-border-dark">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2 text-sm">
            <span
              className="material-symbols-outlined text-accent-cyan"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              dns
            </span>
            Infrastructure
          </h3>
          <div className="space-y-2.5">
            {INFRA.map((item) => (
              <label key={item.name} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedInfra.includes(item.name)}
                  onChange={() => toggleInfra(item.name)}
                  className="w-4 h-4"
                />
                <span
                  className={`text-sm transition-colors ${
                    selectedInfra.includes(item.name)
                      ? "text-text-primary font-medium"
                      : "text-text-secondary group-hover:text-text-primary"
                  }`}
                >
                  {item.name}
                </span>
                <span className="ml-auto text-[10px] text-text-muted">~${item.default_cost}/mo</span>
                {selectedInfra.includes(item.name) && (
                  <span className="text-accent-cyan text-[10px] font-bold bg-accent-cyan bg-opacity-10 px-2 py-0.5 rounded-full border border-accent-cyan border-opacity-20">
                    ACTIVE
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* SaaS Tools Table */}
      <div className="glass rounded-2xl p-5 mb-5 border border-border-dark">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-text-primary flex items-center gap-2 text-sm">
            <span
              className="material-symbols-outlined text-accent-purple"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              apps
            </span>
            SaaS Tools &amp; Monthly Costs
          </h3>
          <button
            onClick={addRow}
            className="text-xs font-bold text-accent-green border border-accent-green border-opacity-40 rounded-lg px-3 py-1.5 hover:bg-accent-green hover:bg-opacity-10 transition-all"
          >
            + Add Row
          </button>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-3 text-[10px] font-bold text-text-muted uppercase tracking-[0.12em] px-1 mb-1">
            <div className="col-span-7">Tool Name</div>
            <div className="col-span-4">Monthly Cost ($)</div>
            <div className="col-span-1" />
          </div>
          {saasTools.map((tool) => (
            <div key={tool.id} className="grid grid-cols-12 gap-3 items-center">
              <input
                className="col-span-7 border border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-purple bg-bg-base text-text-primary placeholder:text-text-muted transition-colors"
                placeholder="e.g. Pinecone"
                value={tool.name}
                onChange={(e) => updateTool(tool.id, "name", e.target.value)}
              />
              <input
                className="col-span-4 border border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-purple bg-bg-base text-text-primary placeholder:text-text-muted transition-colors"
                placeholder="200"
                value={tool.cost}
                onChange={(e) => updateTool(tool.id, "cost", e.target.value)}
                type="number"
              />
              <button
                onClick={() => removeTool(tool.id)}
                className="col-span-1 text-text-muted hover:text-accent-red transition-colors flex justify-center"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  delete
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* Burn Rate */}
        <div className="mt-5 pt-4 border-t border-border-dark flex items-center gap-4">
          <label className="text-sm font-semibold text-text-secondary whitespace-nowrap">
            Total Monthly Burn Rate ($)
          </label>
          <input
            type="number"
            value={burnRate}
            onChange={(e) => setBurnRate(Number(e.target.value))}
            className="border border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-green bg-bg-base text-text-primary w-40 transition-colors"
          />
          <span className="text-xs text-text-muted">
            {burnRate.toLocaleString()}/mo
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full font-black py-4 rounded-2xl text-base transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-3 text-white shadow-glow-green animate-pulse_glow"
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
        }}
      >
        {loading ? (
          <>
            <span
              className="material-symbols-outlined animate-spin_slow"
              style={{ fontSize: 20 }}
            >
              refresh
            </span>
            Analyzing your stack...
          </>
        ) : (
          <>
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: 20 }}
            >
              rocket_launch
            </span>
            Analyze My Stack →
          </>
        )}
      </button>
    </div>
  );
}