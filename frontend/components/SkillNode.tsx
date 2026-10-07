import Link from "next/link";
import { Check, Lock, Star } from "./ui/Icons";
import { Duo } from "./ui/Duo";
import { useToast } from "./Providers";

export default function SkillNode({ s, color, dark, offset }: { s: any; color: string; dark: string; offset: number }) {
  const toast = useToast();
  const locked = s.state === "locked", done = s.state === "completed";
  const R = 48, C = 2 * Math.PI * R;
  const prog = done ? 1 : s.level_completed / s.levels;
  const Icon = locked ? Lock : done ? Check : Star;

  const node = (
    <div className="relative grid h-[104px] w-[104px] place-items-center">
      {!locked && (
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 104 104">
          <circle cx="52" cy="52" r={R} fill="none" stroke="#e5e5e5" strokeWidth="8" />
          <circle cx="52" cy="52" r={R} fill="none" stroke={done ? "#ffc800" : color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - prog)} className="transition-all duration-700" />
        </svg>
      )}
      <div className="grid h-[76px] w-[76px] place-items-center rounded-full text-white transition active:translate-y-1 active:shadow-none"
        style={{ background: locked ? "#e5e5e5" : color, boxShadow: `0 6px 0 ${locked ? "#b7b7b7" : dark}` }}>
        <Icon className={`h-9 w-9 ${locked ? "text-duo-gray2" : ""}`} />
      </div>
    </div>
  );

  return (
    <div className="relative mb-3 mt-5 text-center" style={{ transform: `translateX(${offset}px)` }}>
      {s.current && (
        <>
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 animate-bob rounded-xl border-2 border-duo-gray bg-white px-3 py-1 text-sm font-extrabold uppercase" style={{ color }}>
            Start
            <span className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-duo-gray bg-white" />
          </div>
          <div className="absolute left-full top-1/2 ml-4 hidden -translate-y-1/2 sm:block"><Duo size={90} /></div>
        </>
      )}
      {locked
        ? <button onClick={() => toast("Finish the previous skill to unlock this one", "🔒")}>{node}</button>
        : <Link href={`/lesson/${s.next_lesson_id}`} className="block">{node}</Link>}
      <p className="text-sm font-extrabold text-duo-text">{s.title}</p>
    </div>
  );
}
