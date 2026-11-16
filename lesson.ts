export const CODE = ["4", "7", "1", "9"] as const;
export const LESSON_MINUTES = 45;

export type SceneId = "intro" | "t1" | "t2" | "t3" | "t4" | "final" | "escaped" | "homework";

export type RoomProps = {
  solved: boolean;
  onSolved: () => void;
  onOpenRules: (tab: number) => void;
  onNext: () => void;
};

export const ROOMS: {
  id: SceneId;
  no: string;
  title: string;
  format: string;
  blurb: string;
  minutes: number;
  rule: number | null;
}[] = [
  {
    id: "t1",
    no: "01",
    title: "Subject Lock",
    format: "Guess the subject",
    blurb: "Read 7 clues. Name the school subject, then decide: good at or not good at?",
    minutes: 8,
    rule: 0,
  },
  {
    id: "t2",
    no: "02",
    title: "Frequency File",
    format: "Fill the gaps",
    blurb: "Study 7 week charts and put the right adverb of frequency into each sentence.",
    minutes: 8,
    rule: 1,
  },
  {
    id: "t3",
    no: "03",
    title: "How Often Room",
    format: "Build the question",
    blurb: "Use 6 timetable notes to build How often…? questions and choose the answers.",
    minutes: 9,
    rule: 2,
  },
  {
    id: "t4",
    no: "04",
    title: "Present Mix",
    format: "Choose the form",
    blurb: "8 snapshots from school and home. Is it happening now — or is it a routine?",
    minutes: 8,
    rule: 3,
  },
  {
    id: "final",
    no: "05",
    title: "Final Code",
    format: "Code + report",
    blurb: "Enter the 4-digit code and write your detective report to open the vault door.",
    minutes: 7,
    rule: null,
  },
];

/* ───────────────────────── Room 01 · Subject Lock ───────────────────────── */

export const SUBJECTS = [
  { id: "maths", label: "Maths", icon: "🔢" },
  { id: "english", label: "English", icon: "📖" },
  { id: "science", label: "Science", icon: "🔬" },
  { id: "art", label: "Art", icon: "🎨" },
  { id: "pe", label: "PE", icon: "⚽" },
  { id: "music", label: "Music", icon: "🎵" },
  { id: "history", label: "History", icon: "🏰" },
  { id: "geography", label: "Geography", icon: "🗺️" },
] as const;

export const SUBJECT_CLUES = [
  {
    who: "Lucy",
    clues: ["We count, add and take away.", "We use numbers and rulers."],
    report: "Test result: 10 / 10. Fantastic!",
    subject: "maths",
    good: true,
  },
  {
    who: "Sam",
    clues: ["We paint and draw pictures.", "We use brushes, paper and lots of colours."],
    report: "His picture is on the school wall. Beautiful!",
    subject: "art",
    good: true,
  },
  {
    who: "Sam",
    clues: ["We run, jump and play team games.", "We wear trainers and go to the gym."],
    report: "Always last in the race. Can't catch the ball.",
    subject: "pe",
    good: false,
  },
  {
    who: "Lucy",
    clues: ["We sing songs together.", "We play the piano and the drums."],
    report: "She sings in every school concert. Bravo!",
    subject: "music",
    good: true,
  },
  {
    who: "Sam",
    clues: ["We learn about plants and animals.", "We do experiments with water and light."],
    report: "Test result: 3 / 10. Please try again.",
    subject: "science",
    good: false,
  },
  {
    who: "Lucy",
    clues: ["We look at maps and globes.", "We learn about countries, rivers and mountains."],
    report: "She can't find London on the map.",
    subject: "geography",
    good: false,
  },
  {
    who: "Sam",
    clues: ["We learn about life long ago.", "We read about kings, queens and old castles."],
    report: "Test result: 9 / 10. He knows every date!",
    subject: "history",
    good: true,
  },
] as const;

/* ───────────────────────── Room 02 · Frequency File ─────────────────────── */

export const ADVERBS = ["always", "usually", "sometimes", "hardly ever", "never"] as const;

