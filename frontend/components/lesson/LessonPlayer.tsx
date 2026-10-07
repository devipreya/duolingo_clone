"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/api";
import { useMe, useToast } from "../Providers";
import Exercise from "./Exercise";
import FeedbackBar from "./FeedbackBar";
import { CompleteScreen, StreakScreen, OutOfHearts } from "./Modals";
import { Heart } from "../ui/Icons";

type Status = "answering" | "correct" | "wrong";

export default function LessonPlayer({ lesson }: { lesson: any }) {
  const router = useRouter();
  const { refresh } = useMe();
  const toast = useToast();
  const total = lesson.exercises.length;

  const [queue, setQueue] = useState<any[]>(lesson.exercises);   // wrong answers get re-queued
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("answering");
  const [solution, setSolution] = useState("");
  const [hearts, setHearts] = useState<number>(lesson.hearts);
  const [mistakes, setMistakes] = useState(0);
  const [broke, setBroke] = useState(lesson.hearts === 0);        // block starting with 0 hearts
  const [result, setResult] = useState<any>(null);
  const [screen, setScreen] = useState<"streak" | "done">("streak");

  const ex = queue[idx];

  async function check(skip = false) {
    const r = await post<any>(`/api/exercises/${ex.id}/check`, { answer: skip ? "" : answer });
    setHearts(r.hearts); setSolution(r.correct_answer);
    if (r.correct) { setStatus("correct"); setDone((d) => d + 1); }
    else { setStatus("wrong"); setMistakes((m) => m + 1); setQueue((q) => [...q, ex]); }
  }

  async function advance() {
    if (idx + 1 >= queue.length) {
      setResult(await post(`/api/lessons/${lesson.id}/complete`, { mistakes }));
      return;
    }
    setIdx(idx + 1); setAnswer(null); setStatus("answering");
  }

  function onContinue() {
    if (status === "wrong" && hearts === 0) return setBroke(true);   // show the red bar first, then the modal
    advance();
  }

  async function pairMistake() {                                     // wrong tap in match-pairs costs a heart
    const r = await post<any>("/api/me/lose-heart");
    setHearts(r.hearts); setMistakes((m) => m + 1);
    if (r.hearts === 0) setBroke(true);
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || broke || result) return;
      e.preventDefault();
      if (status === "answering") { if (answer != null) check(); } else onContinue();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  if (result) {
    if (screen === "streak" && result.streak_extended)
      return <StreakScreen streak={result.streak} onNext={() => setScreen("done")} />;
    return (
      <CompleteScreen result={result} accuracy={Math.max(0, Math.round(((total - mistakes) / total) * 100))}
        onContinue={async () => {
          result.new_achievements.forEach((a: any) => toast(`Achievement unlocked: ${a.title}`, "🏆"));
          await refresh(); router.push("/learn");
        }} />
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-4 p-5">
        <button aria-label="Quit" className="text-2xl font-black text-duo-gray2"
          onClick={() => (idx === 0 || confirm("Are you sure? You'll lose your progress on this lesson.")) && router.push("/learn")}>✕</button>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-duo-gray">
          <div className="h-full rounded-full bg-duo-green transition-all duration-500" style={{ width: `${(done / total) * 100}%` }} />
        </div>
        <span className="flex items-center gap-1 font-extrabold text-duo-red"><Heart />{hearts}</span>
      </div>

      <main className="mx-auto w-full max-w-xl flex-1 px-5">
        <Exercise key={`${ex.id}-${idx}`} ex={ex} locked={status !== "answering"} onChange={setAnswer} onMistake={pairMistake} />
      </main>

      <FeedbackBar status={status} solution={solution} idx={idx} canCheck={answer != null}
        onCheck={() => check()} onSkip={() => check(true)} onContinue={onContinue} />

      {broke && (
        <OutOfHearts onQuit={() => router.push("/learn")}
          onRefilled={(h: number) => { setHearts(h); setBroke(false); if (status === "wrong") advance(); }} />
      )}
    </div>
  );
}
