import { type ReactNode, useState } from "react";
import { ArrowRightIcon, RefreshIcon, SearchIcon } from "../components/Icons";
import { Button, Feedback, Pips, RoomShell, Tag } from "../components/ui";
import { PRESENT_ITEMS, type RoomProps } from "../data/lesson";
import { usePersistentState } from "../hooks/usePersistentState";
import { cn } from "../utils/cn";

type State = { i: number; stage: 0 | 1; wrong: string | null };
const INITIAL: State = { i: 0, stage: 0, wrong: null };
const TOTAL = PRESENT_ITEMS.length;

function markSignal(text: string, signal: string, on: boolean, now: boolean): ReactNode {
  const at = text.indexOf(signal);
  if (!on || at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <mark className={cn("animate-fade rounded-md px-1.5 py-0.5 text-inherit", now ? "bg-neon-500/25 shadow-[inset_0_-3px_0_#1fa8f0]" : "bg-brass-400/50 shadow-[inset_0_-3px_0_#a87323]")}>
        {signal}
      </mark>
      {text.slice(at + signal.length)}
    </>
  );
}

function Folder({ now, items }: { now: boolean; items: (typeof PRESENT_ITEMS)[number][] }) {
  return (
    <section className={cn("rounded-2xl border p-4", now ? "border-neon-400/25 bg-neon-400/[0.05]" : "border-brass-400/25 bg-brass-400/[0.05]")}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <h3 className={cn("font-type text-xs tracking-[0.22em] uppercase", now ? "text-neon-300" : "text-brass-300")}>{now ? "Now file" : "Usually file"}</h3>
        <span className="font-digit text-sm text-paper-300/70">{items.length}/4</span>
      </div>
      <p className="mt-1 text-sm text-paper-300/80">{now ? "present continuous" : "present simple"}</p>
      {items.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {items.map((it) => (
            <li key={it.before} className="animate-rise text-[15px] leading-snug text-paper-100/90">
              {it.before} <b className={now ? "text-neon-300" : "text-brass-300"}>{it.answer}</b> {it.after}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function PresentMix({ solved, onSolved, onOpenRules, onNext }: RoomProps) {
  const [s, setS] = usePersistentState<State>("t4", INITIAL);
  const [shake, setShake] = useState<string | null>(null);

  const finished = s.i >= TOTAL;
  const item = PRESENT_ITEMS[Math.min(s.i, TOTAL - 1)];
  const sorted = PRESENT_ITEMS.slice(0, finished ? TOTAL : s.i + (s.stage === 1 ? 1 : 0));
  const answered = s.stage === 1;

  const pick = (opt: string) => {
    if (answered) return;
    if (opt === item.answer) setS({ ...s, stage: 1 });
    else {
      setShake(opt);
      window.setTimeout(() => setShake(null), 480);
      setS({ ...s, wrong: opt });
    }
  };

  const nextItem = () => {
    const i = s.i + 1;
    setS({ ...INITIAL, i });
    if (i >= TOTAL) onSolved();
  };

  return (
    <RoomShell
      roomIndex={3}
      solved={solved}
      onOpenRules={onOpenRules}
      onNext={onNext}
      instruction="Eight snapshots from school and home are mixed up. Find the signal word and choose the right form: happening now — or a routine?"
      ru="Восемь снимков из школы и дома перепутались. Найди слово-сигнал и выбери форму: это происходит сейчас или это привычка?"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-8">
        {finished ? (
          <section className="panel animate-rise self-start p-5 sm:p-8">
            <Tag>All 8 snapshots sorted</Tag>
            <h2 className="mt-2 font-display text-3xl font-semibold text-paper-50">The mixed files are in order!</h2>
            <p className="mt-3 max-w-xl text-paper-200/85">
              Read each file aloud. Which words told you it was <b className="text-neon-300">now</b>? Which words told you it was a{" "}
              <b className="text-brass-300">routine</b>?
            </p>
            <Button variant="ghost" size="sm" className="mt-6" onClick={() => setS(INITIAL)}>
              <RefreshIcon className="size-4" />
              Play this room again
            </Button>
          </section>
        ) : (
          <section className="panel self-start p-5 sm:p-7" aria-label="Snapshot">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <Tag>
                Snapshot № {s.i + 1} / {TOTAL}
              </Tag>
              <Pips total={TOTAL} index={s.i} />
            </div>

            <div key={s.i} className="paper animate-rise relative mt-5 rounded-2xl px-5 pt-6 pb-8 sm:px-8 sm:pt-7 sm:pb-10">
              <p className="inline-flex items-center gap-2 rounded-full bg-sepia/10 px-3 py-1 font-type text-[11px] tracking-[0.2em] text-sepia/80 uppercase">
                <SearchIcon className="size-3.5" />
                {item.place}
              </p>

              <p className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-2 font-display text-[1.75rem] leading-tight font-semibold sm:text-4xl">
                <span>{markSignal(item.before, item.signal, answered, item.now)}</span>
                {answered ? (
                  <span className={cn("animate-pop rounded-xl px-3 py-1", item.now ? "bg-neon-500/20 text-[#0b5c86]" : "bg-brass-400/50 text-sepia")}>{item.answer}</span>
                ) : (
                  <span className="inline-block h-11 w-32 rounded-xl border-2 border-dashed border-sepia/40 bg-white/40" aria-label="gap" />
                )}
                <span>{markSignal(item.after, item.signal, answered, item.now)}</span>
              </p>

              {answered && (
                <span
                  className={cn(
                    "animate-stamp absolute right-4 bottom-3 rounded-md border-[3px] px-3 py-1 font-type text-sm tracking-[0.2em] uppercase sm:right-6 sm:text-base",
                    item.now ? "border-[#0b76ad] text-[#0b76ad]" : "border-brass-600 text-brass-600",
                  )}
                >
                  {item.now ? "Now" : "Routine"}
                </span>
              )}
            </div>

            {!answered && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2" role="group" aria-label="Choose the form">
                {item.options.map((opt) => {
                  const isWrong = s.wrong === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={isWrong}
                      onClick={() => pick(opt)}
                      className={cn(
                        "h-16 rounded-2xl border text-xl font-extrabold transition duration-200",
                        isWrong
                          ? "border-bad/25 bg-bad/5 text-paper-300/40 line-through"
                          : "border-paper-300/20 bg-ink-900/60 text-paper-50 hover:-translate-y-1 hover:border-brass-300/70 hover:bg-brass-400/10 hover:shadow-[0_14px_30px_-14px_rgba(242,184,75,.7)]",
                        shake === opt && "animate-shake",
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-4">
              {!answered && s.wrong && (
                <Feedback tone="bad">
                  Look for the signal word!{" "}
                  <span lang="ru" className="opacity-80">
                    Найди слово-сигнал: now / Look! / Listen! — сейчас; usually / never / every… / once a… — привычка.
                  </span>
                </Feedback>
              )}
              {answered && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Feedback tone="ok">
                    Signal: <b>“{item.signal}”</b> → {item.now ? "present continuous (am / is / are + -ing)" : "present simple (routine)"}
                  </Feedback>
                  <Button onClick={nextItem} autoFocus>
                    {s.i + 1 < TOTAL ? "Next snapshot" : "Open the lock"}
                    <ArrowRightIcon className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        <aside className="space-y-3 self-start" aria-label="Sorted files">
          <Folder now items={sorted.filter((x) => x.now)} />
          <Folder now={false} items={sorted.filter((x) => !x.now)} />
        </aside>
      </div>
    </RoomShell>
  );
}
