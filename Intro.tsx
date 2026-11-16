import hero from "../assets/vault-detective.jpg";
import { ArrowRightIcon, BookIcon, CheckIcon, KeyIcon, LockIcon, SearchIcon, UnlockIcon } from "../components/Icons";
import { Button, CodeSlots, Reveal, Tag } from "../components/ui";
import { LESSON_MINUTES, ROOMS } from "../data/lesson";
import { cn } from "../utils/cn";

type Props = {
  name: string;
  onName: (name: string) => void;
  started: boolean;
  solved: boolean[];
  onStart: () => void;
  onOpenRules: (tab: number) => void;
};

const PLAN = [
  { label: "Briefing", minutes: 3 },
  ...ROOMS.map((r) => ({ label: r.title, minutes: r.minutes })),
  { label: "Debrief", minutes: 2 },
];

const STEPS = [
  { icon: SearchIcon, title: "Collect the clues", text: "Every room hides a mixed-up file from Unit 1 or Unit 2. Read, think and put it in order.", ru: "Собери улики" },
  { icon: LockIcon, title: "Get a code digit", text: "Each solved room opens one glowing lock and gives you one digit of the secret code.", ru: "Получи цифру кода" },
  { icon: KeyIcon, title: "Open the door", text: "Enter all four digits, write your detective report — and escape the Review Vault!", ru: "Открой дверь" },
];

function Dust() {
  const bits = Array.from({ length: 16 }, (_, i) => ({
    left: (i * 61 + 11) % 100,
    top: 30 + ((i * 37) % 60),
    delay: (i * 0.7) % 8,
    dur: 6 + (i % 5),
    dx: `${((i % 5) - 2) * 18}px`,
  }));
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {bits.map((b, i) => (
        <span key={i} className="dust" style={{ left: `${b.left}%`, top: `${b.top}%`, ["--delay" as string]: `${b.delay}s`, ["--dur" as string]: `${b.dur}s`, ["--dx" as string]: b.dx }} />
      ))}
    </div>
  );
}

