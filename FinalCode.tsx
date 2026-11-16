import { useEffect, useRef, useState } from "react";
import { BackspaceIcon, CheckIcon, KeyIcon, LockIcon, UnlockIcon } from "../components/Icons";
import { Button, Feedback, RoomShell, Tag } from "../components/ui";
import { CODE, REPORT_CHECKS, REPORT_STARTERS } from "../data/lesson";
import { usePersistentState } from "../hooks/usePersistentState";
import { cn } from "../utils/cn";
import { countSentences } from "../utils/text";

type State = { entry: string; codeOk: boolean; report: string; oral: boolean };
const INITIAL: State = { entry: "", codeOk: false, report: "", oral: false };
const MIN_SENTENCES = 6;

type Props = {
  name: string;
  onEscape: () => void;
  onOpenRules: (tab: number) => void;
};

export function FinalCode({ name, onEscape, onOpenRules }: Props) {
  const [s, setS] = usePersistentState<State>("final", INITIAL);
  const [bad, setBad] = useState(false);
  const reportRef = useRef<HTMLTextAreaElement>(null);
  const live = useRef(s);
  live.current = s;

  const sentences = countSentences(s.report);
  const reportOk = sentences >= MIN_SENTENCES || s.oral;
  const ready = s.codeOk && reportOk;

  const press = (key: string) => {
    const cur = live.current;
    if (cur.codeOk) return;
    if (key === "back") return setS({ ...cur, entry: cur.entry.slice(0, -1) });
    if (key === "ok") {
      if (cur.entry.length < 4) return;
      if (cur.entry === CODE.join("")) return setS({ ...cur, codeOk: true });
      setBad(true);
      window.setTimeout(() => {
        setBad(false);
        setS((p) => ({ ...p, entry: "" }));
      }, 650);
      return;
    }
    if (cur.entry.length < 4) setS({ ...cur, entry: cur.entry + key });
  };

  // Physical keyboard support for the keypad
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName ?? "";
      if (tag === "TEXTAREA" || tag === "INPUT" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === "Backspace") press("back");
      else if (e.key === "Enter" && tag !== "BUTTON") press("ok");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addStarter = (text: string) => {
    const base = s.report && !/\s$/.test(s.report) ? s.report + " " : s.report;
    setS({ ...s, report: base + text });
    reportRef.current?.focus();
  };

  return (
    <RoomShell
      roomIndex={4}
      solved={false}
      onOpenRules={onOpenRules}
      onNext={() => {}}
      instruction="The last door! Enter your 4-digit code, then write a short detective report about yourself — 6 or 7 sentences with everything from today's case."
      ru="Последняя дверь! Введи код из четырёх цифр и напиши короткий отчёт детектива о себе: 6–7 предложений со всей грамматикой и лексикой урока."
    >
      <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-8">
        {/* Keypad */}
        <section className="panel self-start p-5 sm:p-7" aria-labelledby="keypad-title">
          <div className="flex items-center justify-between">
            <Tag>Part 1 · The code</Tag>
            {s.codeOk ? <UnlockIcon className="size-5 text-ok" /> : <LockIcon className="size-5 text-neon-300" />}
          </div>
          <h2 id="keypad-title" className="sr-only">
            Code keypad
          </h2>

          <div
            className={cn(
              "mt-4 flex justify-center gap-2.5 rounded-2xl border bg-ink-950/80 px-3 py-4 transition-colors duration-300",
              s.codeOk ? "border-ok/50" : bad ? "animate-shake border-bad/60" : "border-neon-400/30",
            )}
            role="status"
            aria-label={s.codeOk ? "Code accepted" : `Entered ${s.entry.length} of 4 digits`}
          >
            {Array.from({ length: 4 }, (_, i) => {
              const ch = s.codeOk ? CODE[i] : s.entry[i];
              return (
                <span
                  key={i}
                  className={cn(
                    "grid h-16 w-14 place-items-center rounded-xl border font-digit text-5xl leading-none transition-colors",
                    s.codeOk
                      ? "border-ok/50 bg-ok/10 text-ok [text-shadow:0_0_14px_rgba(116,220,156,.7)]"
                      : bad
                        ? "border-bad/50 bg-bad/10 text-bad"
                        : ch
                          ? "neon-text border-neon-400/60 bg-neon-400/10 text-neon-300"
                          : "border-paper-300/15 text-paper-300/25",
                  )}
                >
                  {ch ?? "–"}
                </span>
              );
            })}
          </div>

          {s.codeOk ? (
            <div className="mt-4">
              <Feedback tone="ok">
                <b>Code accepted.</b> Now finish your report to turn the wheel.
              </Feedback>
            </div>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "back", "0", "ok"].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => press(k)}
                    disabled={k === "ok" && s.entry.length < 4}
                    aria-label={k === "back" ? "Delete last digit" : k === "ok" ? "Enter code" : `Digit ${k}`}
                    className={cn(
                      "grid h-14 place-items-center rounded-xl border font-digit text-2xl transition duration-150 active:scale-95 disabled:opacity-40",
                      k === "ok"
                        ? "border-brass-300 bg-gradient-to-b from-brass-300 to-brass-500 text-lg font-bold text-ink-950 hover:from-brass-200 hover:to-brass-400"
                        : "border-paper-300/15 bg-ink-900/70 text-paper-50 hover:border-neon-400/60 hover:bg-neon-400/10 hover:text-neon-300",
                    )}
                  >
                    {k === "back" ? <BackspaceIcon className="size-6" /> : k === "ok" ? "OK" : k}
                  </button>
                ))}
              </div>
              <p lang="ru" className="mt-4 text-sm leading-relaxed text-paper-300/80">
                Цифры кода записаны в твоём блокноте вверху экрана — по порядку комнат.
              </p>
              {bad && (
                <div className="mt-3">
                  <Feedback tone="bad">Wrong code. Check your notebook at the top!</Feedback>
                </div>
              )}
            </>
          )}
        </section>

        {/* Report */}
        <section className="panel p-5 sm:p-7" aria-labelledby="report-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tag>Part 2 · Detective report</Tag>
            <p
              className={cn("rounded-full border px-3 py-1 font-digit text-sm", sentences >= MIN_SENTENCES ? "border-ok/40 text-ok" : "border-paper-300/20 text-paper-300/80")}
              role="status"
            >
              {sentences} / {MIN_SENTENCES}–7 sentences
            </p>
          </div>
          <h2 id="report-title" className="mt-2 font-display text-3xl font-semibold text-paper-50">
            Who is detective {name || "…"}?
          </h2>

          <div className="mt-4 grid gap-5 xl:grid-cols-[minmax(0,1fr)_15rem]">
            <div>
              <div className="paper relative rounded-2xl p-1">
                <label htmlFor="report" className="sr-only">
                  Your report
                </label>
                <textarea
                  id="report"
                  ref={reportRef}
                  value={s.report}
                  onChange={(e) => setS({ ...s, report: e.target.value })}
                  rows={9}
                  spellCheck={false}
                  placeholder="My name is … My favourite subject is … I'm good at … I always … I … twice a week. Right now I am writing my report."
                  className="block min-h-[18rem] w-full resize-y rounded-xl bg-transparent px-4 py-3 text-[18px] leading-[32px] font-bold text-sepia placeholder:font-semibold placeholder:text-sepia/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-600/60"
                />
              </div>
              <div className="mt-3">
                <p className="text-sm text-paper-300/80">Sentence starters — tap to add:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {REPORT_STARTERS.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => addStarter(st)}
                      className="rounded-full border border-paper-300/20 px-3 py-1.5 text-sm font-bold text-paper-100 transition duration-200 hover:-translate-y-0.5 hover:border-brass-300/70 hover:bg-brass-400/10 hover:text-brass-200"
                    >
                      {st.trim()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="font-type text-[11px] tracking-[0.22em] text-paper-300/70 uppercase">My report has…</p>
              <ul className="mt-3 space-y-2">
                {REPORT_CHECKS.map((c) => {
                  const ok = c.test.test(s.report);
                  return (
                    <li key={c.label} className={cn("flex items-start gap-2.5 text-[15px] leading-snug transition-colors", ok ? "text-ok" : "text-paper-200/75")}>
                      <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border transition-colors", ok ? "border-ok bg-ok text-ink-950" : "border-paper-300/30")}>
                        {ok && <CheckIcon className="size-3" />}
                      </span>
                      {c.label}
                    </li>
                  );
                })}
              </ul>
              <label className="mt-5 flex cursor-pointer items-start gap-2.5 rounded-xl border border-paper-300/15 p-3 text-sm leading-snug text-paper-200/85 transition hover:border-brass-300/50">
                <input type="checkbox" checked={s.oral} onChange={(e) => setS({ ...s, oral: e.target.checked })} className="mt-0.5 size-4 accent-[#f2b84b]" />
                <span>
                  Teacher: the report was told <b>out loud</b>
                  <span lang="ru" className="block text-xs text-paper-300/70">
                    Отчёт рассказан устно — засчитать
                  </span>
                </span>
              </label>
            </div>
          </div>
        </section>
      </div>

      {/* Door control */}
      <section className={cn("mt-6 flex flex-col gap-5 rounded-3xl border p-5 transition-colors duration-500 sm:flex-row sm:items-center sm:justify-between sm:p-7", ready ? "border-brass-300/60 bg-brass-400/10" : "border-paper-300/10 bg-ink-800/70")}>
        <ul className="flex flex-col gap-2 sm:flex-row sm:gap-6">
          {[
            { ok: s.codeOk, label: "Code accepted" },
            { ok: reportOk, label: "Report ready (6+ sentences)" },
          ].map((r) => (
            <li key={r.label} className={cn("flex items-center gap-2.5 font-bold", r.ok ? "text-ok" : "text-paper-300/70")}>
              <span className={cn("grid size-6 place-items-center rounded-full border", r.ok ? "border-ok bg-ok text-ink-950" : "border-paper-300/30")}>{r.ok && <CheckIcon className="size-3.5" />}</span>
              {r.label}
            </li>
          ))}
        </ul>
        <Button size="lg" disabled={!ready} onClick={onEscape} className={cn(ready && "ring-4 ring-brass-300/30")}>
          <KeyIcon className="size-5" />
          Open the vault door
        </Button>
      </section>
    </RoomShell>
  );
}
