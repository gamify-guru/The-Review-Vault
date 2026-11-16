import { type ButtonHTMLAttributes, type ReactNode, type Ref, useEffect, useRef, useState } from "react";
import { CODE, ROOMS } from "../data/lesson";
import { cn } from "../utils/cn";
import { ArrowRightIcon, BookIcon, CheckIcon, CloseIcon, LockIcon, SearchIcon, UnlockIcon } from "./Icons";

/* ───────────── Button ───────────── */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: Ref<HTMLButtonElement>;
  variant?: "primary" | "ghost" | "neon";
  size?: "sm" | "md" | "lg";
};

export function Button({ variant = "primary", size = "md", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-extrabold tracking-wide transition duration-200 ease-out select-none disabled:pointer-events-none disabled:opacity-40",
        size === "sm" && "h-10 px-4 text-sm",
        size === "md" && "h-12 px-6 text-[15px]",
        size === "lg" && "h-14 px-8 text-base sm:text-lg",
        variant === "primary" &&
          "bg-gradient-to-b from-brass-300 to-brass-500 text-ink-950 shadow-[0_14px_34px_-12px_rgba(242,184,75,.75),inset_0_1px_0_rgba(255,255,255,.55)] hover:-translate-y-0.5 hover:from-brass-200 hover:to-brass-400 hover:shadow-[0_20px_40px_-12px_rgba(242,184,75,.9),inset_0_1px_0_rgba(255,255,255,.6)] active:translate-y-0",
        variant === "ghost" &&
          "border border-brass-400/30 text-brass-200 hover:border-brass-300/70 hover:bg-brass-400/10 hover:text-brass-200",
        variant === "neon" &&
          "border border-neon-400/50 bg-neon-400/10 text-neon-300 shadow-[0_0_26px_-8px_rgba(79,203,255,.8)] hover:bg-neon-400/20 hover:shadow-[0_0_30px_-4px_rgba(79,203,255,.9)]",
        className,
      )}
      {...props}
    />
  );
}

/* ───────────── Scroll reveal ───────────── */

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("reveal", shown && "is-in", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ───────────── Code slots ───────────── */

export function CodeSlots({
  solved,
  size = "md",
  className,
}: {
  solved: boolean[];
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const count = solved.filter(Boolean).length;
  return (
    <ol className={cn("flex", size === "lg" ? "gap-3" : "gap-1.5", className)} aria-label={`Code digits collected: ${count} of 4`}>
      {CODE.map((digit, i) => (
        <li
          key={i}
          className={cn(
            "grid place-items-center border font-digit leading-none transition-all duration-500",
            size === "sm" && "size-7 rounded-md text-lg sm:size-8",
            size === "md" && "size-11 rounded-lg text-2xl",
            size === "lg" && "size-14 rounded-xl text-4xl sm:size-[4.500rem] sm:text-5xl",
            solved[i]
              ? "neon-text border-neon-400/70 bg-neon-400/10 text-neon-300 shadow-[0_0_20px_-4px_rgba(79,203,255,.85),inset_0_0_14px_rgba(79,203,255,.18)]"
              : "border-paper-300/15 bg-ink-900/70 text-paper-300/35",
          )}
        >
          {solved[i] ? (
            <span aria-label={`Digit ${i + 1}: ${digit}`}>{digit}</span>
          ) : (
            <LockIcon className={size === "lg" ? "size-6" : "size-3.5"} />
          )}
        </li>
      ))}
    </ol>
  );
}

/* ───────────── Small helpers ───────────── */

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-type text-[11px] uppercase tracking-[0.28em] text-brass-400 sm:text-xs", className)}>{children}</p>
  );
}

export function Pips({ total, index, done }: { total: number; index: number; done?: boolean }) {
  return (
    <div className="flex items-center gap-3" role="img" aria-label={`Clue ${Math.min(index + 1, total)} of ${total}`}>
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              done || i < index ? "w-5 bg-brass-400" : i === index ? "w-9 bg-neon-400 shadow-[0_0_12px_rgba(79,203,255,.8)]" : "w-5 bg-paper-300/15",
            )}
          />
        ))}
      </div>
      <span className="font-digit text-sm text-paper-300/80">
        {done ? total : Math.min(index + 1, total)}/{total}
      </span>
    </div>
  );
}

