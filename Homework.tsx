import { type ReactNode, useState } from "react";
import { BookIcon, CheckIcon, CloseIcon, CopyIcon } from "../components/Icons";
import { Button, Reveal, Tag } from "../components/ui";
import { HW_CHARACTERS, HW_FREQ_PROMPTS, HW_FRIEND_IDEAS, HW_HOW_OFTEN_QUESTIONS, HW_MISTAKES } from "../data/lesson";
import { usePersistentState } from "../hooks/usePersistentState";
import { cn } from "../utils/cn";
import { copyText, countSentences, normalise } from "../utils/text";

type State = {
  a: string[];
  b: string[];
  q: string[];
  r: string[];
  fix: string[];
  checked: boolean;
  who: string;
  report: string;
};

const INITIAL: State = {
  a: Array(4).fill(""),
  b: Array(4).fill(""),
  q: Array(6).fill(""),
  r: Array(6).fill(""),
  fix: Array(7).fill(""),
  checked: false,
  who: "lucy",
  report: "",
};

const inputCls =
  "h-12 w-full min-w-0 rounded-xl border border-paper-300/15 bg-ink-900/70 px-4 text-[16px] text-paper-50 placeholder:text-paper-300/40 transition hover:border-paper-300/30 focus:border-neon-400/70 focus:ring-2 focus:ring-neon-400/25 focus:outline-none";

