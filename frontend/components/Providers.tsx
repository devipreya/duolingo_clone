"use client";
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api";

export type Me = { name: string; xp: number; streak: number; hearts: number; gems: number; daily_xp: number; daily_goal: number; next_heart_in: number };
const MeCtx = createContext<{ me: Me | null; refresh: () => Promise<void> }>({ me: null, refresh: async () => {} });
const ToastCtx = createContext<(msg: string, icon?: string) => void>(() => {});
export const useMe = () => useContext(MeCtx);
export const useToast = () => useContext(ToastCtx);

export default function Providers({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null);
  const [toasts, setToasts] = useState<{ id: number; msg: string; icon?: string }[]>([]);
  const refresh = useCallback(async () => setMe(await api<Me>("/api/me")), []);
  useEffect(() => { refresh().catch(() => {}); }, [refresh]);
  const toast = useCallback((msg: string, icon?: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, icon }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  return (
    <MeCtx.Provider value={{ me, refresh }}>
      <ToastCtx.Provider value={toast}>
        {children}
        <div className="fixed left-1/2 top-4 z-[100] flex -translate-x-1/2 flex-col gap-2">
          {toasts.map((t) => (
            <div key={t.id} className="animate-pop whitespace-nowrap rounded-2xl border-2 border-duo-gray bg-white px-5 py-3 font-extrabold shadow-lg">
              {t.icon} {t.msg}
            </div>
          ))}
        </div>
      </ToastCtx.Provider>
    </MeCtx.Provider>
  );
}
