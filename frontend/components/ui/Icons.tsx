import { ReactNode } from "react";
type P = { className?: string };
const mk = (body: ReactNode) => function Icon({ className = "h-6 w-6" }: P) {
  return <svg viewBox="0 0 24 24" className={className}>{body}</svg>;
};
export const Flame = mk(<><path fill="#ff9600" d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-4 3-6 .5 2 1 3 2 3 0-3-1-6 1-9z"/><path fill="#ffc800" d="M12 21a3 3 0 0 1-3-3c0-2 2-3 3-5 1 2 3 3 3 5a3 3 0 0 1-3 3z"/></>);
export const Heart = mk(<path fill="#ff4b4b" d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z"/>);
export const Gem = mk(<><path fill="#1cb0f6" d="M6 3h12l4 6-10 12L2 9z"/><path fill="#49c0f8" d="M6 3h12l4 6H2z"/></>);
export const Bolt = mk(<path fill="#ffc800" d="M13 2 4 14h7l-1 8 9-12h-7z"/>);
export const Star = mk(<polygon fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" points="12,2 15,9 22,9.5 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9.5 9,9"/>);
export const Lock = mk(<><rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="3"/></>);
export const Check = mk(<path d="M5 13l4 4 10-10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>);
export const Cross = mk(<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>);
export const HomeIcon = mk(<path fill="currentColor" d="M3 11 12 3l9 8v10h-6v-6H9v6H3z"/>);
export const Trophy = mk(<path fill="currentColor" d="M7 3h10v6a5 5 0 0 1-10 0zM4 4h3v3a3 3 0 0 1-3-3zm16 0h-3v3a3 3 0 0 0 3-3zM10 15h4v3h3v3H7v-3h3z"/>);
export const UserIcon = mk(<><circle cx="12" cy="8" r="5" fill="currentColor"/><path fill="currentColor" d="M3 22c0-5 4-8 9-8s9 3 9 8z"/></>);
export const Dots = mk(<><circle cx="5" cy="12" r="2.5" fill="currentColor"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/><circle cx="19" cy="12" r="2.5" fill="currentColor"/></>);
