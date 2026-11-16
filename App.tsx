import { useCallback, useEffect, useState } from "react";
import hero from "./assets/vault-detective.jpg";
import { type Clock, Header } from "./components/Header";
import { RewardModal } from "./components/RewardModal";
import { RulesDrawer } from "./components/RulesDrawer";
import { ROOMS, type SceneId } from "./data/lesson";
import { clearAllProgress, usePersistentState } from "./hooks/usePersistentState";
import { Escaped } from "./scenes/Escaped";
import { FinalCode } from "./scenes/FinalCode";
import { FrequencyFile } from "./scenes/FrequencyFile";
import { Homework } from "./scenes/Homework";
import { HowOftenRoom } from "./scenes/HowOftenRoom";
import { Intro } from "./scenes/Intro";
import { PresentMix } from "./scenes/PresentMix";
import { SubjectLock } from "./scenes/SubjectLock";

const TASK_SCENES: SceneId[] = ["t1", "t2", "t3", "t4"];
const RULE_FOR_SCENE: Partial<Record<SceneId, number>> = { t1: 0, t2: 1, t3: 2, t4: 3 };

function Lesson({ onReset }: { onReset: () => void }) {
  const [scene, setScene] = usePersistentState<SceneId>("scene", "intro");
  const [solved, setSolved] = usePersistentState<boolean[]>("solved", [false, false, false, false]);
  const [name, setName] = usePersistentState("name", "");
  const [teacher, setTeacher] = usePersistentState("teacher", false);
  const [escaped, setEscaped] = usePersistentState("escaped", false);
  const [clock, setClock] = usePersistentState<Clock>("clock", { start: null, end: null });

  const [rules, setRules] = useState({ open: false, tab: 0 });
  const [reward, setReward] = useState<number | null>(null);

  const canOpen = useCallback(
    (id: SceneId) => {
      switch (id) {
        case "intro":
        case "homework":
        case "t1":
          return true;
        case "t2":
          return teacher || solved[0];
        case "t3":
          return teacher || solved[1];
        case "t4":
          return teacher || solved[2];
        case "final":
          return teacher || solved[3];
        case "escaped":
          return escaped;
        default:
          return false;
      }
    },
    [teacher, solved, escaped],
  );

  const go = useCallback(
    (id: SceneId) => {
      if (!canOpen(id)) return;
      if (id !== "intro" && id !== "homework") {
        setClock((c) => (c.start == null ? { start: Date.now(), end: null } : c));
      }
      setScene(id);
    },
    [canOpen, setClock, setScene],
  );

  // Every new scene starts at the top of the page.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [scene]);

  // The tab title follows the case.
  useEffect(() => {
    const room = ROOMS.find((r) => r.id === scene);
    const label = room ? `Room ${room.no}: ${room.title}` : scene === "escaped" ? "You escaped!" : scene === "homework" ? "Homework file" : "Escape the Mixed Files";
    document.title = `${label} · The Review Vault`;
  }, [scene]);

  const start = () => {
    if (escaped) return go("escaped");
    const firstOpen = solved.findIndex((x) => !x);
    go(firstOpen === -1 ? "final" : TASK_SCENES[firstOpen]);
  };

  const openRules = useCallback((tab?: number) => {
    setRules((r) => ({ open: true, tab: tab ?? r.tab }));
  }, []);
  const closeRules = useCallback(() => setRules((r) => ({ ...r, open: false })), []);
  const closeReward = useCallback(() => setReward(null), []);

  const markSolved = (i: number) => {
    if (solved[i]) return;
    setSolved((prev) => prev.map((v, k) => (k === i ? true : v)));
    setReward(i);
  };

  const escape = () => {
    setEscaped(true);
    setClock((c) => ({ start: c.start ?? Date.now(), end: c.end ?? Date.now() }));
    setScene("escaped");
  };

  const roomProps = (i: number) => ({
    solved: solved[i],
    onSolved: () => markSolved(i),
    onOpenRules: openRules,
    onNext: () => go(ROOMS[i + 1].id),
  });

  return (
    <div className="relative isolate flex min-h-svh flex-col">
      <div className="vault-backdrop" aria-hidden="true">
        <img src={hero} alt="" />
      </div>

      <Header
        scene={scene}
        solved={solved}
        escaped={escaped}
        teacher={teacher}
        clock={clock}
        canOpen={canOpen}
        onGo={go}
        onRules={() => openRules(RULE_FOR_SCENE[scene])}
        onToggleTeacher={() => setTeacher((t) => !t)}
        onReset={onReset}
      />

      <div className="flex-1">
        {scene === "intro" && <Intro name={name} onName={setName} started={clock.start != null} solved={solved} onStart={start} onOpenRules={openRules} />}
        {scene === "t1" && <SubjectLock {...roomProps(0)} />}
        {scene === "t2" && <FrequencyFile {...roomProps(1)} />}
        {scene === "t3" && <HowOftenRoom {...roomProps(2)} />}
        {scene === "t4" && <PresentMix {...roomProps(3)} />}
        {scene === "final" && <FinalCode name={name} onEscape={escape} onOpenRules={openRules} />}
        {scene === "escaped" && <Escaped name={name} clock={clock} onHomework={() => go("homework")} onReset={onReset} />}
        {scene === "homework" && <Homework name={name} onOpenRules={openRules} />}
      </div>

      <footer className="border-t border-brass-400/10 bg-ink-950/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-paper-300/70 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            <span className="font-display text-base font-semibold text-paper-100">The Review Vault</span> — Escape the Mixed Files
          </p>
          <p className="font-type text-[11px] tracking-[0.2em] uppercase">Academy Stars 3 · Review 1 · Units 1–2</p>
        </div>
      </footer>

      <RulesDrawer open={rules.open} tab={rules.tab} onTab={(tab) => setRules({ open: true, tab })} onClose={closeRules} />

      <RewardModal
        index={reward}
        solved={solved}
        onClose={closeReward}
        onNext={() => {
          const i = reward;
          setReward(null);
          if (i != null) go(ROOMS[i + 1].id);
        }}
      />
    </div>
  );
}

export default function App() {
  const [epoch, setEpoch] = useState(0);
  return (
    <Lesson
      key={epoch}
      onReset={() => {
        clearAllProgress();
        setEpoch((e) => e + 1);
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }}
    />
  );
}
