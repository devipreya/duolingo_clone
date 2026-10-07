"use client";
import { useState } from "react";
const COLORS = ["#58cc02", "#1cb0f6", "#ffc800", "#ff4b4b", "#ce82ff"];

export default function Confetti() {
  const [pieces] = useState(() => Array.from({ length: 60 }, (_, i) => ({
    left: Math.random() * 100, delay: Math.random() * 1.2, dur: 2.5 + Math.random() * 2,
    size: 6 + Math.random() * 8, color: COLORS[i % 5] })));
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <span key={i} className="absolute -top-5 rounded-sm"
          style={{ left: `${p.left}%`, width: p.size, height: p.size, background: p.color,
                   animation: `confetti ${p.dur}s ${p.delay}s linear forwards` }} />
      ))}
    </div>
  );
}
