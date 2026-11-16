import { useState } from "react";
import { ArrowRightIcon, CheckIcon, RefreshIcon, SearchIcon } from "../components/Icons";
import { Button, Feedback, Pips, RoomShell, Tag } from "../components/ui";
import { type RoomProps, SUBJECT_CLUES, SUBJECTS } from "../data/lesson";
import { usePersistentState } from "../hooks/usePersistentState";
import { cn } from "../utils/cn";

type State = {
  i: number;
  stage: 0 | 1 | 2; // 0 = pick subject, 1 = good at?, 2 = clue solved
  wrong: string[];
  wrongGood: boolean;
};

const INITIAL: State = { i: 0, stage: 0, wrong: [], wrongGood: false };
const TOTAL = SUBJECT_CLUES.length;

const subjectLabel = (id: string) => SUBJECTS.find((s) => s.id === id)?.label ?? id;

export function SubjectLock({ solved, onSolved, onOpenRules, onNext }: RoomProps) {
  const [s, setS] = usePersistentState<State>("t1", INITIAL);
  const [shake, setShake] = useState<string | null>(null);

  const finished = s.i >= TOTAL;
  const clue = SUBJECT_CLUES[Math.min(s.i, TOTAL - 1)];

  const flash = (id: string) => {
    setShake(id);
    window.setTimeout(() => setShake(null), 480);
  };

  const pickSubject = (id: string) => {
    if (s.stage !== 0) return;
    if (id === clue.subject) setS({ ...s, stage: 1 });
    else {
      flash(id);
      setS({ ...s, wrong: [...s.wrong, id] });
    }
  };

  const pickGood = (good: boolean) => {
    if (s.stage !== 1) return;
    if (good === clue.good) setS({ ...s, stage: 2, wrongGood: false });
    else {
      flash(good ? "good" : "notgood");
      setS({ ...s, wrongGood: true });
    }
  };

  const nextClue = () => {
    const i = s.i + 1;
    setS({ ...INITIAL, i });
    if (i >= TOTAL) onSolved();
  };

  return (
    <RoomShell
      roomIndex={0}
      solved={solved}
      onOpenRules={onOpenRules}
      onNext={onNext}
      instruction="Read the clues and choose the school subject. Then finish the detective note: is the pupil good at it — or not good at it?"
      ru="Прочитай улики и выбери школьный предмет. Потом закончи запись детектива: good at или not good at? Подсказка — в School report."
    >
      {finished ? (
        <section className="panel animate-rise p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Tag>Case notes · 7 / 7 clues solved</Tag>
              <h2 className="mt-2 font-display text-3xl font-semibold text-paper-50">Read your notes aloud</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setS(INITIAL)}>
              <RefreshIcon className="size-4" />
              Play this room again
            </Button>
          </div>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {SUBJECT_CLUES.map((c, i) => (
              <li key={i} className="paper-plain flex items-center gap-3 rounded-2xl px-4 py-3.5">
                <span className="font-digit text-sm text-sepia/50">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[17px] leading-snug">
                  {c.who} <b>{c.good ? "is good at" : "isn't good at"}</b> {subjectLabel(c.subject)}.
                </span>
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-8">
          {/* Evidence card */}
          <section key={s.i} aria-labelledby="clue-title" className="paper animate-rise relative self-start rounded-2xl p-6 sm:p-8 lg:-rotate-1">
            <span className="tape" aria-hidden="true" />
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <p className="font-type text-xs tracking-[0.22em] text-sepia/70 uppercase">
                Evidence № {s.i + 1} / {TOTAL}
              </p>
              <p className="rounded border border-sepia/30 px-2 py-0.5 font-type text-[11px] tracking-[0.18em] text-sepia/70 uppercase">Top secret</p>
            </div>
            <h2 id="clue-title" className="mt-4 font-display text-3xl leading-tight font-semibold">
              {clue.who}'s mystery lesson
            </h2>

            <ul className="mt-5 space-y-3">
              {clue.clues.map((line, i) => (
                <li key={line} className="animate-rise flex items-start gap-3 text-[19px] leading-[32px]" style={{ animationDelay: `${150 + i * 150}ms` }}>
                  <SearchIcon className="mt-1.5 size-5 shrink-0 text-brass-600" />
                  <span>“{line}”</span>
                </li>
              ))}
            </ul>

            <div className="animate-rise mt-6 rotate-1 rounded-xl bg-white/60 p-4 shadow-[0_8px_20px_-10px_rgba(59,41,22,.5),inset_0_0_0_1px_rgba(59,41,22,.12)]" style={{ animationDelay: "450ms" }}>
              <p className="font-type text-[11px] tracking-[0.22em] text-sepia/60 uppercase">School report · {clue.who}</p>
              <p className="mt-1.5 text-[17px] leading-snug font-bold">{clue.report}</p>
            </div>
          </section>

          {/* Answer panel */}
          <section className="panel p-5 sm:p-7" aria-label="Your answer">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <Tag>Step A · Which subject is it?</Tag>
              <Pips total={TOTAL} index={s.i} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {SUBJECTS.map((sub) => {
                const isRight = s.stage > 0 && sub.id === clue.subject;
                const isWrong = s.wrong.includes(sub.id);
                return (
                  <button
                    key={sub.id}
                    type="button"
                    disabled={s.stage > 0 || isWrong}
                    onClick={() => pickSubject(sub.id)}
                    className={cn(
                      "group relative flex h-[4.5rem] flex-col items-center justify-center gap-0.5 rounded-2xl border text-[15px] font-extrabold transition duration-200",
                      !isRight && !isWrong && s.stage === 0 && "border-paper-300/15 bg-ink-900/60 text-paper-50 hover:-translate-y-1 hover:border-brass-300/70 hover:bg-brass-400/10 hover:shadow-[0_14px_30px_-14px_rgba(242,184,75,.7)]",
                      isRight && "border-ok/60 bg-ok/15 text-ok",
                      isWrong && "border-bad/25 bg-bad/5 text-paper-300/40 line-through",
                      !isRight && !isWrong && s.stage > 0 && "border-paper-300/10 bg-ink-900/40 text-paper-300/35",
                      shake === sub.id && "animate-shake",
                    )}
                  >
                    <span aria-hidden="true" className={cn("text-xl transition-transform duration-200 group-hover:scale-125", (isWrong || (s.stage > 0 && !isRight)) && "opacity-40 grayscale")}>
                      {sub.icon}
                    </span>
                    {sub.label}
                    {isRight && (
                      <span className="animate-pop absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-ok text-ink-950">
                        <CheckIcon className="size-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {s.stage === 0 && s.wrong.length > 0 && (
              <div className="mt-4">
                <Feedback tone="bad">
                  Not this one. Read the clues again!{" "}
                  <span lang="ru" className="opacity-80">
                    Перечитай улики — какие слова подсказывают предмет?
                  </span>
                </Feedback>
              </div>
            )}

            {s.stage >= 1 && (
              <div className="animate-rise mt-7 border-t border-brass-400/15 pt-6">
                <Tag>Step B · Finish the detective note</Tag>
                <p className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-2 font-display text-2xl text-paper-50 sm:text-[1.75rem]">
                  {clue.who}
                  {s.stage === 2 ? (
                    <span className="animate-pop rounded-xl bg-ok/15 px-3 py-1 text-ok">{clue.good ? "is good at" : "isn't good at"}</span>
                  ) : (
                    <span className="inline-block h-10 w-36 rounded-xl border-2 border-dashed border-neon-400/60 bg-neon-400/5" aria-label="gap" />
                  )}
                  {subjectLabel(clue.subject)}.
                </p>

                {s.stage === 1 && (
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {[
                      { id: "good", label: "is good at", value: true },
                      { id: "notgood", label: "isn't good at", value: false },
                    ].map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => pickGood(o.value)}
                        className={cn(
                          "h-14 rounded-2xl border border-paper-300/20 bg-ink-900/60 text-lg font-extrabold text-paper-50 transition duration-200 hover:-translate-y-1 hover:border-brass-300/70 hover:bg-brass-400/10 hover:shadow-[0_14px_30px_-14px_rgba(242,184,75,.7)]",
                          shake === o.id && "animate-shake border-bad/50",
                        )}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                )}

                {s.stage === 1 && s.wrongGood && (
                  <div className="mt-4">
                    <Feedback tone="bad">
                      Look at the school report again.{" "}
                      <span lang="ru" className="opacity-80">
                        Что написано в School report — успех или трудности?
                      </span>
                    </Feedback>
                  </div>
                )}

                {s.stage === 2 && (
                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Feedback tone="ok">Great detective work! Read the note aloud.</Feedback>
                    <Button onClick={nextClue} autoFocus>
                      {s.i + 1 < TOTAL ? "Next clue" : "Open the lock"}
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
