export default function TopBar({ me }: { me: any }) {
  const pct = Math.min(100, (me.daily_xp / me.daily_goal) * 100);
  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b-2 border-duo-gray bg-white">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3 font-extrabold">
        <span className="text-orange-500">🔥 {me.streak}</span>
        <span className="text-duo-blue">💎 {me.gems}</span>
        <span className="text-duo-yellow">⚡ {me.xp}</span>
        <span className="text-duo-red">❤️ {me.hearts}</span>
      </div>
      <div className="h-1.5 bg-duo-gray"><div className="h-full bg-duo-green transition-all" style={{ width: `${pct}%` }} /></div>
    </header>
  );
}