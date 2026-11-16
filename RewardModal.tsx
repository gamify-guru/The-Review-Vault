import { useEffect, useRef } from "react";
import { CODE, ROOMS } from "../data/lesson";
import { ArrowRightIcon, UnlockIcon } from "./Icons";
import { Button, CodeSlots } from "./ui";

type Props = {
  index: number | null;
  solved: boolean[];
  onNext: () => void;
  onClose: () => void;
};

export function RewardModal({ index, solved, onNext, onClose }: Props) {
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (index == null) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nextRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [index, onClose]);

  if (index == null) return null;

  const room = ROOMS[index];
  const next = ROOMS[index + 1];
  const count = solved.filter(Boolean).length;
  const left = 4 - count;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4">
      <div className="animate-fade absolute inset-0 bg-ink-950/85 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reward-title"
        className="animate-rise relative w-full max-w-md overflow-hidden rounded-[2rem] border border-neon-400/30 bg-ink-800 px-6 py-8 text-center shadow-[0_0_120px_-20px_rgba(79,203,255,.45),0_40px_80px_-30px_rgba(0,0,0,.9)] sm:px-10 sm:py-10"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-24 h-56 bg-[radial-gradient(closest-side,rgba(79,203,255,.28),transparent)]" />

        <div className="relative">
          <span className="mx-auto grid size-14 place-items-center rounded-full border border-neon-400/50 bg-neon-400/10 text-neon-300 shadow-[0_0_30px_-4px_rgba(79,203,255,.8)]">
            <UnlockIcon className="size-7" />
          </span>
          <p className="mt-5 font-type text-xs tracking-[0.28em] text-neon-300 uppercase">
            Lock {room.no} · {room.title}
          </p>
          <h2 id="reward-title" className="mt-2 font-display text-4xl font-semibold text-paper-50">
            Click! It's open.
          </h2>
          <p className="mt-2 text-paper-200/85">Code digit #{index + 1} is…</p>

          <div className="animate-pop neon-text mx-auto mt-5 grid size-32 place-items-center rounded-3xl border-2 border-neon-400/70 bg-neon-400/10 font-digit text-8xl leading-none text-neon-300 shadow-[0_0_60px_-6px_rgba(79,203,255,.8),inset_0_0_30px_rgba(79,203,255,.2)] [animation-delay:.25s]">
            {CODE[index]}
          </div>

          <div className="mt-7 flex flex-col items-center gap-3">
            <CodeSlots solved={solved} size="md" />
            <p className="text-sm text-paper-300/85" role="status">
              {left > 0 ? (
                <>
                  <b className="text-paper-50">{count} of 4</b> digits found — {left} more to go.
                </>
              ) : (
                <b className="text-brass-300">You have the full code! Time to open the vault.</b>
              )}
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3">
            {next && (
              <Button ref={nextRef} size="lg" onClick={onNext} className="w-full">
                Room {next.no}: {next.title}
                <ArrowRightIcon className="size-5" />
              </Button>
            )}
            <button type="button" onClick={onClose} className="mx-auto rounded-full px-4 py-2 text-sm font-bold text-paper-300/80 underline-offset-4 transition hover:text-paper-50 hover:underline">
              Stay in this room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