export function Feedback({ tone, children }: { tone: "ok" | "bad" | "info"; children: ReactNode }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex animate-rise items-start gap-3 rounded-2xl border px-4 py-3 text-[15px] leading-snug",
        tone === "ok" && "border-ok/30 bg-ok/10 text-ok",
        tone === "bad" && "border-bad/30 bg-bad/10 text-bad",
        tone === "info" && "border-neon-400/25 bg-neon-400/10 text-neon-300",
      )}
    >
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-current/15">
        {tone === "ok" ? <CheckIcon className="size-3.5" /> : tone === "bad" ? <CloseIcon className="size-3.5" /> : <SearchIcon className="size-3.5" />}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/* ───────────── Room shell ───────────── */

type RoomShellProps = {
  roomIndex: number; // 0-4
  instruction: string;
  ru: string;
  solved: boolean;
  onOpenRules: (tab: number) => void;
  onNext: () => void;
  children: ReactNode;
};

export function RoomShell({ roomIndex, instruction, ru, solved, onOpenRules, onNext, children }: RoomShellProps) {
  const room = ROOMS[roomIndex];
  const next = ROOMS[roomIndex + 1];
  const isTask = roomIndex < 4;

  return (
    <main id="main" className="mx-auto w-full max-w-6xl px-4 pt-8 pb-24 sm:px-6 lg:px-8 lg:pt-12">
      <header className="animate-rise mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <Tag>
            Room {room.no} <span className="text-paper-300/50">·</span> {room.format}{" "}
            <span className="text-paper-300/50">·</span> ≈ {room.minutes} min
          </Tag>
          <h1 className="mt-3 font-display text-[clamp(2.500rem,7vw,4.500rem)] leading-[0.95] font-semibold tracking-tight text-paper-50">
            {room.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-paper-100/90">{instruction}</p>
          <p lang="ru" className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-paper-300/80">
            {ru}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {isTask && (
            <div
              className={cn(
                "flex h-12 items-center gap-2.5 rounded-full border px-4 text-sm font-bold",
                solved ? "border-neon-400/50 bg-neon-400/10 text-neon-300" : "border-paper-300/15 bg-ink-900/60 text-paper-300/80",
              )}
            >
              {solved ? <UnlockIcon className="size-4" /> : <LockIcon className="size-4" />}
              <span>
                {solved ? "Digit found:" : "Prize: code digit"}{" "}
                <span className={cn("font-digit text-base", solved && "neon-text")}>{solved ? CODE[roomIndex] : `#${roomIndex + 1}`}</span>
              </span>
            </div>
          )}
          {room.rule != null && (
            <Button variant="ghost" onClick={() => onOpenRules(room.rule!)}>
              <BookIcon className="size-4" />
              Help: rule card {room.rule + 1}
            </Button>
          )}
        </div>
      </header>

      {isTask && solved && (
        <div className="animate-rise mb-6 flex flex-col gap-4 rounded-3xl border border-neon-400/30 bg-neon-400/[0.070] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-4">
            <span className="neon-text grid size-14 shrink-0 place-items-center rounded-xl border border-neon-400/60 bg-neon-400/10 font-digit text-4xl text-neon-300 shadow-[0_0_24px_-4px_rgba(79,203,255,.8)]">
              {CODE[roomIndex]}
            </span>
            <div>
              <p className="font-display text-xl font-semibold text-paper-50">Lock {room.no} is open!</p>
              <p className="text-sm text-paper-200/80">
                Code digit #{roomIndex + 1} is in your notebook at the top of the screen.
              </p>
            </div>
          </div>
          {next && (
            <Button onClick={onNext}>
              Room {next.no}: {next.title}
              <ArrowRightIcon className="size-4" />
            </Button>
          )}
        </div>
      )}

      {children}
    </main>
  );
}
