import { useState } from "react";
import { ArrowRightIcon, CheckIcon, RefreshIcon } from "../components/Icons";
import { Button, Feedback, Pips, RoomShell, Tag } from "../components/ui";
import { HOW_OFTEN_ITEMS, type RoomProps } from "../data/lesson";
import { usePersistentState } from "../hooks/usePersistentState";
import { cn } from "../utils/cn";

type State = {
  i: number;
  placed: number[]; // tile indexes, in order
  stage: 0 | 1 | 2; // 0 = build question, 1 = choose answer, 2 = solved
  wrongOpts: string[];
  misses: number;
};

const INITIAL: State = { i: 0, placed: [], stage: 0, wrongOpts: [], misses: 0 };
const TOTAL = HOW_OFTEN_ITEMS.length;

export function HowOftenRoom({ solved, onSolved, onOpenRules, onNext }: RoomProps) {
  const [s, setS] = usePersistentState<State>("t3", INITIAL);
  const [shake, setShake] = useState<string | null>(null);

  const finished = s.i >= TOTAL;
  const item = HOW_OFTEN_ITEMS[Math.min(s.i, TOTAL - 1)];
  const built = s.placed.map((t) => item.tiles[t]).join(" ");

  const flash = (id: string) => {
    setShake(id);
    window.setTimeout(() => setShake(null), 480);
  };

  const place = (t: number) => s.stage === 0 && setS({ ...s, placed: [...s.placed, t] });
  const remove = (t: number) => s.stage === 0 && setS({ ...s, placed: s.placed.filter((x) => x !== t) });

  const checkQuestion = () => {
    if (built === item.solution) setS({ ...s, stage: 1, misses: 0 });
    else {
      flash("line");
      setS({ ...s, misses: s.misses + 1 });
    }
  };

  const pickAnswer = (opt: string) => {
    if (s.stage !== 1) return;
    if (opt === item.answer) setS({ ...s, stage: 2 });
    else {
      flash(opt);
      setS({ ...s, wrongOpts: [...s.wrongOpts, opt] });
    }
  };

  const nextItem = () => {
    const i = s.i + 1;
    setS({ ...INITIAL, i });
    if (i >= TOTAL) onSolved();
  };

  return (
    <RoomShell
      roomIndex={2}
      solved={solved}
      onOpenRules={onOpenRules}
      onNext={onNext}
      instruction="Read the timetable note. Tap the word tiles to build a How often…? question — careful, some tiles are traps! Then choose the answer."
      ru="Прочитай запись из расписания. Нажимай на слова и составь вопрос How often…? Осторожно: есть лишние слова-ловушки! Потом выбери ответ."
    >
      {finished ? (
        <section className="panel animate-rise p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Tag>Interview notes · 6 / 6</Tag>
              <h2 className="mt-2 font-display text-3xl font-semibold text-paper-50">Ask and answer aloud</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setS(INITIAL)}>
              <RefreshIcon className="size-4" />
              Play this room again
            </Button>
          </div>
          <ol className="mt-6 grid gap-3 md:grid-cols-2">
            {HOW_OFTEN_ITEMS.map((it, i) => (
              <li key={i} className="paper-plain rounded-2xl px-4 py-3.5">
                <p className="text-[17px] leading-snug font-extrabold">{it.solution}?</p>
                <p className="mt-1 text-[16px] leading-snug text-sepia/85">
                  — {it.answerStart} <b>{it.answer}</b>.
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-8">
          {/* Timetable note */}
          <section key={s.i} className="paper animate-rise relative self-start rounded-2xl p-6 sm:p-7 lg:-rotate-1" aria-labelledby="note-title">
            <span className="tape" aria-hidden="true" />
            <p className="font-type text-xs tracking-[0.22em] text-sepia/70 uppercase">
              Timetable note № {s.i + 1} / {TOTAL}
            </p>
            <h2 id="note-title" className="sr-only">
              Timetable note
            </h2>
            <dl className="mt-5 space-y-4">
              <div>
                <dt className="font-type text-[11px] tracking-[0.2em] text-sepia/60 uppercase">Who</dt>
                <dd className="font-display text-2xl leading-tight font-semibold">{item.who}</dd>
              </div>
              <div>
                <dt className="font-type text-[11px] tracking-[0.2em] text-sepia/60 uppercase">What</dt>
                <dd className="font-display text-2xl leading-tight font-semibold">{item.activity}</dd>
              </div>
              <div>
                <dt className="font-type text-[11px] tracking-[0.2em] text-sepia/60 uppercase">How many times</dt>
                <dd className="mt-1.5 flex items-center gap-3">
                  <span className="inline-flex gap-1.5" role="img" aria-label={`${item.marks} ${item.marks === 1 ? "tick" : "ticks"}`}>
                    {Array.from({ length: 3 }, (_, k) => (
                      <span
                        key={k}
                        className={cn(
                          "grid size-10 place-items-center rounded-lg border-2",
                          k < item.marks ? "border-brass-600 bg-brass-400/50 text-sepia" : "border-dashed border-sepia/20 text-transparent",
                        )}
                      >
                        <CheckIcon className="size-5" />
                      </span>
                    ))}
                  </span>
                  <span className="text-lg font-extrabold">
                    in one <span className="rounded-md bg-sepia px-2 py-0.5 text-paper-50">{item.period}</span>
                  </span>
                </dd>
              </div>
            </dl>
          </section>

          {/* Builder */}
          <section className="panel p-5 sm:p-7" aria-label="Build the question">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <Tag>Step A · Build the question</Tag>
              <Pips total={TOTAL} index={s.i} />
            </div>

            <div
              className={cn(
                "mt-4 flex min-h-[4.75rem] flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed px-3 py-3 transition-colors duration-300",
                s.stage > 0 ? "border-ok/40 bg-ok/[0.07]" : "border-neon-400/35 bg-neon-400/[0.04]",
                shake === "line" && "animate-shake border-bad/60",
              )}
              aria-live="polite"
              aria-label={`Your question: ${built || "empty"}`}
            >
              {s.placed.length === 0 && <span className="px-2 text-paper-300/50">Tap the tiles below…</span>}
              {s.placed.map((t) => (
                <button
                  key={t}
                  type="button"
                  disabled={s.stage > 0}
                  onClick={() => remove(t)}
                  title="Tap to remove"
                  className={cn(
                    "animate-pop h-11 rounded-xl px-3.5 text-lg font-extrabold transition duration-200 [animation-duration:.25s]",
                    s.stage > 0 ? "bg-ok/15 text-ok" : "bg-paper-100 text-sepia shadow-[0_6px_14px_-6px_rgba(0,0,0,.7)] hover:-translate-y-0.5 hover:bg-paper-50",
                  )}
                >
                  {item.tiles[t]}
                </button>
              ))}
              {s.placed.length > 0 && <span className={cn("font-display text-3xl", s.stage > 0 ? "text-ok" : "text-paper-300/70")}>?</span>}
            </div>

            {s.stage === 0 && (
              <>
                <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Word tiles">
                  {item.tiles.map((word, t) => {
                    const used = s.placed.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        disabled={used}
                        onClick={() => place(t)}
                        className={cn(
                          "h-11 rounded-xl border px-3.5 text-lg font-extrabold transition duration-200",
                          used
                            ? "border-dashed border-paper-300/15 text-transparent"
                            : "border-brass-400/40 bg-brass-400/10 text-brass-200 hover:-translate-y-1 hover:border-brass-300 hover:bg-brass-400 hover:text-ink-950",
                        )}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Button onClick={checkQuestion} disabled={s.placed.length < 4}>
                    Check the question
                  </Button>
                  <Button variant="ghost" onClick={() => setS({ ...s, placed: [] })} disabled={s.placed.length === 0}>
                    Clear
                  </Button>
                </div>
                {s.misses > 0 && (
                  <div className="mt-4">
                    <Feedback tone="bad">
                      Not yet. Order: <b>How often + do / does + who + verb …?</b>{" "}
                      <span lang="ru" className="opacity-80">
                        {s.misses > 1 ? "С he / she / одним человеком — does, и глагол без -s." : "Проверь порядок слов и do / does."}
                      </span>
                    </Feedback>
                  </div>
                )}
              </>
            )}

            {s.stage >= 1 && (
              <div className="animate-rise mt-7 border-t border-brass-400/15 pt-6">
                <Tag>Step B · Choose the answer</Tag>
                <p className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-2 font-display text-2xl text-paper-50">
                  — {item.answerStart}
                  {s.stage === 2 ? (
                    <span className="animate-pop rounded-xl bg-ok/15 px-3 py-1 text-ok">{item.answer}</span>
                  ) : (
                    <span className="inline-block h-10 w-32 rounded-xl border-2 border-dashed border-neon-400/60 bg-neon-400/5" aria-label="gap" />
                  )}
                  .
                </p>

                {s.stage === 1 && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {item.options.map((opt) => {
                      const isWrong = s.wrongOpts.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={isWrong}
                          onClick={() => pickAnswer(opt)}
                          className={cn(
                            "h-14 rounded-2xl border px-3 text-[17px] font-extrabold transition duration-200",
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

                {s.stage === 1 && s.wrongOpts.length > 0 && (
                  <div className="mt-4">
                    <Feedback tone="bad">
                      Count the ticks and check the period.{" "}
                      <span lang="ru" className="opacity-80">
                        1 = once, 2 = twice, 3 = three times. День, неделя или месяц?
                      </span>
                    </Feedback>
                  </div>
                )}

                {s.stage === 2 && (
                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Feedback tone="ok">Perfect! Ask the question and answer it aloud.</Feedback>
                    <Button onClick={nextItem} autoFocus>
                      {s.i + 1 < TOTAL ? "Next note" : "Open the lock"}
                      <ArrowRightIcon className="size-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </RoomShell>
  );
}
