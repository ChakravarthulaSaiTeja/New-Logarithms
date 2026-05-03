const STORAGE_KEY = 'logroom_v2';

const defaults = {
  teacherMode: false,
  projectorMode: false,
  currentSectionIdx: 0,
  revealIdx: {},
  mastery: {},
  quizHistory: [],
  streak: 0,
  totalAttempts: 0,
  totalCorrect: 0,
  timedMode: false,
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch {}
  return { ...defaults };
}

export const state = load();

export function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

export function resetProgress() {
  state.mastery = {};
  state.quizHistory = [];
  state.streak = 0;
  state.totalAttempts = 0;
  state.totalCorrect = 0;
  persist();
}

export function recordAttempt(problemId, correct) {
  if (!state.mastery[problemId]) {
    state.mastery[problemId] = { attempts: 0, correct: false, solvedAt: null };
  }
  const m = state.mastery[problemId];
  m.attempts++;
  state.totalAttempts++;
  if (correct && !m.correct) {
    m.correct = true;
    m.solvedAt = Date.now();
    state.totalCorrect++;
    state.streak++;
  } else if (!correct) {
    state.streak = 0;
  }
  persist();
}
