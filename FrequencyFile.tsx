import { useEffect, useRef, useState } from "react";
import { CheckIcon, RefreshIcon } from "../components/Icons";
import { Button, Feedback, RoomShell, Tag } from "../components/ui";
import { ADVERBS, FREQUENCY_ITEMS, FREQUENCY_KEY, type RoomProps } from "../data/lesson";
import { usePersistentState } from "../hooks/usePersistentState";
import { cn } from "../utils/cn";

type State = {
  answers: (string | null)[];
  locked: boolean[];
  active: number;
  checks: number;
};

const TOTAL = FREQUENCY_ITEMS.length;
const INITIAL: State = {
  answers: Array(TOTAL).fill(null),
  locked: Array(TOTAL).fill(false),
  active: 0,
  checks: 0,
};
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

function WeekStrip({ days, small }: { days: readonly number[]; small?: boolean }) {
  return (
    <span className="inline-flex gap-1" role="img" aria-label={`${days.length} ${days.length === 1 ? "day" : "days"} out of 7`}>
      {DAYS.map((d, i) => {
        const on = days.includes(i);
        return (
          <span
            key={i}
            className={cn(
              "grid place-items-center rounded-md font-digit leading-none",
              small ? "size-4 text-[0px]" : "size-7 text-[11px]",
              on ? "bg-brass-400 text-ink-950 shadow-[0_0_10px_-2px_rgba(242,184,75,.8)]" : "bg-paper-300/10 text-paper-300/45",
            )}
          >
            {d}
          </span>
        );
      })}
    </span>
  );
}

