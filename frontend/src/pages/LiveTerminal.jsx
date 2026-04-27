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
          setLines((prev) => [...prev, TERMINAL_LINES[indexRef.current]]);
          indexRef.current += 1;
        } else {
          clearInterval(intervalRef.current);
        }
      }, 250);
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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-[#0a0a0f] border border-[#222233] rounded-2xl overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#111118] border-b border-[#222233]">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 text-[#8888aa] text-xs font-mono font-semibold">
            stackpulse — live_pulse_scanner
          </span>
        </div>

        {/* Terminal Body */}
        <div className="terminal-body p-5 h-72 overflow-y-auto font-mono text-sm">
          {lines.map((line, i) => (
            <div
              key={i}
              className="text-[#00d4ff] leading-6 animate-fadeInUp"
              style={{ animationDelay: `${i * 0.02}s` }}
            >
              {line.startsWith("✓") ? (
                <span className="text-[#00ff88] font-bold">{line}</span>
              ) : (
                line
              )}
            </div>
          ))}
          {/* Blinking cursor */}
          <span className="text-[#00d4ff] animate-blink">█</span>
          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#111118] border-t border-[#222233] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
          <span className="text-[#8888aa] text-xs font-mono">Scanning AI ecosystem feeds in real-time...</span>
        </div>
      </div>
    </div>
  );
}