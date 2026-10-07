import { ButtonHTMLAttributes } from "react";

const V = {
  green: "bg-duo-green shadow-[0_4px_0_#58a700] text-white",
  blue: "bg-duo-blue shadow-[0_4px_0_#1899d6] text-white",
  red: "bg-duo-red shadow-[0_4px_0_#ea2b2b] text-white",
  white: "bg-white border-2 border-duo-gray shadow-[0_4px_0_#e5e5e5] text-duo-blue",
  disabled: "bg-duo-gray text-duo-gray2 shadow-[0_4px_0_#cfcfcf] cursor-not-allowed",
};
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof V };

export function Button({ variant = "green", className = "", disabled, ...p }: Props) {
  const off = disabled || variant === "disabled";
  return <button {...p} disabled={off}
    className={`rounded-2xl px-6 py-3 text-[15px] font-extrabold uppercase tracking-wide transition active:translate-y-1 active:shadow-none ${V[off ? "disabled" : variant]} ${className}`} />;
}
