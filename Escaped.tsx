import { useEffect, useState } from "react";
import type { Clock } from "../components/Header";
import { ArrowRightIcon, FileIcon, RefreshIcon, StarIcon } from "../components/Icons";
import { Button, Reveal, Tag } from "../components/ui";
import { CODE } from "../data/lesson";
import { usePersistentState } from "../hooks/usePersistentState";
import { cn } from "../utils/cn";

const TOPICS = ["Subjects + good at", "Adverbs of frequency", "How often…?", "Now vs usually"];

type Reflection = { easy: string[]; easyText: string; hard: string[]; hardText: string };
const INITIAL: Reflection = { easy: [], easyText: "", hard: [], hardText: "" };

function VaultDoor({ open }: { open: boolean }) {
  const bolts = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return { x: 170 + Math.cos(a) * 156, y: 170 + Math.sin(a) * 156 };
  });
  const spokes = Array.from({ length: 6 }, (_, i) => i * 60);

  return (
    <div className={cn("vault mx-auto", open && "is-open")} role="img" aria-label={`The vault door is open. The code was ${CODE.join(" ")}.`}>
      <div className="vault-rays" />
      <div className="vault-hole">
        <div className="text-center">
          <p className="font-type text-[11px] tracking-[0.3em] text-ink-800/70 uppercase">The code</p>
          <p className="font-digit text-6xl leading-none tracking-[0.12em] text-ink-900 [text-shadow:0_1px_0_rgba(255,255,255,.6)]">{CODE.join("")}</p>
          <p className="mt-2 inline-block -rotate-6 rounded border-[3px] border-[#a23a22] px-2 py-0.5 font-type text-sm tracking-[0.2em] text-[#a23a22] uppercase">Case closed</p>
        </div>
      </div>
      <div className="vault-door">
        <svg viewBox="0 0 340 340" className="size-full" aria-hidden="true">
          <defs>
            <radialGradient id="vd-iron" cx="35%" cy="30%" r="80%">
              <stop offset="0" stopColor="#4a3a2a" />
              <stop offset="0.55" stopColor="#261a10" />
              <stop offset="1" stopColor="#120b06" />
            </radialGradient>
            <linearGradient id="vd-brass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffe2a6" />
              <stop offset="0.5" stopColor="#d9982f" />
              <stop offset="1" stopColor="#7a5216" />
            </linearGradient>
          </defs>
          <circle cx="170" cy="170" r="167" fill="url(#vd-iron)" stroke="url(#vd-brass)" strokeWidth="5" />
          <circle cx="170" cy="170" r="144" fill="none" stroke="url(#vd-brass)" strokeWidth="2" opacity="0.55" />
          {bolts.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r="4.5" fill="url(#vd-brass)" />
          ))}
          <circle cx="170" cy="170" r="112" fill="#1a120b" stroke="url(#vd-brass)" strokeWidth="3" />
          <circle cx="170" cy="170" r="98" fill="none" stroke="#4fcbff" strokeWidth="1.5" strokeDasharray="3 9" opacity="0.7" />
          <g className="vault-wheel">
            {spokes.map((deg) => (
              <g key={deg} transform={`rotate(${deg} 170 170)`}>
                <rect x="166" y="84" width="8" height="86" rx="4" fill="url(#vd-brass)" />
                <circle cx="170" cy="84" r="9" fill="url(#vd-brass)" />
              </g>
            ))}
            <circle cx="170" cy="170" r="30" fill="url(#vd-brass)" />
            <circle cx="170" cy="170" r="20" fill="#1a120b" />
            <circle cx="170" cy="166" r="5" fill="#4fcbff" />
            <path d="M167 168h6l2 12h-10z" fill="#4fcbff" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 18 }, (_, i) => ({
    left: (i * 53 + 7) % 100,
    delay: (i * 0.47) % 6,
    dur: 6 + (i % 5),
    w: 10 + (i % 3) * 4,
    h: 14 + (i % 4) * 3,
    gold: i % 3 === 0,
    dx: `${((i % 5) - 2) * 30}px`,
    spin: `${(i % 2 ? 1 : -1) * (360 + i * 30)}deg`,
  }));
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className={cn("confetti rounded-[2px]", p.gold ? "bg-brass-400 shadow-[0_0_12px_rgba(242,184,75,.8)]" : "bg-paper-100/90")}
          style={{ left: `${p.left}%`, width: p.w, height: p.h, ["--delay" as string]: `${p.delay}s`, ["--dur" as string]: `${p.dur}s`, ["--dx" as string]: p.dx, ["--spin" as string]: p.spin }}
        />
      ))}
    </div>
  );
}

