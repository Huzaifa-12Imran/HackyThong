import React, { useState, useEffect } from 'react';

const founders = [
  {
    initials: "PG",
    name: "Paul Graham",
    role: "FOUNDER / CEO",
    focus: "Focused on Series A roadmap and scaling engineering.",
    active: true,
  },
  {
    initials: "SA",
    name: "Sam Altman",
    role: "FOUNDER / CTO",
    focus: "Prioritizing technical debt reduction and core AI architecture.",
    active: true,
  },
];

const DEMO_ENTRIES = [
  {
    id: 1,
    initiator: "PG",
    topic: "Engineering Hiring Velocity",
    description: "Paul proposed doubling headcount by Q3 to support sales, but Sam flagged infrastructure stability risks and recommended a 25% increase instead.",
    status: "conflict",
    note: "RESOLVE VIA: STRATEGY SESSION",
    timestamp: null,
  },
  {
    id: 2,
    initiator: "SA",
    topic: "Product-Led Growth Engine",
    description: "Full consensus reached on moving towards a self-service model for the Essential tier. Marketing and Eng roadmaps are locked.",
    status: "aligned",
    note: null,
    timestamp: "09:42 AM",
  },
  {
    id: 3,
    initiator: "PG",
    topic: "Series B Foundation",
    description: "Paul shared initial pitch deck drafts. Awaiting technical review from Sam regarding the updated AI efficacy benchmarks.",
    status: "pending",
    note: "DUE IN: 2 HOURS",
    timestamp: null,
  },
  {
    id: 4,
    initiator: "SA",
    topic: "Remote Policy Adjustment",
    description: "Sam advocates for \"Office-First\" Tuesdays/Thursdays for the core AI team. Paul prefers maintaining full remote flexibility to attract global talent.",
    status: "conflict",
    note: "CONFLICT SEVERITY: MEDIUM",
    timestamp: null,
  },
];

const statusConfig = {
  conflict: { label: "CONFLICT", bg: "bg-red-50", border: "border-l-accent-red", badgeBg: "bg-red-50", badgeText: "text-accent-red", badgeBorder: "border-red-200", icon: "warning" },
  aligned:  { label: "ALIGNED",  bg: "bg-green-50", border: "border-l-accent-green", badgeBg: "bg-green-50", badgeText: "text-accent-green", badgeBorder: "border-green-200", icon: "check_circle" },
  pending:  { label: "PENDING",  bg: "bg-amber-50", border: "border-l-accent-amber", badgeBg: "bg-amber-50", badgeText: "text-accent-amber", badgeBorder: "border-amber-200", icon: "schedule" },
};

export default function FounderSync() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setEntries(DEMO_ENTRIES);
      setLoading(false);
    }, 800);
  }, []);

  const conflicts = entries.filter(e => e.status === 'conflict').length;
  const alignmentScore = Math.round(((entries.length - conflicts) / Math.max(entries.length, 1)) * 100);

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      {/* Founder cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {founders.map(f => (
          <div key={f.name} className="glass rounded-xl p-5 flex items-center gap-4 border border-border-dark">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              {f.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-0.5">{f.role}</p>
              <p className="font-bold text-text-primary text-sm">{f.name}</p>
              <p className="text-xs text-text-secondary mt-0.5 truncate">{f.focus}</p>
            </div>
            {f.active && (
              <span className="text-[10px] font-bold text-accent-green uppercase tracking-wider flex-shrink-0">ACTIVE</span>
            )}
          </div>
        ))}
      </div>

      {/* Timeline header */}
      <div className="glass rounded-xl border border-border-dark overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-dark">
          <h3 className="font-semibold text-text-primary text-sm">Alignment Timeline</h3>
          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5 text-accent-green">
              <span className="w-2 h-2 rounded-full bg-accent-green" /> ALIGNED
            </span>
            <span className="flex items-center gap-1.5 text-accent-red">
              <span className="w-2 h-2 rounded-full bg-accent-red" /> CONFLICT
            </span>
            <span className="flex items-center gap-1.5 text-accent-amber">
              <span className="w-2 h-2 rounded-full bg-accent-amber" /> PENDING
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <span className="material-symbols-outlined animate-spin_slow text-text-muted text-3xl">refresh</span>
          </div>
        ) : (
          <div className="divide-y divide-border-dark">
            {entries.map(entry => {
              const cfg = statusConfig[entry.status];
              return (
                <div key={entry.id} className={`flex gap-4 p-5 border-l-4 ${entry.status === 'conflict' ? 'border-l-red-400 bg-red-50' : entry.status === 'aligned' ? 'border-l-green-500 bg-green-50' : 'border-l-amber-400 bg-amber-50'}`}>
                  <div className="w-8 h-8 rounded-full bg-white border border-border-dark flex items-center justify-center text-[11px] font-bold text-text-secondary flex-shrink-0 mt-0.5">
                    {entry.initiator}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-text-primary text-sm">{entry.topic}</h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border flex items-center gap-1 flex-shrink-0 ${
                        entry.status === 'conflict' ? 'bg-red-100 text-red-600 border-red-200' :
                        entry.status === 'aligned'  ? 'bg-green-100 text-green-700 border-green-200' :
                        'bg-amber-100 text-amber-700 border-amber-200'
                      }`}>
                        <span className="material-symbols-outlined" style={{ fontSize: 10, fontVariationSettings: "'FILL' 1" }}>
                          {entry.status === 'conflict' ? 'warning' : entry.status === 'aligned' ? 'check_circle' : 'schedule'}
                        </span>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{entry.description}</p>
                    {entry.note && (
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{entry.note}</span>
                        {entry.status === 'conflict' && (
                          <button className="text-[11px] font-bold text-primary hover:underline uppercase tracking-wider">SYNC NOW</button>
                        )}
                      </div>
                    )}
                    {entry.timestamp && (
                      <p className="text-[10px] text-text-muted mt-2 uppercase tracking-wider font-semibold">TIMESTAMP: {entry.timestamp}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chief of Staff Observation */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-primary rounded-xl p-6 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            CHIEF OF STAFF OBSERVATION
          </p>
          <h3 className="text-xl font-black mb-3">
            Founder alignment is {alignmentScore < 75 ? `down ${100 - alignmentScore}%` : `at ${alignmentScore}%`} this week.
          </h3>
          <p className="text-sm opacity-80 leading-relaxed mb-4">
            Divergence is primarily appearing in the Engineering Scaling vs. Infrastructure Stability domain. I suggest a 30-minute sync focusing on "Sustainability Benchmarks" tomorrow morning.
          </p>
          <button className="border border-white text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-white hover:text-primary transition-colors">
            Schedule Resolution Session
          </button>
        </div>
        <div className="glass rounded-xl border border-border-dark p-6 flex flex-col justify-center">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">CONFIDENCE SCORE</p>
          <div className="text-4xl font-black text-text-primary mb-3">{alignmentScore}%</div>
          <div className="w-full bg-border-dark rounded-full h-1.5 mb-3">
            <div className="bg-primary h-1.5 rounded-full transition-all duration-700" style={{ width: `${alignmentScore}%` }} />
          </div>
          <p className="text-xs text-text-muted">Based on {entries.length * 35 + 2} Slack interactions and 4 meeting transcripts scanned today.</p>
        </div>
      </div>
    </div>
  );
}
