"use client";
import { Button } from "../ui/Button";
import { Duo } from "../ui/Duo";
import Confetti from "../ui/Confetti";
import { Bolt, Flame } from "../ui/Icons";
import { post } from "@/lib/api";
import { useMe, useToast } from "../Providers";

const Footer = ({ children }: any) => (
  <footer className="border-t-2 border-duo-gray p-5"><div className="mx-auto flex max-w-3xl justify-end">{children}</div></footer>
);

export function StreakScreen({ streak, onNext }: { streak: number; onNext: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
        <div className="animate-pop"><Flame className="h-44 w-44" /></div>
        <h1 className="text-6xl font-black text-duo-orange">{streak}</h1>
        <p className="text-2xl font-extrabold text-duo-orange">day streak!</p>
        <p className="font-bold text-duo-gray2">Come back tomorrow to keep it going.</p>
      </div>
      <Footer><Button onClick={onNext}>Continue</Button></Footer>
    </div>
  );
}

export function CompleteScreen({ result, accuracy, onContinue }: any) {
  const stat = (label: string, value: React.ReactNode, color: string) => (
    <div className="w-32 overflow-hidden rounded-2xl border-2" style={{ borderColor: color }}>
      <div className="py-1 text-xs font-extrabold uppercase text-white" style={{ background: color }}>{label}</div>
      <div className="flex items-center justify-center gap-1 py-3 text-xl font-extrabold" style={{ color }}>{value}</div>
    </div>
  );
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <Confetti />
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
        <Duo size={160} />
        <h1 className="text-3xl font-extrabold text-duo-yellow">Lesson Complete!</h1>
        <div className="flex gap-3">
          {stat("Total XP", <><Bolt className="h-5 w-5" />{result.xp}</>, "#ffc800")}
          {stat(accuracy === 100 ? "Amazing" : "Good", `${accuracy}%`, "#58cc02")}
          {stat("Daily goal", `${result.daily_xp}/${result.daily_goal}`, "#1cb0f6")}
        </div>
      </div>
      <Footer><Button onClick={onContinue}>Continue</Button></Footer>
    </div>
  );
}

export function OutOfHearts({ onQuit, onRefilled }: { onQuit: () => void; onRefilled: (hearts: number) => void }) {
  const { me, refresh } = useMe();
  const toast = useToast();
  const refill = async () => {
    try { const r = await post<any>("/api/me/refill"); await refresh(); toast("Hearts refilled", "❤️"); onRefilled(r.hearts); }
    catch (e: any) { toast(e.message, "💎"); }
  };
  const practice = async () => { const r = await post<any>("/api/me/practice"); await refresh(); onRefilled(r.hearts); };
  return (
    <div className="fixed inset-0 z-50 grid items-end bg-black/50 sm:place-items-center">
      <div className="animate-slideUp rounded-t-3xl bg-white p-6 text-center sm:w-[420px] sm:rounded-3xl">
        <div className="flex justify-center"><Duo size={110} mood="sad" /></div>
        <h1 className="my-3 text-2xl font-extrabold">You ran out of hearts!</h1>
        {me && me.next_heart_in > 0 && <p className="mb-4 font-bold text-duo-gray2">Next heart in ~{Math.ceil(me.next_heart_in / 60)} min</p>}
        <div className="grid gap-3">
          <Button variant="blue" onClick={refill}>Refill hearts · 350 gems</Button>
          <Button variant="green" onClick={practice}>Practice to earn a heart</Button>
          <Button variant="white" className="!text-duo-red" onClick={onQuit}>No thanks</Button>
        </div>
      </div>
    </div>
  );
}
