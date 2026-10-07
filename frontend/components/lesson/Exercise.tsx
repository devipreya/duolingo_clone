"use client";
import { useState } from "react";
import { Duo } from "../ui/Duo";

const chip = "rounded-2xl border-2 border-b-4 border-duo-gray bg-white px-4 py-3 font-bold text-duo-text transition active:translate-y-0.5 active:border-b-2 disabled:cursor-default";
const selected = "!border-duo-blue !bg-duo-blueBg !text-duo-blue";

const Wrap = ({ title, children }: any) => (
  <div className="py-6"><h1 className="mb-6 text-2xl font-extrabold sm:text-[28px]">{title}</h1>{children}</div>
);
const Bubble = ({ text }: { text: string }) => (
  <div className="mb-6 flex items-center gap-3"><Duo size={88} /><div className="rounded-2xl border-2 border-duo-gray px-4 py-3 text-lg font-bold">{text}</div></div>
);

export default function Exercise({ ex, locked, onChange, onMistake }: any) {
  const d = ex.data;
  const [picked, setPicked] = useState<string | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [text, setText] = useState("");
  const [matched, setMatched] = useState<string[]>([]);
  const [pick, setPick] = useState<{ side: string; v: string } | null>(null);
  const [bad, setBad] = useState<string[]>([]);

  if (ex.type === "multiple_choice" || ex.type === "fill_blank") {
    const [a, b = ""] = ex.type === "fill_blank" ? (d.sentence ?? "").split("___") : [];
    return (
      <Wrap title={ex.prompt}>
        {ex.type === "fill_blank" && (
          <p className="mb-6 text-xl font-bold">{a}<span className="mx-1 inline-block min-w-[90px] border-b-4 border-duo-gray px-2 text-center text-duo-blue">{picked ?? "\u00a0"}</span>{b}</p>
        )}
        <div className="grid gap-3">
          {d.choices.map((c: string, i: number) => (
            <button key={c} disabled={locked} onClick={() => { setPicked(c); onChange(c); }}
              className={`${chip} flex items-center gap-3 text-left ${picked === c ? selected : ""}`}>
              <span className="grid h-7 w-7 place-items-center rounded-lg border-2 border-current text-sm">{i + 1}</span>{c}
            </button>
          ))}
        </div>
      </Wrap>
    );
  }

  if (ex.type === "translate_bank") {
    const update = (n: number[]) => { setOrder(n); onChange(n.length ? n.map((i) => d.words[i]).join(" ") : null); };
    return (
      <Wrap title={ex.prompt}>
        <Bubble text={d.sentence} />
        <div className="mb-6 flex min-h-[120px] flex-wrap content-start gap-2 border-y-2 border-duo-gray py-3">
          {order.map((i) => <button key={i} disabled={locked} className={chip} onClick={() => update(order.filter((x) => x !== i))}>{d.words[i]}</button>)}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {d.words.map((w: string, i: number) => order.includes(i)
            ? <span key={i} className={`${chip} select-none !border-transparent !bg-[#f0f0f0] text-transparent`}>{w}</span>
            : <button key={i} disabled={locked} className={chip} onClick={() => update([...order, i])}>{w}</button>)}
        </div>
      </Wrap>
    );
  }

  if (ex.type === "type_answer")
    return (
      <Wrap title={ex.prompt}>
        <Bubble text={d.sentence} />
        <textarea autoFocus disabled={locked} value={text} placeholder="Type in Spanish"
          onChange={(e) => { setText(e.target.value); onChange(e.target.value.trim() || null); }}
          className="h-32 w-full resize-none rounded-2xl border-2 border-duo-gray bg-[#f7f7f7] p-4 font-bold outline-none focus:border-duo-blue" />
      </Wrap>
    );

  // match_pairs: wrong tap costs a heart; "ok" is sent once everything is matched
  const pairs: string[][] = d.pairs;
  const tap = (side: string, v: string) => {
    if (locked || matched.includes(v)) return;
    if (!pick || pick.side === side) return setPick({ side, v });
    const [l, r] = side === "r" ? [pick.v, v] : [v, pick.v];
    if (pairs.some(([x, y]) => x === l && y === r)) {
      const m = [...matched, l, r]; setMatched(m);
      if (m.length === pairs.length * 2) onChange("ok");
    } else { setBad([l, r]); onMistake?.(); setTimeout(() => setBad([]), 500); }
    setPick(null);
  };
  const col = (side: string, items: string[]) => (
    <div className="grid flex-1 content-start gap-3">
      {items.map((v) => (
        <button key={v} onClick={() => tap(side, v)}
          className={`${chip} ${matched.includes(v) ? "!bg-[#f7f7f7] opacity-40" : bad.includes(v) ? "!border-duo-red !bg-duo-badBg !text-duo-red animate-shake" : pick?.v === v ? selected : ""}`}>{v}</button>
      ))}
    </div>
  );
  return (
    <Wrap title={ex.prompt}>
      <div className="flex gap-4">{col("l", pairs.map((p) => p[0]))}{col("r", pairs.map((p) => p[1]).reverse())}</div>
    </Wrap>
  );
}