/** days = indexes (0 = Monday) on which the action happens this week */
export const FREQUENCY_ITEMS = [
  { before: "I", after: "make my bed.", days: [0, 1, 2, 3, 4, 5, 6], answer: "always" },
  { before: "She", after: "plays computer games.", days: [5], answer: "hardly ever" },
  { before: "Sam", after: "tidies his room.", days: [], answer: "never" },
  { before: "We", after: "watch TV after school.", days: [0, 1, 2, 3, 4], answer: "usually" },
  { before: "Dad", after: "cooks dinner.", days: [1, 3, 6], answer: "sometimes" },
  { before: "My bedroom is", after: "tidy.", days: [0, 1, 2, 3, 4, 5, 6], answer: "always" },
  { before: "Lucy", after: "takes out the rubbish.", days: [0, 1, 3, 4, 5], answer: "usually" },
] as const;

export const FREQUENCY_KEY = [
  { word: "always", days: 7 },
  { word: "usually", days: 5 },
  { word: "sometimes", days: 3 },
  { word: "hardly ever", days: 1 },
  { word: "never", days: 0 },
] as const;

/* ───────────────────────── Room 03 · How Often Room ─────────────────────── */

export const HOW_OFTEN_ITEMS = [
  {
    who: "Sam",
    activity: "tidy his room",
    marks: 1,
    period: "week",
    tiles: ["Sam", "often", "tidy", "How", "does", "his", "room", "do", "tidies"],
    solution: "How often does Sam tidy his room",
    answerStart: "He tidies his room",
    options: ["once a week", "twice a week", "three times a week"],
    answer: "once a week",
  },
  {
    who: "Lucy",
    activity: "brush her teeth",
    marks: 2,
    period: "day",
    tiles: ["brush", "How", "Lucy", "her", "does", "often", "teeth", "brushes"],
    solution: "How often does Lucy brush her teeth",
    answerStart: "She brushes her teeth",
    options: ["once a day", "twice a day", "twice a week"],
    answer: "twice a day",
  },
  {
    who: "Sam and Lucy",
    activity: "play football",
    marks: 3,
    period: "week",
    tiles: ["play", "do", "How", "they", "football", "often", "does"],
    solution: "How often do they play football",
    answerStart: "They play football",
    options: ["twice a week", "three times a day", "three times a week"],
    answer: "three times a week",
  },
  {
    who: "Dad",
    activity: "wash the car",
    marks: 1,
    period: "month",
    tiles: ["the", "Dad", "How", "wash", "car", "often", "does", "washes"],
    solution: "How often does Dad wash the car",
    answerStart: "He washes the car",
    options: ["once a week", "once a month", "twice a month"],
    answer: "once a month",
  },
  {
    who: "We",
    activity: "go to the cinema",
    marks: 2,
    period: "month",
    tiles: ["go", "we", "to", "How", "cinema", "do", "the", "often", "goes"],
    solution: "How often do we go to the cinema",
    answerStart: "We go to the cinema",
    options: ["twice a month", "twice a day", "once a month"],
    answer: "twice a month",
  },
  {
    who: "Mum",
    activity: "do the shopping",
    marks: 3,
    period: "week",
    tiles: ["Mum", "do", "shopping", "How", "the", "does", "often"],
    solution: "How often does Mum do the shopping",
    answerStart: "She does the shopping",
    options: ["three times a month", "three times a week", "twice a week"],
    answer: "three times a week",
  },
] as const;

/* ───────────────────────── Room 04 · Present Mix ────────────────────────── */

export const PRESENT_ITEMS = [
  { place: "Sam's bedroom", before: "Look! Sam", after: "his homework.", options: ["is doing", "does"], answer: "is doing", signal: "Look!", now: true },
  { place: "Park Street", before: "Lucy usually", after: "to school.", options: ["is walking", "walks"], answer: "walks", signal: "usually", now: false },
  { place: "Living room", before: "Shh! The baby", after: "at the moment.", options: ["sleeps", "is sleeping"], answer: "is sleeping", signal: "at the moment", now: true },
  { place: "Classroom 3B", before: "We", after: "English every Monday.", options: ["have", "are having"], answer: "have", signal: "every Monday", now: false },
  { place: "Kitchen", before: "Dad", after: "dinner right now.", options: ["is cooking", "cooks"], answer: "is cooking", signal: "right now", now: true },
  { place: "Hall", before: "I never", after: "computer games before school.", options: ["am playing", "play"], answer: "play", signal: "never", now: false },
  { place: "Music room", before: "Listen! The children", after: "a song.", options: ["sing", "are singing"], answer: "are singing", signal: "Listen!", now: true },
  { place: "Garage", before: "Mum", after: "the car once a month.", options: ["washes", "is washing"], answer: "washes", signal: "once a month", now: false },
] as const;

