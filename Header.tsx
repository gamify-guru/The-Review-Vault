import { useEffect, useState } from "react";
import { CODE, LESSON_MINUTES, ROOMS, type SceneId } from "../data/lesson";
import { cn } from "../utils/cn";
import { BookIcon, CheckIcon, ClockIcon, DotsIcon, KeyholeIcon, LockIcon, RefreshIcon } from "./Icons";
import { CodeSlots } from "./ui";

export type Clock = { start: number | null; end: number | null };

function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [active]);
  return now;
}

export function Timer({ clock, className }: { clock: Clock; className?: string }) {
  const running = clock.start != null && clock.end == null;
  const now = useNow(running);

  let label = `${LESSON_MINUTES}:00`;
  let state: "idle" | "ok" | "low" | "over" = "idle";
  if (clock.start != null) {
    const elapsed = Math.max(0, Math.floor(((clock.end ?? now) - clock.start) / 1000));
    const left = LESSON_MINUTES * 60 - elapsed;
    const abs = Math.abs(left);
    const mm = String(Math.floor(abs / 60)).padStart(2, "0");
    const ss = String(abs % 60).padStart(2, "0");
    state = left < 0 ? "over" : left <= 5 * 60 ? "low" : "ok";
    label = elapsed > 3 * 3600 ? "45+ min" : `${left < 0 ? "+" : ""}${mm}:${ss}`;
  }

  return (
    <div
      className={cn(
        "flex h-9 items-center gap-2 rounded-full border px-3 font-digit text-sm tabular-nums",
        state === "low" || state === "over" ? "border-bad/40 text-bad" : "border-paper-300/15 text-paper-200/90",
        className,
      )}
      title={clock.end != null ? "Lesson time when the vault opened" : "Lesson timer — time left (45 minutes)"}
    >
      <ClockIcon className="size-4" />
      <span aria-label={`Lesson timer ${label}`}>{label}</span>
    </div>
  );
}

type Props = {
  scene: SceneId;
  solved: boolean[];
  escaped: boolean;
  teacher: boolean;
  clock: Clock;
  canOpen: (id: SceneId) => boolean;
  onGo: (id: SceneId) => void;
  onRules: () => void;
  onToggleTeacher: () => void;
  onReset: () => void;
};