function Chips({ value, onToggle, label }: { value: string[]; onToggle: (t: string) => void; label: string }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {TOPICS.map((t) => {
        const on = value.includes(t);
        return (
          <button
            key={t}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(t)}
            className={cn(
              "h-10 rounded-full border px-4 text-sm font-extrabold transition duration-200 hover:-translate-y-0.5",
              on ? "border-brass-300 bg-brass-400 text-ink-950" : "border-paper-300/20 text-paper-100 hover:border-brass-300/70 hover:bg-brass-400/10",
            )}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

type Props = {
  name: string;
  clock: Clock;
  onHomework: () => void;
  onReset: () => void;
};

export function Escaped({ name, clock, onHomework, onReset }: Props) {
  const [open, setOpen] = useState(false);
  const [r, setR] = usePersistentState<Reflection>("reflection", INITIAL);

  useEffect(() => {
    const id = window.setTimeout(() => setOpen(true), 350);
    return () => window.clearTimeout(id);
  }, []);

  const minutes = clock.start && clock.end ? Math.max(1, Math.round((clock.end - clock.start) / 60000)) : null;
  const toggle = (key: "easy" | "hard", t: string) =>
    setR({ ...r, [key]: r[key].includes(t) ? r[key].filter((x) => x !== t) : [...r[key], t] });

  const inputCls =
    "mt-3 h-12 w-full rounded-xl border border-paper-300/15 bg-ink-900/70 px-4 text-paper-50 placeholder:text-paper-300/40 transition focus:border-neon-400/70 focus:ring-2 focus:ring-neon-400/25 focus:outline-none";

  return (
    <main id="main" className="relative">
      <section className="relative overflow-hidden px-4 pt-10 pb-16 text-center sm:px-6 lg:pt-14">
        <Confetti />
        <div className="relative mx-auto max-w-3xl">
          <Tag className="animate-rise">Case № R1 · Mixed files · Solved</Tag>
          <h1 className="animate-rise mt-3 font-display text-[clamp(2.5rem,8vw,5rem)] leading-[0.95] font-semibold tracking-tight text-paper-50 [animation-delay:.1s]">
            You escaped{name ? "," : "!"} {name && <span className="gold-text italic">{name}!</span>}
          </h1>
          <p className="animate-rise mx-auto mt-4 max-w-xl text-lg text-paper-200/90 [animation-delay:.2s]">
            Clues collected, code cracked, door open. The files of Unit 1 and Unit 2 are back in order.
          </p>

          <div className="mt-12 mb-10 sm:mt-16 sm:mb-14">
            <VaultDoor open={open} />
          </div>

          <ul className="animate-rise mx-auto grid max-w-xl grid-cols-3 gap-3 [animation-delay:1.6s]">
            {[
              { big: "4/4", small: "locks opened" },
              { big: CODE.join(""), small: "secret code" },
              { big: minutes ? `${minutes}′` : "✓", small: minutes ? "minutes" : "door open" },
            ].map((x) => (
              <li key={x.small} className="rounded-2xl border border-brass-400/20 bg-ink-800/70 px-2 py-4">
                <p className="font-digit text-3xl text-brass-300 sm:text-4xl">{x.big}</p>
                <p className="mt-1 text-xs text-paper-300/80 sm:text-sm">{x.small}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6" aria-labelledby="reflection-title">
        <Reveal>
          <div className="panel p-5 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-brass-400/15 text-brass-300">
                <StarIcon className="size-5" />
              </span>
              <div>
                <Tag>Reflection · 2 minutes</Tag>
                <h2 id="reflection-title" className="font-display text-3xl font-semibold text-paper-50">
                  Detective's debrief
                </h2>
              </div>
            </div>
            <p lang="ru" className="mt-3 text-[15px] text-paper-300/80">
              Два коротких вопроса. Выбери темы и допиши одно предложение.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-paper-300/10 bg-ink-900/50 p-5">
                <label htmlFor="easy" className="font-display text-xl font-semibold text-paper-50">
                  1. What was easy for me today?
                </label>
                <div className="mt-3">
                  <Chips value={r.easy} onToggle={(t) => toggle("easy", t)} label="Easy topics" />
                </div>
                <input id="easy" value={r.easyText} onChange={(e) => setR({ ...r, easyText: e.target.value })} placeholder="I'm good at …" className={inputCls} />
              </div>
              <div className="rounded-2xl border border-paper-300/10 bg-ink-900/50 p-5">
                <label htmlFor="hard" className="font-display text-xl font-semibold text-paper-50">
                  2. What do I need to practise more?
                </label>
                <div className="mt-3">
                  <Chips value={r.hard} onToggle={(t) => toggle("hard", t)} label="Topics to practise" />
                </div>
                <input id="hard" value={r.hardText} onChange={(e) => setR({ ...r, hardText: e.target.value })} placeholder="I sometimes forget …" className={inputCls} />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" onClick={onReset}>
              <RefreshIcon className="size-4" />
              Start a new case
            </Button>
            <Button size="lg" onClick={onHomework}>
              <FileIcon className="size-5" />
              Open the homework file
              <ArrowRightIcon className="size-5" />
            </Button>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
