import { type ReactNode, useEffect, useRef } from "react";
import { SUBJECTS } from "../data/lesson";
import { cn } from "../utils/cn";
import { ArrowLeftIcon, CloseIcon } from "./Icons";
import { Button } from "./ui";

const TABS = [
  { short: "Good at", title: "School subjects + good at / not good at" },
  { short: "Frequency", title: "Adverbs of frequency" },
  { short: "How often", title: "How often…? + once / twice / three times" },
  { short: "Now / usually", title: "Present simple vs present continuous" },
];

function Example({ children, mark }: { children: ReactNode; mark?: "+" | "–" | "?" }) {
  return (
    <li className="flex items-baseline gap-3">
      {mark && (
        <span className="grid size-6 shrink-0 translate-y-0.5 place-items-center rounded-full bg-sepia/10 font-digit text-sm text-sepia">{mark}</span>
      )}
      <span className="text-[17px] leading-snug">{children}</span>
    </li>
  );
}

function Hl({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "blue" }) {
  return (
    <strong
      className={cn(
        "rounded-md px-1.5 py-0.5 font-extrabold",
        tone === "gold" ? "bg-brass-400/45 text-sepia" : "bg-neon-500/20 text-[#0b5c86]",
      )}
    >
      {children}
    </strong>
  );
}

function Formula({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border-2 border-dashed border-sepia/25 bg-white/40 px-4 py-3 font-type text-[15px] leading-relaxed text-sepia">
      {children}
    </p>
  );
}

function Ru({ children }: { children: ReactNode }) {
  return (
    <p lang="ru" className="rounded-xl bg-sepia/[0.070] px-4 py-3 text-[15px] leading-relaxed text-sepia/90">
      <span className="mr-2 font-extrabold">По-русски:</span>
      {children}
    </p>
  );
}

function H({ children }: { children: ReactNode }) {
  return <h4 className="font-type text-xs tracking-[0.22em] text-sepia/70 uppercase">{children}</h4>;
}

function CardOne() {
  return (
    <>
      <div>
        <H>School subjects</H>
        <ul className="mt-3 flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
            <li key={s.id} className="rounded-full bg-white/60 px-3 py-1.5 text-[15px] font-bold shadow-[inset_0_0_0_1px_rgba(59,41,22,.12)]">
              <span aria-hidden="true">{s.icon}</span> {s.label}
            </li>
          ))}
        </ul>
      </div>
      <Formula>am / is / are + (not) good at + subject</Formula>
      <ul className="space-y-2.5">
        <Example mark="+">
          I<Hl>'m good at</Hl> maths. · She<Hl>'s good at</Hl> music.
        </Example>
        <Example mark="–">
          I<Hl>'m not good at</Hl> art. · He <Hl>isn't good at</Hl> PE.
        </Example>
        <Example mark="?">
          <Hl>Are</Hl> you <Hl>good at</Hl> science? — Yes, I am. / No, I'm not.
        </Example>
      </ul>
      <Ru>
        «good at» — «хорошо получается». После <b>at</b> сразу называем предмет: good at maths. Не забывай am / is / are!
      </Ru>
    </>
  );
}

const SCALE = [
  { word: "always", pct: 100, ru: "всегда" },
  { word: "usually", pct: 80, ru: "обычно" },
  { word: "sometimes", pct: 50, ru: "иногда" },
  { word: "hardly ever", pct: 10, ru: "почти никогда" },
  { word: "never", pct: 0, ru: "никогда" },
];