export function Header({ scene, solved, escaped, teacher, clock, canOpen, onGo, onRules, onToggleTeacher, onReset }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menu) {
      setConfirmReset(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const solid = scene !== "intro" || scrolled;

  const steps: { id: SceneId; no: string; title: string; done: boolean }[] = [
    { id: "intro", no: "00", title: "Briefing", done: clock.start != null },
    ...ROOMS.map((r, i) => ({ id: r.id, no: r.no, title: r.title, done: i < 4 ? solved[i] : escaped })),
    ...(escaped ? [{ id: "escaped" as SceneId, no: "★", title: "Escape", done: true }] : []),
    { id: "homework", no: "HW", title: "Homework", done: false },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300",
        solid ? "border-b border-brass-400/10 bg-ink-950/80 backdrop-blur-md" : "border-b border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-brass-400 focus:px-4 focus:py-2 focus:text-ink-950"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onGo("intro")}
          className="group flex min-w-0 items-center gap-3 rounded-full text-left max-[359px]:hidden"
          aria-label="The Review Vault — back to the briefing"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-brass-400/50 bg-ink-900/80 text-brass-300 shadow-[0_0_20px_-6px_rgba(242,184,75,.8)] transition duration-300 group-hover:rotate-[20deg] group-hover:border-brass-300 group-hover:text-brass-200">
            <KeyholeIcon className="size-5" />
          </span>
          <span className="hidden min-w-0 leading-tight sm:block">
            <span className="block truncate font-display text-lg font-semibold text-paper-50">The Review Vault</span>
            <span className="block truncate font-type text-[10px] tracking-[0.22em] text-paper-300/70 uppercase">
              Academy Stars 3 · Review 1
            </span>
          </span>
        </button>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2.5">
            <span className="hidden font-type text-[10px] tracking-[0.22em] text-paper-300/70 uppercase lg:block">Code</span>
            <CodeSlots solved={solved} size="sm" />
          </div>

          <Timer clock={clock} className="hidden md:flex" />

          <button
            type="button"
            onClick={onRules}
            aria-haspopup="dialog"
            className="group inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-b from-brass-300 to-brass-500 px-3.5 text-sm font-extrabold text-ink-950 shadow-[0_10px_26px_-10px_rgba(242,184,75,.8),inset_0_1px_0_rgba(255,255,255,.55)] transition duration-200 hover:-translate-y-0.5 hover:from-brass-200 hover:to-brass-400 sm:px-4"
          >
            <BookIcon className="size-[18px] transition-transform duration-300 group-hover:-rotate-12" />
            <span className="sm:hidden">Rules</span>
            <span className="hidden sm:inline">Rule cards</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenu((m) => !m)}
              aria-expanded={menu}
              aria-haspopup="menu"
              aria-label="Lesson menu"
              className="grid size-10 place-items-center rounded-full border border-paper-300/15 text-paper-200 transition hover:border-brass-300/60 hover:bg-brass-400/10 hover:text-brass-200"
            >
              <DotsIcon className="size-5" />
            </button>

            {menu && (
              <>
                <button type="button" aria-label="Close menu" tabIndex={-1} className="fixed inset-0 z-40 cursor-default" onClick={() => setMenu(false)} />
                <div
                  role="menu"
                  className="animate-rise absolute top-full right-0 z-50 mt-3 w-72 rounded-2xl border border-brass-400/20 bg-ink-800 p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,.9)]"
                >
                  <div className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <span className="text-sm text-paper-200/80">Lesson timer</span>
                    <Timer clock={clock} />
                  </div>
                  <button
                    type="button"
                    role="menuitemcheckbox"
                    aria-checked={teacher}
                    onClick={onToggleTeacher}
                    className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-brass-400/10"
                  >
                    <span>
                      <span className="block text-sm font-bold text-paper-50">Teacher key</span>
                      <span lang="ru" className="block text-xs text-paper-300/80">
                        Открыть все комнаты без кода
                      </span>
                    </span>
                    <span className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", teacher ? "bg-brass-400" : "bg-ink-500")}>
                      <span className={cn("absolute top-0.5 left-0.5 size-5 rounded-full bg-paper-50 shadow transition-transform", teacher && "translate-x-5")} />
                    </span>
                  </button>
                  {teacher && (
                    <p className="mx-3 mb-1 flex items-center justify-between rounded-lg bg-brass-400/10 px-3 py-2 text-sm text-paper-200/85">
                      Vault code
                      <span className="font-digit text-base tracking-[0.3em] text-brass-300">{CODE.join("")}</span>
                    </p>
                  )}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      if (!confirmReset) return setConfirmReset(true);
                      setMenu(false);
                      onReset();
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition",
                      confirmReset ? "bg-bad/15 text-bad" : "text-paper-50 hover:bg-brass-400/10",
                    )}
                  >
                    <RefreshIcon className="size-4 shrink-0" />
                    {confirmReset ? "Tap again to erase all progress" : "Restart the case"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {scene !== "intro" && (
        <nav aria-label="Case map" className="border-t border-brass-400/10">
          <ol className="no-scrollbar mx-auto flex max-w-6xl overflow-x-auto px-2 sm:px-4 lg:px-6">
            {steps.map((step) => {
              const open = canOpen(step.id);
              const current = step.id === scene;
              return (
                <li key={step.id} className="shrink-0">
                  <button
                    type="button"
                    disabled={!open}
                    onClick={() => onGo(step.id)}
                    aria-current={current ? "step" : undefined}
                    title={open ? step.title : `${step.title} — locked. Solve the room before it first.`}
                    className={cn(
                      "relative flex h-11 items-center gap-2 px-2.5 text-[13px] font-bold whitespace-nowrap transition-colors sm:px-3 sm:text-sm",
                      "after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:origin-left after:rounded-full after:bg-brass-400 after:transition-transform after:duration-300",
                      current ? "text-brass-300 after:scale-x-100" : "text-paper-200/75 after:scale-x-0 hover:text-paper-50 hover:after:scale-x-100",
                      !open && "text-paper-300/35 hover:text-paper-300/35 hover:after:scale-x-0",
                    )}
                  >
                    <span className={cn("font-digit text-xs", current ? "text-brass-400" : "text-paper-300/50")}>{step.no}</span>
                    {step.title}
                    {!open ? (
                      <LockIcon className="size-3.5" />
                    ) : step.done && step.id !== "intro" ? (
                      <CheckIcon className="size-3.5 text-ok" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </header>
  );
}
