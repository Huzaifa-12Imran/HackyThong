import React, { useState, useEffect } from 'react';

export default function FounderSync() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching live sync data
    setTimeout(() => {
      setEntries([
        {
          id: 1,
          topic: "Launch Timeline",
          sam: "Needs 2 more weeks to refactor auth.",
          paul: "Promised investors beta access this Friday.",
          status: "conflict", // red
          timestamp: "10 mins ago"
        },
        {
          id: 2,
          topic: "Cloud Migration",
          sam: "Moving to GCP to save 40%.",
          paul: "Waiting for cost analysis before approving.",
          status: "pending", // amber
          timestamp: "2 hours ago"
        },
        {
          id: 3,
          topic: "Pricing Tier",
          sam: "Hardcoded $20/mo limit in the backend.",
          paul: "Agreed to $20/mo standard tier.",
          status: "aligned", // green
          timestamp: "1 day ago"
        }
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="max-w-5xl mx-auto animate-fadeInUp">
      <div className="flex justify-between items-end mb-8 border-b border-border-dark pb-4">
        <div>
          <p className="text-xs font-bold text-accent-cyan uppercase tracking-[0.2em] mb-2">SHARED VIEW</p>
          <h2 className="text-3xl font-black text-text-primary tracking-tight">Founder Sync</h2>
          <p className="text-text-secondary mt-1 text-sm">Real-time alignment dashboard between Technical and Business founders.</p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-green animate-pulse" />
          <span className="text-xs font-bold text-accent-green uppercase tracking-widest">Live</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><span className="material-symbols-outlined animate-spin_slow text-accent-cyan text-4xl">refresh</span></div>
      ) : (
        <div className="space-y-6">
          {entries.map(entry => (
            <div key={entry.id} className="glass rounded-2xl overflow-hidden border border-border-dark relative">
              {entry.status === 'conflict' && <div className="absolute top-0 left-0 w-2 h-full bg-accent-red" />}
              {entry.status === 'pending' && <div className="absolute top-0 left-0 w-2 h-full bg-accent-amber" />}
              {entry.status === 'aligned' && <div className="absolute top-0 left-0 w-2 h-full bg-accent-green" />}

              <div className="p-5 pl-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-text-primary uppercase tracking-wider">{entry.topic}</h3>
                  <span className="text-xs text-text-muted">{entry.timestamp}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-bg-sidebar p-4 rounded-xl border border-border-dark">
                    <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Sam (Technical)</div>
                    <div className="text-sm text-text-secondary">{entry.sam}</div>
                  </div>
                  <div className="bg-bg-sidebar p-4 rounded-xl border border-border-dark">
                    <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Paul (Business)</div>
                    <div className="text-sm text-text-secondary">{entry.paul}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