function TaskCard({ no, title, ru, count, children }: { no: number; title: string; ru: string; count: string; children: ReactNode }) {
  return (
    <Reveal>
      <section className="panel p-5 sm:p-8" aria-labelledby={`hw-${no}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-brass-400/40 bg-brass-400/10 font-digit text-2xl text-brass-300">{no}</span>
            <div>
              <h2 id={`hw-${no}`} className="font-display text-2xl leading-tight font-semibold text-paper-50 sm:text-3xl">
                {title}
              </h2>
              <p lang="ru" className="mt-1 text-[15px] leading-relaxed text-paper-300/80">
                {ru}
              </p>
            </div>
          </div>
          <span className="rounded-full border border-paper-300/20 px-3 py-1 font-digit text-sm text-paper-300/80">{count}</span>
        </div>
        <div className="mt-6">{children}</div>
      </section>
    </Reveal>
  );
}

function Row({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-3.5 w-6 shrink-0 text-right font-digit text-sm text-paper-300/50">{n}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  );
}

export function Homework({ name, onOpenRules }: { name: string; onOpenRules: (tab: number) => void }) {
  const [s, setS] = usePersistentState<State>("homework", INITIAL);
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");

  const setAt = (key: "a" | "b" | "q" | "r" | "fix", i: number, value: string) =>
    setS({ ...s, [key]: s[key].map((v, k) => (k === i ? value : v)), ...(key === "fix" ? { checked: false } : {}) });

  const fixOk = HW_MISTAKES.map((m, i) => m.accept.some((a) => normalise(a) === normalise(s.fix[i])));
  const fixScore = fixOk.filter(Boolean).length;
  const character = HW_CHARACTERS.find((c) => c.id === s.who) ?? HW_CHARACTERS[0];
  const sentences = countSentences(s.report);

  const done =
    [...s.a, ...s.b, ...s.q, ...s.r, ...s.fix].filter((v) => v.trim()).length + (sentences >= 6 ? 1 : 0);
  const total = 4 + 4 + 6 + 6 + 7 + 1;

  const exportText = () =>
    [
      `THE REVIEW VAULT — HOMEWORK${name ? ` · Detective ${name}` : ""}`,
      "",
      "1. My day",
      ...s.a.map((v, i) => `  ${i + 1}. ${v}`),
      ...s.b.map((v, i) => `  ${i + 5}. ${HW_HOW_OFTEN_QUESTIONS[i]} — ${v}`),
      "",
      "2. Questions for my friend",
      ...s.q.map((v, i) => `  ${i + 1}. ${v} — ${s.r[i]}`),
      "",
      "3. Corrected sentences",
      ...s.fix.map((v, i) => `  ${i + 1}. ${v}`),
      "",
      `4. Mini-report: ${character.name}`,
      `  ${s.report}`,
    ].join("\n");

  const copy = async () => {
    const ok = await copyText(exportText());
    setCopied(ok ? "ok" : "fail");
    window.setTimeout(() => setCopied("idle"), 2500);
  };

  return (
    <main id="main" className="mx-auto w-full max-w-4xl px-4 pt-8 pb-24 sm:px-6 lg:pt-12">
      <header className="animate-rise mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Tag>Homework file · After the case</Tag>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.95] font-semibold tracking-tight text-paper-50">
            The Home <span className="gold-text italic">File</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-paper-100/90">
            Four new missions to do at home. Your answers are saved on this device — copy them and send them to your teacher.
          </p>
          <p lang="ru" className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-paper-300/80">
            Четыре новых задания для дома. Ответы сохраняются на этом устройстве — скопируй их и отправь учителю.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="rounded-full border border-paper-300/15 px-4 py-2.5 font-digit text-sm text-paper-200/90" role="status">
            {done}/{total} done
          </div>
          <Button variant="ghost" onClick={() => onOpenRules(0)}>
            <BookIcon className="size-4" />
            Rule cards
          </Button>
        </div>
      </header>

      <div className="space-y-6">
        {/* 1 */}
        <TaskCard no={1} title="My day in 8 sentences" count="4 + 4" ru="Напиши 8 предложений о своём дне: 4 с наречиями частоты (дела по дому и свободное время) и 4 полных ответа на вопросы How often…?">
          <h3 className="font-type text-xs tracking-[0.22em] text-brass-400 uppercase">A · Adverbs of frequency</h3>
          <ol className="mt-3 space-y-2.5">
            {HW_FREQ_PROMPTS.map((p, i) => (
              <Row key={p} n={i + 1}>
                <label htmlFor={`a${i}`} className="sr-only">
                  Sentence {i + 1}: {p}
                </label>
                <input id={`a${i}`} value={s.a[i]} onChange={(e) => setAt("a", i, e.target.value)} placeholder={`Use: ${p}`} className={inputCls} />
              </Row>
            ))}
          </ol>
          <h3 className="mt-7 font-type text-xs tracking-[0.22em] text-brass-400 uppercase">B · Answer in full sentences</h3>
          <ol className="mt-3 space-y-3">
            {HW_HOW_OFTEN_QUESTIONS.map((q, i) => (
              <Row key={q} n={i + 5}>
                <label htmlFor={`b${i}`} className="mb-1.5 block pt-3 text-[16px] font-bold text-paper-100">
                  {q}
                </label>
                <input id={`b${i}`} value={s.b[i]} onChange={(e) => setAt("b", i, e.target.value)} placeholder="I … once / twice / three times a …" className={inputCls} />
              </Row>
            ))}
          </ol>
        </TaskCard>

        {/* 2 */}
        <TaskCard no={2} title="Interview a friend" count="6 Q + A" ru="Составь 6 вопросов How often…? для друга и напиши возможные ответы. Идеи — в подсказках ниже.">
          <div className="flex flex-wrap gap-2" aria-label="Ideas">
            {HW_FRIEND_IDEAS.map((idea) => (
              <span key={idea} className="rounded-full bg-paper-300/10 px-3 py-1.5 text-sm font-bold text-paper-200/90">
                {idea}
              </span>
            ))}
          </div>
          <ol className="mt-5 space-y-3">
            {s.q.map((_, i) => (
              <Row key={i} n={i + 1}>
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <label htmlFor={`q${i}`} className="sr-only">
                      Question {i + 1}
                    </label>
                    <input id={`q${i}`} value={s.q[i]} onChange={(e) => setAt("q", i, e.target.value)} placeholder="How often do you …?" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor={`r${i}`} className="sr-only">
                      Possible answer {i + 1}
                    </label>
                    <input id={`r${i}`} value={s.r[i]} onChange={(e) => setAt("r", i, e.target.value)} placeholder="Possible answer: I …" className={inputCls} />
                  </div>
                </div>
              </Row>
            ))}
          </ol>
        </TaskCard>

        {/* 3 */}
        <TaskCard no={3} title="Catch the mistakes" count="7 fixes" ru="В каждом предложении одна ошибка (present simple / continuous или наречие частоты). Напиши предложение правильно.">
          <ol className="space-y-3">
            {HW_MISTAKES.map((m, i) => {
              const show = s.checked && s.fix[i].trim() !== "";
              return (
                <Row key={m.wrong} n={i + 1}>
                  <label htmlFor={`fix${i}`} className="mb-1.5 block pt-3 text-[17px] font-bold text-bad/90 line-through decoration-bad/50 decoration-2">
                    {m.wrong}
                  </label>
                  <div className="relative">
                    <input
                      id={`fix${i}`}
                      value={s.fix[i]}
                      onChange={(e) => setAt("fix", i, e.target.value)}
                      placeholder="Write the correct sentence"
                      spellCheck={false}
                      className={cn(inputCls, "pr-12", show && (fixOk[i] ? "border-ok/60 bg-ok/10" : "border-bad/60 bg-bad/10"))}
                    />
                    {show && (
                      <span className={cn("animate-pop absolute top-1/2 right-3 grid size-6 -translate-y-1/2 place-items-center rounded-full text-ink-950", fixOk[i] ? "bg-ok" : "bg-bad")}>
                        {fixOk[i] ? <CheckIcon className="size-3.5" /> : <CloseIcon className="size-3.5" />}
                        <span className="sr-only">{fixOk[i] ? "Correct" : "Try again"}</span>
                      </span>
                    )}
                  </div>
                </Row>
              );
            })}
          </ol>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Button variant="neon" onClick={() => setS({ ...s, checked: true })} disabled={!s.fix.some((v) => v.trim())}>
              Check my fixes
            </Button>
            {s.checked && (
              <p className="font-bold text-paper-100" role="status">
                {fixScore} / 7 correct{fixScore === 7 ? " — brilliant!" : ""}
              </p>
            )}
          </div>
          <details className="group mt-5 rounded-2xl border border-paper-300/10 bg-ink-900/40">
            <summary className="cursor-pointer list-none rounded-2xl px-4 py-3 text-sm font-bold text-paper-300/80 transition hover:text-brass-200">
              <span className="mr-2 inline-block transition-transform group-open:rotate-90">›</span>
              Answer key (for the teacher)
            </summary>
            <ol className="list-decimal space-y-1 px-4 pb-4 pl-10 text-[15px] text-paper-100/90">
              {HW_MISTAKES.map((m) => (
                <li key={m.wrong}>{m.accept[0].replace(/^Look /, "Look! ")}{/\?$/.test(m.wrong) ? "?" : "."}</li>
              ))}
            </ol>
          </details>
        </TaskCard>

        {/* 4 */}
        <TaskCard no={4} title="A day in the life" count="6–7 sentences" ru="Выбери героя и напиши мини-отчёт о его дне: предметы, good at / not good at, дела по дому и как часто. Используй факты из досье.">
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Choose a character">
            {HW_CHARACTERS.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={s.who === c.id}
                onClick={() => setS({ ...s, who: c.id })}
                className={cn(
                  "h-11 rounded-full border px-5 text-[15px] font-extrabold transition duration-200 hover:-translate-y-0.5",
                  s.who === c.id ? "border-brass-300 bg-brass-400 text-ink-950" : "border-paper-300/20 text-paper-100 hover:border-brass-300/70 hover:bg-brass-400/10",
                )}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
            <div key={character.id} className="paper animate-rise relative self-start rounded-2xl p-5">
              <p className="font-type text-xs tracking-[0.22em] text-sepia/70 uppercase">Fact file</p>
              <h3 className="mt-1 font-display text-2xl font-semibold">{character.name}</h3>
              <dl className="mt-3 space-y-2.5">
                {character.facts.map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-type text-[11px] tracking-[0.18em] text-sepia/60 uppercase">{k}</dt>
                    <dd className="text-[15px] leading-snug font-bold">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="hw-report" className="font-bold text-paper-100">
                  My mini-report about {character.name}
                </label>
                <span className={cn("rounded-full border px-3 py-1 font-digit text-sm", sentences >= 6 ? "border-ok/40 text-ok" : "border-paper-300/20 text-paper-300/80")} role="status">
                  {sentences} / 6–7
                </span>
              </div>
              <textarea
                id="hw-report"
                value={s.report}
                onChange={(e) => setS({ ...s, report: e.target.value })}
                rows={9}
                spellCheck={false}
                placeholder={`${character.name === "The Bell family" ? "The Bell family are" : `${character.name} is`} … `}
                className="mt-3 block min-h-[16rem] w-full resize-y rounded-2xl border border-paper-300/15 bg-ink-900/70 px-4 py-3 text-[17px] leading-relaxed text-paper-50 placeholder:text-paper-300/40 transition hover:border-paper-300/30 focus:border-neon-400/70 focus:ring-2 focus:ring-neon-400/25 focus:outline-none"
              />
            </div>
          </div>
        </TaskCard>

        <Reveal>
          <div className="flex flex-col items-start gap-4 rounded-3xl border border-brass-400/25 bg-brass-400/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="font-display text-2xl font-semibold text-paper-50">Finished? Send it to your teacher.</p>
              <p lang="ru" className="mt-1 text-[15px] text-paper-300/80">
                Кнопка скопирует все ответы — вставь их в сообщение учителю.
              </p>
            </div>
            <Button size="lg" onClick={copy}>
              {copied === "ok" ? <CheckIcon className="size-5" /> : <CopyIcon className="size-5" />}
              <span role="status">{copied === "ok" ? "Copied!" : copied === "fail" ? "Select & copy manually" : "Copy my homework"}</span>
            </Button>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