/* ───────────────────────── Room 05 · Final report ───────────────────────── */

export const REPORT_CHECKS = [
  { label: "a school subject", test: /\b(maths|english|science|art|pe|music|history|geography)\b/i },
  { label: "good at / not good at", test: /\bgood at\b/i },
  { label: "a chore or free-time activity", test: /\b(bed|tidy|tidies|wash|washes|washing|rubbish|cook|cooks|dishes|shopping|computer games|tv|football|read|reads|swim|bike|homework|piano|park)\b/i },
  { label: "an adverb of frequency", test: /\b(always|usually|sometimes|hardly ever|never)\b/i },
  { label: "once / twice / … times a …", test: /\b(once|twice|times)\s+a\b|\bevery\s+(day|week|month)\b/i },
  { label: "present continuous (now)", test: /(\b(am|is|are)|'m|'s|'re)\s+(not\s+)?\w+ing\b/i },
] as const;

export const REPORT_STARTERS = [
  "My favourite subject is … ",
  "I'm good at … ",
  "I'm not good at … ",
  "I always … ",
  "I hardly ever … ",
  "I … twice a week. ",
  "Right now I am …ing … ",
];

/* ───────────────────────── Homework ─────────────────────────────────────── */

export const HW_FREQ_PROMPTS = [
  "always + a chore",
  "usually + free time",
  "sometimes / hardly ever + a chore",
  "never + free time",
];

export const HW_HOW_OFTEN_QUESTIONS = [
  "How often do you tidy your room?",
  "How often do you have English lessons?",
  "How often does your family eat together?",
  "How often do you play outside?",
];

export const HW_FRIEND_IDEAS = ["walk the dog", "play chess", "go to the park", "help in the kitchen", "read comics", "ride a bike", "visit your grandparents", "go swimming"];

export const HW_MISTAKES = [
  { wrong: "I make always my bed.", accept: ["I always make my bed"] },
  { wrong: "She is play tennis now.", accept: ["She is playing tennis now", "She's playing tennis now"] },
  { wrong: "He usually is late for school.", accept: ["He is usually late for school", "He's usually late for school"] },
  { wrong: "We are having PE every Tuesday.", accept: ["We have PE every Tuesday"] },
  { wrong: "How often does you wash the dishes?", accept: ["How often do you wash the dishes"] },
  { wrong: "Look! Dad washes the car.", accept: ["Look Dad is washing the car", "Look Dad's washing the car"] },
  { wrong: "Sam tidy never his room.", accept: ["Sam never tidies his room"] },
] as const;

export const HW_CHARACTERS = [
  {
    id: "lucy",
    name: "Lucy",
    facts: [
      ["Good at", "music and English"],
      ["Not good at", "PE"],
      ["Chores", "makes her bed (always) · feeds the cat (twice a day) · takes out the rubbish (hardly ever)"],
      ["Free time", "plays the piano (three times a week) · reads comics (usually in the evening)"],
      ["Right now", "doing her homework"],
    ],
  },
  {
    id: "sam",
    name: "Sam",
    facts: [
      ["Good at", "history and art"],
      ["Not good at", "science"],
      ["Chores", "tidies his room (once a week) · washes the dishes (sometimes) · makes his bed (never!)"],
      ["Free time", "plays football (twice a week) · plays computer games (usually on Saturdays)"],
      ["Right now", "riding his bike"],
    ],
  },
  {
    id: "family",
    name: "The Bell family",
    facts: [
      ["Good at", "Mum — science · Dad — geography"],
      ["Not good at", "Dad — maths"],
      ["Chores", "clean the house together (once a week) · Dad cooks dinner (usually) · Mum washes the car (once a month)"],
      ["Free time", "watch a film (every Friday) · go to the park (twice a month)"],
      ["Right now", "having breakfast"],
    ],
  },
] as const;