export function FrequencyFile({ solved, onSolved, onOpenRules, onNext }: RoomProps) {
  const [s, setS] = usePersistentState<State>("t2", INITIAL);
  const [wrong, setWrong] = useState<number[]>([]);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const done = s.locked.every(Boolean);
  const filled = s.answers.every(Boolean);
  const correctCount = s.locked.filter(Boolean).length;

  const nextEmpty = (answers: (string | null)[], from: number) => {
    for (let k = 1; k <= TOTAL; k++) {
      const idx = (from + k) % TOTAL;
      if (!answers[idx]) return idx;
    }
    return from;
  };

  const pick = (word: string) => {
    if (done || wrong.length) return;
    let target = s.active;
    if (s.locked[target]) target = nextEmpty(s.answers, target);
    if (s.locked[target]) return;
    const answers = s.answers.map((a, i) => (i === target ? word : a));
    setS({ ...s, answers, active: nextEmpty(answers, target) });
  };

  const tapGap = (i: number) => {
    if (s.locked[i] || wrong.length) return;
    setS({ ...s, answers: s.answers.map((a, k) => (k === i ? null : a)), active: i });
  };

  const check = () => {
    const locked = s.answers.map((a, i) => a === FREQUENCY_ITEMS[i].answer);
    const bad = locked.map((ok, i) => (ok ? -1 : i)).filter((i) => i >= 0);
    setS({ ...s, locked, checks: s.checks + 1 });
    if (bad.length === 0) {
      onSolved();
      return;
    }
    setWrong(bad);
    timer.current = window.setTimeout(() => {
      setWrong([]);
      setS((prev) => ({
        ...prev,
        answers: prev.answers.map((a, i) => (bad.includes(i) ? null : a)),
        active: bad[0],
      }));
    }, 1100);
  };

  return (
    <RoomShell
      roomIndex={1}
      solved={solved}
      onOpenRules={onOpenRules}
      onNext={onNext}
      instruction="Look at each week chart. Gold squares are the days it happens. Tap a gap, then tap the right adverb of frequency."
      ru="Посмотри на недельную схему: золотые квадраты — дни, когда это происходит. Нажми на пропуск, затем выбери подходящее наречие частоты."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-8">
        <section className="panel p-4 sm:p-7" aria-label="Sentences">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tag>File F-02 · Chores & free time</Tag>
            <p className="font-digit text-sm text-paper-300/80" role="status">
              {correctCount}/{TOTAL} correct
            </p>
          </div>

          <ol className="mt-5 space-y-2.5">
            {FREQUENCY_ITEMS.map((item, i) => {
              const value = s.answers[i];
              const locked = s.locked[i];
              const isWrong = wrong.includes(i);
              const active = !done && !locked && s.active === i;
              return (
                <li
                  key={i}
                  className={cn(
                    "flex flex-col gap-3 rounded-2xl border px-4 py-3.5 transition-colors duration-300 sm:flex-row sm:items-center sm:gap-5",
                    locked ? "border-ok/25 bg-ok/[0.06]" : active ? "border-neon-400/40 bg-neon-400/[0.06]" : "border-paper-300/10 bg-ink-900/50",
                    isWrong && "animate-shake border-bad/40 bg-bad/10",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-digit text-sm text-paper-300/50">{String(i + 1).padStart(2, "0")}</span>
                    <WeekStrip days={item.days} />
                  </div>
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-lg text-paper-50 sm:text-xl">
                    <span>{item.before}</span>
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() => tapGap(i)}
                      aria-label={value ? `Gap ${i + 1}: ${value}. Tap to change.` : `Gap ${i + 1}, empty. Tap to select.`}
                      className={cn(
                        "inline-flex h-10 min-w-[7.5rem] items-center justify-center gap-1.5 rounded-xl border-2 px-3 text-lg font-extrabold transition duration-200",
                        locked && "border-ok/50 bg-ok/15 text-ok",
                        !locked && value && !isWrong && "border-brass-400/60 bg-brass-400/15 text-brass-200 hover:border-brass-300",
                        !locked && !value && (active ? "animate-pulse-glow border-dashed border-neon-400 bg-neon-400/10" : "border-dashed border-paper-300/30 hover:border-neon-400/70"),
                        isWrong && "border-bad/60 bg-bad/15 text-bad",
                      )}
                    >
                      {value ?? <span className="text-paper-300/40">· · ·</span>}
                      {locked && <CheckIcon className="size-4" />}
                    </button>
                    <span>{item.after}</span>
                  </p>
                </li>
              );
            })}
          </ol>

          {/* Word bank */}
          {!done && (
            <div className="sticky bottom-3 z-10 mt-5 rounded-2xl border border-brass-400/25 bg-ink-700/95 p-3 shadow-[0_20px_40px_-16px_rgba(0,0,0,.9)] backdrop-blur-md sm:p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Word bank: adverbs of frequency">
                  {ADVERBS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => pick(w)}
                      className="h-11 rounded-full border border-brass-400/40 bg-brass-400/10 px-4 text-[15px] font-extrabold text-brass-200 transition duration-200 hover:-translate-y-0.5 hover:border-brass-300 hover:bg-brass-400 hover:text-ink-950 active:translate-y-0"
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <Button onClick={check} disabled={!filled || wrong.length > 0}>
                  Check the file
                </Button>
              </div>
            </div>
          )}

          <div className="mt-4 space-y-3">
            {wrong.length > 0 && (
              <Feedback tone="bad">
                {TOTAL - wrong.length} of {TOTAL} are right. Fix the red ones!{" "}
                <span lang="ru" className="opacity-80">
                  Посчитай золотые дни ещё раз.
                </span>
              </Feedback>
            )}
            {done && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Feedback tone="ok">File complete! Read all 7 sentences aloud.</Feedback>
                <Button variant="ghost" size="sm" onClick={() => setS(INITIAL)}>
                  <RefreshIcon className="size-4" />
                  Play this room again
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Key */}
        <aside className="paper relative self-start rounded-2xl p-5 lg:rotate-1" aria-label="Frequency key">
          <span className="tape" aria-hidden="true" />
          <p className="font-type text-xs tracking-[0.22em] text-sepia/70 uppercase">Detective's key</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">How many days?</h2>
          <ul className="mt-4 space-y-2.5">
            {FREQUENCY_KEY.map((k) => (
              <li key={k.word} className="flex items-center justify-between gap-3">
                <span className="text-[17px] font-extrabold">{k.word}</span>
                <span className="inline-flex gap-1" aria-label={`${k.days} days`}>
                  {Array.from({ length: 7 }, (_, i) => (
                    <span key={i} className={cn("size-3.5 rounded-[4px]", i < k.days ? "bg-brass-600" : "bg-sepia/15")} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <p lang="ru" className="mt-4 border-t border-sepia/15 pt-3 text-sm leading-relaxed text-sepia/80">
            Внимание на № 6: после <b>is</b> наречие стоит <b>после</b> глагола — «is always».
          </p>
        </aside>
      </div>
    </RoomShell>
  );
}