function CardTwo() {
  return (
    <>
      <div>
        <H>Meaning</H>
        <ul className="mt-3 space-y-2">
          {SCALE.map((s) => (
            <li key={s.word} className="grid grid-cols-[6.500rem_1fr_auto] items-center gap-3">
              <span className="text-[17px] font-extrabold">{s.word}</span>
              <span className="h-3 overflow-hidden rounded-full bg-sepia/10">
                <span className="block h-full rounded-full bg-gradient-to-r from-brass-600 to-brass-400" style={{ width: `${Math.max(s.pct, 2)}%` }} />
              </span>
              <span className="w-24 text-right text-sm text-sepia/75">
                <span className="font-digit">{s.pct}%</span> · <span lang="ru">{s.ru}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <H>Position</H>
        <ul className="mt-3 space-y-2.5">
          <Example mark="+">
            <b>Before</b> the main verb: I <Hl>always</Hl> make my bed. · She <Hl>never</Hl> plays computer games.
          </Example>
          <Example mark="+">
            <b>After</b> am / is / are: He is <Hl tone="blue">usually</Hl> late. · My room is <Hl tone="blue">always</Hl> tidy.
          </Example>
        </ul>
      </div>
      <Ru>
        Наречие стоит <b>перед</b> обычным глаголом, но <b>после</b> am / is / are. С never и hardly ever «not» не нужен: I never watch TV.
      </Ru>
    </>
  );
}

function CardThree() {
  return (
    <>
      <Formula>How often + do / does + person + verb …?</Formula>
      <ul className="space-y-2.5">
        <Example mark="?">
          How often <Hl>do</Hl> you tidy your room? — <Hl tone="blue">Once a week.</Hl>
        </Example>
        <Example mark="?">
          How often <Hl>does</Hl> she brush her teeth? — <Hl tone="blue">Twice a day.</Hl>
        </Example>
      </ul>
      <div>
        <H>Answers</H>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <ul className="space-y-1.5 rounded-xl bg-white/50 p-3 text-[17px]">
            <li>
              <b>once</b> <span className="font-digit text-sm text-sepia/70">= 1×</span>
            </li>
            <li>
              <b>twice</b> <span className="font-digit text-sm text-sepia/70">= 2×</span>
            </li>
            <li>
              <b>three times</b> <span className="font-digit text-sm text-sepia/70">= 3×</span>
            </li>
          </ul>
          <span className="text-center font-display text-3xl text-sepia/50">+</span>
          <ul className="space-y-1.5 rounded-xl bg-white/50 p-3 text-[17px]">
            <li>
              <b>a day</b>
            </li>
            <li>
              <b>a week</b>
            </li>
            <li>
              <b>a month</b> · <b>a year</b>
            </li>
          </ul>
        </div>
        <p className="mt-3 text-[15px] text-sepia/80">
          Also: <b>every day</b>, <b>every Monday</b>, <b>at the weekend</b>.
        </p>
      </div>
      <Ru>
        How often…? — «Как часто…?» С he / she / it — <b>does</b>, глагол без -s: does she <u>brush</u>. Говорим <b>twice</b>, а не «two times».
      </Ru>
    </>
  );
}

function CardFour() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl bg-white/50 p-4 shadow-[inset_0_0_0_1px_rgba(59,41,22,.1)]">
          <p className="inline-block -rotate-2 rounded border-2 border-brass-600 px-2 py-0.5 font-type text-xs tracking-[0.2em] text-brass-600 uppercase">Usually</p>
          <h4 className="mt-2 font-display text-xl font-semibold">Present simple</h4>
          <p className="mt-1 text-[15px] text-sepia/80">Habits and routines.</p>
          <p className="mt-3 font-type text-sm">I play · she play<b>s</b></p>
          <ul className="mt-3 space-y-1.5 text-[16px]">
            <li>
              Lucy <Hl>walks</Hl> to school every day.
            </li>
            <li>
              We <Hl>have</Hl> PE on Mondays.
            </li>
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-sepia/75">
            <b>Signal words:</b> always, usually, never, every day, on Mondays, once a week
          </p>
        </section>
        <section className="rounded-2xl bg-white/50 p-4 shadow-[inset_0_0_0_1px_rgba(59,41,22,.1)]">
          <p className="inline-block rotate-2 rounded border-2 border-[#0b76ad] px-2 py-0.5 font-type text-xs tracking-[0.2em] text-[#0b76ad] uppercase">Now</p>
          <h4 className="mt-2 font-display text-xl font-semibold">Present continuous</h4>
          <p className="mt-1 text-[15px] text-sepia/80">Happening at this moment.</p>
          <p className="mt-3 font-type text-sm">
            am / is / are + verb<b>-ing</b>
          </p>
          <ul className="mt-3 space-y-1.5 text-[16px]">
            <li>
              Look! Sam <Hl tone="blue">is doing</Hl> his homework.
            </li>
            <li>
              We <Hl tone="blue">are having</Hl> PE now.
            </li>
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-sepia/75">
            <b>Signal words:</b> now, right now, at the moment, Look! Listen! Shh!
          </p>
        </section>
      </div>
      <Ru>
        Сначала найди слово-сигнал. Обычно / всегда / каждый день → <b>present simple</b>. Сейчас / Look! / Listen! → <b>am / is / are + -ing</b>.
      </Ru>
    </>
  );
}

const CARDS = [CardOne, CardTwo, CardThree, CardFour];

type Props = {
  open: boolean;
  tab: number;
  onTab: (tab: number) => void;
  onClose: () => void;
};

export function RulesDrawer({ open, tab, onTab, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>("button, a[href], [tabindex]:not([tabindex='-1'])");
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  const Card = CARDS[tab] ?? CardOne;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" tabIndex={-1} aria-label="Close rule cards" onClick={onClose} className="animate-fade absolute inset-0 cursor-default bg-ink-950/75 backdrop-blur-sm" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rules-title"
        className="animate-sheet relative flex h-full w-full max-w-2xl flex-col border-l border-brass-400/20 bg-ink-800 shadow-[-40px_0_80px_-20px_rgba(0,0,0,.8)]"
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-7">
          <div>
            <p className="font-type text-[11px] tracking-[0.28em] text-brass-400 uppercase">Detective's pocket book</p>
            <h2 id="rules-title" className="mt-1.5 font-display text-3xl font-semibold text-paper-50 sm:text-4xl">
              Rule cards
            </h2>
            <p lang="ru" className="mt-1 text-sm text-paper-300/80">
              Твоё задание сохранено — загляни в карточку и возвращайся.
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close rule cards and go back to the task"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-paper-300/20 text-paper-100 transition hover:rotate-90 hover:border-brass-300/70 hover:bg-brass-400/10 hover:text-brass-200"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <div role="tablist" aria-label="Rule cards" className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:px-8">
          {TABS.map((t, i) => (
            <button
              key={t.short}
              type="button"
              role="tab"
              id={`rule-tab-${i}`}
              aria-selected={tab === i}
              aria-controls="rule-panel"
              onClick={() => onTab(i)}
              className={cn(
                "flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-extrabold whitespace-nowrap transition duration-200",
                tab === i
                  ? "border-brass-300 bg-brass-400 text-ink-950 shadow-[0_8px_24px_-10px_rgba(242,184,75,.9)]"
                  : "border-paper-300/15 text-paper-200/85 hover:border-brass-300/60 hover:bg-brass-400/10 hover:text-brass-200",
              )}
            >
              <span className={cn("font-digit text-xs", tab === i ? "text-ink-950/70" : "text-brass-400")}>{i + 1}</span>
              {t.short}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-6 sm:px-8">
          <article
            key={tab}
            id="rule-panel"
            role="tabpanel"
            aria-labelledby={`rule-tab-${tab}`}
            className="paper-plain animate-rise relative rounded-2xl p-5 sm:p-7"
          >
            <p className="font-type text-xs tracking-[0.22em] text-sepia/60 uppercase">Card {tab + 1} of 4</p>
            <h3 className="mt-1.5 font-display text-2xl leading-tight font-semibold sm:text-[1.750rem]">{TABS[tab].title}</h3>
            <div className="mt-5 space-y-5">
              <Card />
            </div>
          </article>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-brass-400/15 bg-ink-900/70 px-5 py-4 sm:px-8">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onTab((tab + 3) % 4)} aria-label="Previous card">
              <ArrowLeftIcon className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onTab((tab + 1) % 4)}>
              Next card
            </Button>
          </div>
          <Button onClick={onClose}>
            <ArrowLeftIcon className="size-4" />
            Back to my task
          </Button>
        </div>
      </div>
    </div>
  );
}
