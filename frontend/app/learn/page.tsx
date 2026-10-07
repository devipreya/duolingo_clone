import Link from "next/link";
import { api } from "@/lib/api";
import TopBar from "@/components/TopBar";

export default async function Learn() {
  const [path, me] = await Promise.all([api<any[]>("/api/path"), api<any>("/api/me")]);
  return (
    <>
      <TopBar me={me} />
      <main className="mx-auto max-w-md pb-24 pt-20">
        {path.map((unit) => (
          <section key={unit.id}>
            <div className="mx-2 my-6 rounded-2xl p-4 text-white" style={{ background: unit.color }}>
              <h2 className="text-lg font-extrabold">{unit.title}</h2>
              <p className="text-sm opacity-90">{unit.description}</p>
            </div>
            <div className="flex flex-col items-center gap-6">
              {unit.skills.map((s: any, i: number) => {
                const offset = [0, 40, 0, -40][i % 4];
                const locked = s.state === "locked";
                return (
                  <div key={s.id} style={{ transform: `translateX(${offset}px)` }} className="text-center">
                    <Link href={locked ? "#" : `/lesson/${s.next_lesson_id}`}>
                      <div className="relative grid h-20 w-20 place-items-center rounded-full text-3xl"
                        style={{
                          background: locked ? "#e5e5e5" : s.state === "completed" ? "#ffc800" : unit.color,
                          boxShadow: `0 6px 0 ${locked ? "#b7b7b7" : "rgba(0,0,0,.25)"}`,
                          // progress ring
                          outline: s.state === "available" ? `6px solid #e5e5e5` : "none",
                        }}>
                        {locked ? "🔒" : s.icon}
                        {s.state !== "locked" && (
                          <span className="absolute -bottom-2 rounded-full bg-white px-2 text-xs font-extrabold text-duo-yellow shadow">
                            👑 {s.level_completed}/{s.levels}
                          </span>
                        )}
                      </div>
                    </Link>
                    <p className="mt-3 text-sm font-extrabold text-duo-text">{s.title}</p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}