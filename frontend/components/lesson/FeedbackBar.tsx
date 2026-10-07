import { Button } from "../ui/Button";
import { Check, Cross } from "../ui/Icons";

const PRAISE = ["Nicely done!", "Amazing!", "Great job!", "Correct!"];

export default function FeedbackBar({ status, solution, idx, canCheck, onCheck, onSkip, onContinue }: any) {
  const ok = status === "correct", bad = status === "wrong";
  return (
    <footer key={status} className={`px-5 py-5 sm:py-8 ${ok ? "animate-slideUp bg-duo-okBg" : bad ? "animate-slideUp bg-duo-badBg" : "border-t-2 border-duo-gray bg-white"}`}>
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        {status === "answering" ? (
          <>
            <Button variant="white" className="!text-duo-gray2" onClick={onSkip}>Skip</Button>
            <Button variant={canCheck ? "green" : "disabled"} onClick={onCheck}>Check</Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <div className={`grid h-14 w-14 place-items-center rounded-full bg-white ${ok ? "text-duo-green" : "text-duo-red"}`}>
                {ok ? <Check className="h-8 w-8" /> : <Cross className="h-8 w-8" />}
              </div>
              <div>
                <p className={`text-2xl font-extrabold ${ok ? "text-duo-greenDark" : "text-duo-redDark"}`}>{ok ? PRAISE[idx % PRAISE.length] : "Correct solution:"}</p>
                {bad && <p className="font-bold text-duo-redDark">{solution}</p>}
              </div>
            </div>
            <Button variant={ok ? "green" : "red"} onClick={onContinue}>Continue</Button>
          </>
        )}
      </div>
    </footer>
  );
}