export function Intro({ name, onName, started, solved, onStart, onOpenRules }: Props) {
  const startLabel = started ? "Continue the case" : "Start the case";

  return (
    <main id="main">
      {/* ───────────── Hero ───────────── */}
      <section className="relative -mt-[65px] overflow-hidden bg-ink-950 lg:flex lg:min-h-[max(100svh,44rem)] lg:items-end" aria-labelledby="hero-title">
        <div className="absolute inset-x-0 top-0 h-[74svh] min-h-[30rem] lg:h-full">
          <img
            src={hero}
            alt="A young detective in a tweed deerstalker hat stands in an old archive. Papers, golden keys and glowing blue padlocks float around him beside a huge round vault door."
            className="hero-zoom size-full object-cover object-[31%_50%] lg:object-[50%_65%]"
            fetchPriority="high"
          />
          {/* legibility gradients */}
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,#0d0805_0%,rgba(13,8,5,.92)_30%,rgba(13,8,5,.4)_46%,rgba(13,8,5,0)_62%)] lg:hidden" />
          <div aria-hidden="true" className="absolute inset-0 hidden bg-[linear-gradient(to_top,#0d0805_0%,rgba(13,8,5,.9)_25%,rgba(13,8,5,.55)_45%,rgba(13,8,5,0)_68%)] lg:block" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink-950/80 to-transparent" />
          <div aria-hidden="true" className="absolute inset-0 hidden bg-[radial-gradient(80%_70%_at_0%_100%,rgba(13,8,5,.85),transparent_70%)] lg:block" />
          <Dust />
        </div>

        <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 pt-[max(46svh,17rem)] pb-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12 lg:px-8 lg:pt-48 lg:pb-16">
          <div className="min-w-0">
            <Tag className="animate-rise [text-shadow:0_1px_8px_rgba(0,0,0,.9)]">Academy Stars 3 · Review 1 · Units 1–2</Tag>
            <h1
              id="hero-title"
              className="animate-rise mt-3 font-display text-[clamp(3rem,9.5vw,6.5rem)] leading-[0.9] font-semibold tracking-tight text-paper-50 [animation-delay:.1s] [text-shadow:0_4px_30px_rgba(0,0,0,.75)] lg:text-[clamp(3.75rem,6.2vw,5.25rem)] lg:whitespace-nowrap"
            >
              The Review <span className="gold-text pr-1 italic">Vault</span>
            </h1>
            <p className="animate-rise mt-3 font-type text-base tracking-[0.18em] text-neon-300 uppercase [animation-delay:.2s] sm:text-xl">
              <span className="neon-text">Escape the Mixed Files</span>
            </p>
            <p className="animate-rise mt-4 max-w-2xl text-lg leading-relaxed text-paper-100 [animation-delay:.3s] [text-shadow:0_1px_12px_rgba(0,0,0,.8)] sm:text-xl">
              Detective, the files are all mixed up — and the vault door is locked! Solve four rooms, collect four digits and crack the code to
              escape.
            </p>

            <form
              className="animate-rise mt-6 flex flex-col gap-3 [animation-delay:.4s] sm:flex-row sm:items-center"
              onSubmit={(e) => {
                e.preventDefault();
                onStart();
              }}
            >
              <div className="relative sm:w-64">
                <label htmlFor="detective" className="sr-only">
                  Detective's name
                </label>
                <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-brass-400" />
                <input
                  id="detective"
                  value={name}
                  onChange={(e) => onName(e.target.value.slice(0, 20))}
                  placeholder="Detective's name"
                  autoComplete="off"
                  className="h-14 w-full rounded-full border border-brass-400/30 bg-ink-950/70 pr-5 pl-12 text-lg font-bold text-paper-50 backdrop-blur-md transition placeholder:font-semibold placeholder:text-paper-300/50 hover:border-brass-400/60 focus:border-neon-400/80 focus:ring-2 focus:ring-neon-400/30 focus:outline-none"
                />
              </div>
              <Button type="submit" size="lg" className="group">
                {startLabel}
                <ArrowRightIcon className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </form>
          </div>

          {/* Case card */}
          <aside className="animate-rise w-full rounded-3xl border border-brass-400/20 bg-ink-950/65 p-5 backdrop-blur-md [animation-delay:.55s] lg:w-72" aria-label="Case facts">
            <div className="flex items-center justify-between gap-3">
              <p className="font-type text-[11px] tracking-[0.24em] text-paper-300/80 uppercase">Vault code</p>
              <CodeSlots solved={solved} size="sm" />
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { big: LESSON_MINUTES, small: "minutes" },
                { big: 4, small: "locks" },
                { big: 1, small: "secret code" },
              ].map((f) => (
                <div key={f.small} className="rounded-2xl bg-paper-300/[0.07] px-1 py-3">
                  <dd className="font-digit text-3xl leading-none text-brass-300">{f.big}</dd>
                  <dt className="mt-1.5 text-xs text-paper-300/85">{f.small}</dt>
                </div>
              ))}
            </dl>
            <p lang="ru" className="mt-4 text-sm leading-relaxed text-paper-200/85">
              Ты — детектив. Реши 4 комнаты, собери 4 цифры кода и открой дверь хранилища.
            </p>
          </aside>
        </div>
      </section>

      {/* ───────────── How it works ───────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="how-title">
        <Reveal>
          <Tag>The detective logic</Tag>
          <h2 id="how-title" className="mt-3 max-w-3xl font-display text-4xl leading-[1.05] font-semibold tracking-tight text-paper-50 sm:text-5xl">
            Collect clues. Get the code. <span className="gold-text italic">Open the door.</span>
          </h2>
        </Reveal>

        <ol className="relative mt-10 grid gap-5 md:grid-cols-3 lg:mt-14">
          <span aria-hidden="true" className="absolute top-10 right-[16%] left-[16%] hidden border-t-2 border-dashed border-brass-400/25 md:block" />
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 120} className="h-full">
                <div className="group relative h-full rounded-3xl border border-brass-400/15 bg-ink-800/70 p-6 transition duration-300 hover:-translate-y-1.5 hover:border-brass-300/50 hover:bg-ink-700/80 hover:shadow-[0_30px_60px_-30px_rgba(242,184,75,.5)] sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="grid size-14 place-items-center rounded-2xl border border-brass-400/40 bg-ink-900 text-brass-300 transition duration-300 group-hover:rotate-[-8deg] group-hover:border-brass-300 group-hover:bg-brass-400 group-hover:text-ink-950">
                      <step.icon className="size-6" />
                    </span>
                    <span className="font-digit text-5xl text-paper-300/15 transition-colors duration-300 group-hover:text-brass-400/40">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-semibold text-paper-50">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-paper-200/85">{step.text}</p>
                  <p lang="ru" className="mt-3 text-sm text-paper-300/70">
                    {step.ru}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────────── Rooms ───────────── */}
      <section className="border-y border-brass-400/10 bg-ink-900/60" aria-labelledby="rooms-title">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <Tag>Case map</Tag>
              <h2 id="rooms-title" className="mt-3 font-display text-4xl leading-[1.05] font-semibold tracking-tight text-paper-50 sm:text-5xl">
                Five rooms, one code
              </h2>
            </div>
            <p className="max-w-md leading-relaxed text-paper-200/85">
              Every room is a different kind of puzzle. Stuck? Your <b className="text-brass-300">rule cards</b> are always one tap away — and your
              task waits for you.
            </p>
          </Reveal>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {ROOMS.map((room, i) => {
              const done = i < 4 && solved[i];
              return (
                <li key={room.id}>
                  <Reveal delay={(i % 3) * 100} className="h-full">
                    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-brass-400/15 bg-ink-800/80 p-6 transition duration-300 hover:-translate-y-1.5 hover:border-neon-400/50 hover:shadow-[0_30px_70px_-30px_rgba(79,203,255,.55)]">
                      <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-16 size-44 rounded-full bg-neon-400/0 blur-2xl transition duration-500 group-hover:bg-neon-400/20" />
                      <div className="relative flex items-start justify-between">
                        <span className="font-digit text-5xl leading-none text-brass-400/80">{room.no}</span>
                        <span
                          className={cn(
                            "grid size-11 place-items-center rounded-xl border transition duration-300",
                            done
                              ? "border-ok/50 bg-ok/10 text-ok"
                              : "border-neon-400/40 bg-neon-400/10 text-neon-300 shadow-[0_0_20px_-6px_rgba(79,203,255,.8)] group-hover:scale-110 group-hover:shadow-[0_0_26px_-2px_rgba(79,203,255,.9)]",
                          )}
                        >
                          {done ? <UnlockIcon className="size-5" /> : i < 4 ? <LockIcon className="size-5" /> : <KeyIcon className="size-5" />}
                        </span>
                      </div>
                      <h3 className="relative mt-5 font-display text-2xl font-semibold text-paper-50">{room.title}</h3>
                      <p className="relative mt-1 font-type text-[11px] tracking-[0.22em] text-paper-300/70 uppercase">{room.format}</p>
                      <p className="relative mt-3 flex-1 leading-relaxed text-paper-200/85">{room.blurb}</p>
                      <div className="relative mt-5 flex items-center justify-between border-t border-paper-300/10 pt-4 text-sm font-bold">
                        <span className="text-paper-300/80">≈ {room.minutes} min</span>
                        <span className={cn("inline-flex items-center gap-1.5", done ? "text-ok" : "text-neon-300")}>
                          {done && <CheckIcon className="size-4" />}
                          {i < 4 ? (done ? `Digit #${i + 1} found` : `Prize: digit #${i + 1}`) : "Prize: freedom!"}
                        </span>
                      </div>
                    </article>
                  </Reveal>
                </li>
              );
            })}

            {/* Rule cards */}
            <li>
              <Reveal delay={200} className="h-full">
                <article className="paper relative flex h-full flex-col rounded-3xl p-6 transition duration-300 hover:-translate-y-1.5 hover:rotate-[-1deg]">
                  <span className="tape" aria-hidden="true" />
                  <div className="flex items-start justify-between">
                    <span className="font-type text-xs tracking-[0.22em] text-sepia/70 uppercase">Pocket book</span>
                    <BookIcon className="size-7 text-brass-600" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-semibold">4 rule cards</h3>
                  <ul className="mt-3 flex-1 space-y-1.5 text-[15px] leading-snug font-bold">
                    {["good at / not good at", "always → never", "How often…? once, twice…", "now vs usually"].map((t, i) => (
                      <li key={t}>
                        <button type="button" onClick={() => onOpenRules(i)} className="group/link inline-flex items-center gap-2 rounded text-left underline-offset-4 hover:underline">
                          <span className="font-digit text-sm text-brass-600">{i + 1}</span>
                          {t}
                          <ArrowRightIcon className="size-3.5 opacity-0 transition group-hover/link:translate-x-0.5 group-hover/link:opacity-100" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p lang="ru" className="mt-4 border-t border-sepia/15 pt-4 text-sm leading-relaxed text-sepia/80">
                    Кнопка «Rules» всегда вверху экрана. Задание не потеряется.
                  </p>
                </article>
              </Reveal>
            </li>
          </ul>
        </div>
      </section>

      {/* ───────────── Lesson plan ───────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="plan-title">
        <Reveal>
          <Tag>For the teacher · 1-to-1 online lesson</Tag>
          <h2 id="plan-title" className="mt-3 font-display text-4xl leading-[1.05] font-semibold tracking-tight text-paper-50 sm:text-5xl">
            The 45-minute plan
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <ol className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:gap-1.5">
            {PLAN.map((p, i) => (
              <li
                key={p.label}
                style={{ flexGrow: p.minutes, flexBasis: 0 }}
                className={cn(
                  "group flex min-w-0 flex-col items-start gap-1 rounded-2xl border px-4 py-3.5 transition duration-300 hover:-translate-y-1 lg:min-w-[5.75rem] lg:px-3.5 lg:py-4",
                  i === 0 || i === PLAN.length - 1 ? "border-paper-300/15 bg-paper-300/[0.05]" : "border-brass-400/25 bg-brass-400/[0.07] hover:border-brass-300/60 hover:bg-brass-400/15",
                )}
              >
                <span className="w-full truncate text-[15px] font-extrabold text-paper-50">{p.label}</span>
                <span className="shrink-0 font-digit text-lg text-brass-300">{p.minutes}′</span>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={150}>
          <ul className="mt-8 grid gap-3 text-[15px] text-paper-200/90 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["No audio needed", "Всё читается и проговаривается вслух"],
              ["Progress is saved", "Обновление страницы ничего не сотрёт"],
              ["Teacher key in the ⋯ menu", "Открывает любую комнату без кода"],
              ["Homework file inside", "4 новых задания после урока"],
            ].map(([en, ru]) => (
              <li key={en} className="flex items-start gap-3 rounded-2xl border border-paper-300/10 bg-ink-800/60 p-4">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ok/15 text-ok">
                  <CheckIcon className="size-3" />
                </span>
                <span>
                  <b className="block text-paper-50">{en}</b>
                  <span lang="ru" className="text-sm text-paper-300/80">
                    {ru}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative mt-14 overflow-hidden rounded-[2rem] border border-brass-400/25 bg-gradient-to-br from-ink-700 to-ink-900 px-6 py-10 text-center sm:px-10 sm:py-14">
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[36rem] max-w-full -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(242,184,75,.3),transparent)]" />
            <KeyIcon className="animate-float relative mx-auto size-12 text-brass-300 drop-shadow-[0_0_18px_rgba(242,184,75,.8)]" style={{ ["--tilt" as string]: "-12deg" }} />
            <h2 className="relative mt-4 font-display text-4xl font-semibold tracking-tight text-paper-50 sm:text-5xl">
              Ready, detective{name ? ` ${name}` : ""}?
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-lg text-paper-200/85">The first lock is waiting. The clock starts when you enter Room 01.</p>
            <Button size="lg" onClick={onStart} className="group relative mt-7">
              {startLabel}
              <ArrowRightIcon className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
