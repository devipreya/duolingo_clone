export function Duo({ size = 120, mood = "happy" }: { size?: number; mood?: "happy" | "sad" }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <ellipse cx="44" cy="110" rx="12" ry="5" fill="#ff9600" /><ellipse cx="76" cy="110" rx="12" ry="5" fill="#ff9600" />
      <path d="M24 40 18 14l26 14zM96 40l6-26-26 14z" fill="#58cc02" />
      <ellipse cx="60" cy="68" rx="42" ry="40" fill="#58cc02" />
      <ellipse cx="60" cy="86" rx="26" ry="18" fill="#89e219" />
      <circle cx="42" cy="52" r="16" fill="#fff" /><circle cx="78" cy="52" r="16" fill="#fff" />
      <circle cx="45" cy="54" r="7" fill="#4b4b4b" /><circle cx="75" cy="54" r="7" fill="#4b4b4b" />
      <circle cx="47" cy="51" r="2.5" fill="#fff" /><circle cx="77" cy="51" r="2.5" fill="#fff" />
      <path d="M50 66h20l-10 14z" fill="#ffc800" />
      {mood === "sad" && <><path d="M28 36l22 8M92 36l-22 8" stroke="#4b4b4b" strokeWidth="4" strokeLinecap="round" /><path d="M36 70q0 8 4 12" stroke="#1cb0f6" strokeWidth="4" fill="none" strokeLinecap="round" /></>}
    </svg>
  );
}
