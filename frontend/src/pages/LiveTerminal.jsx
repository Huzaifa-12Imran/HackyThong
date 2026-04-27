import React, { useEffect, useRef, useState } from "react";
import { TERMINAL_LINES } from "../data/demoData";

export default function LiveTerminal({ visible }) {
  const [lines, setLines] = useState([]);
  const bottomRef = useRef(null);
  const intervalRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    if (visible) {
      setLines([]);
      indexRef.current = 0;
      intervalRef.current = setInterval(() => {
        if (indexRef.current < TERMINAL_LINES.length) {
          const line = TERMINAL_LINES[indexRef.current];
          if (line !== undefined) {
            setLines((prev) => [...prev, line]);
          }
          indexRef.current += 1;
        } else {
          clearInterval(intervalRef.current);
        }
      }, 220);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [visible]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-85 flex items-center justify-center p-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#07080f] border border-[#1e2a3b] rounded-2xl overflow-hidden shadow-2xl">
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: "0 0 60px rgba(6,182,212,0.15)" }} />

        {/* Mac title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0a0c18] border-b border-[#1e2a3b]">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 text-[#475569] text-xs font-mono font-semibold">
            stackpulse — live_pulse_scanner
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span className="text-[10px] text-accent-green font-mono font-bold">LIVE</span>
          </div>
        </div>

        {/* Terminal body */}
        <div className="terminal-body p-6 h-80 overflow-y-auto font-mono text-sm bg-[#07080f]">
          {lines.map((line, i) => (
            <div
              key={i}
              className="leading-7 animate-fadeInUp"
              style={{ animationDelay: `${i * 0.01}s` }}
            >
              {!line ? null : line.startsWith("✓") ? (
                <span className="text-[#10b981] font-bold">{line}</span>
              ) : line.startsWith("→") ? (
                <span className="text-[#06b6d4]">{line}</span>
              ) : (
                <span className="text-[#94a3b8]">{line}</span>
              )}
            </div>
          ))}
          <span className="text-[#06b6d4] animate-blink">█</span>
          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0a0c18] border-t border-[#1e2a3b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[#475569] text-xs font-mono">
              Scanning AI ecosystem feeds in real-time...
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#2d3f55]">
            {lines.length}/{TERMINAL_LINES.length} events
          </span>
        </div>
      </div>
    </div>
  );
}