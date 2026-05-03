import { state, persist } from '../state.js';

const SECTIONS = ['why','what','exponents','expgraph','crisis','logdef','constraints','loggraph','laws','problems','mastery','quiz'];
const SECTION_NAMES = ['Why','Feel the Pain','Exponents','Exp Graphs','The Crisis','Log Definition','Constraints','Log Graphs','Laws + Proofs','Problems','Mastery','Quiz'];

let revealQueue = [];
let revealPointer = 0;

export function initTeacher() {
  const toggleBtn = document.getElementById('teacherToggle');
  const bar = document.getElementById('teacherBar');
  const prevBtn = document.getElementById('tmPrev');
  const nextBtn = document.getElementById('tmNext');
  const revealBtn = document.getElementById('tmReveal');
  const projBtn = document.getElementById('tmProjector');
  const exitBtn = document.getElementById('tmExit');

  toggleBtn?.addEventListener('click', toggleTeacher);
  exitBtn?.addEventListener('click', exitTeacher);
  prevBtn?.addEventListener('click', () => navigateSection(-1));
  nextBtn?.addEventListener('click', () => navigateSection(1));
  revealBtn?.addEventListener('click', revealNext);
  projBtn?.addEventListener('click', toggleProjector);

  document.addEventListener('keydown', handleKeyboard);

  if (state.teacherMode) applyTeacherMode();
  if (state.projectorMode) applyProjectorMode();

  window._teacher = { toggle: toggleTeacher, exit: exitTeacher };
}

function toggleTeacher() {
  state.teacherMode = !state.teacherMode;
  persist();
  if (state.teacherMode) applyTeacherMode();
  else exitTeacher();
}

function applyTeacherMode() {
  document.body.classList.add('teacher-mode');
  const bar = document.getElementById('teacherBar');
  if (bar) { bar.classList.add('active'); bar.removeAttribute('aria-hidden'); }
  const btn = document.getElementById('teacherToggle');
  if (btn) { btn.textContent = '✕ Exit Teach'; btn.setAttribute('aria-pressed', 'true'); }
  updateSectionHighlight();
  buildRevealQueue();
}

function exitTeacher() {
  state.teacherMode = false;
  state.projectorMode = false;
  persist();
  document.body.classList.remove('teacher-mode', 'projector-mode');
  const bar = document.getElementById('teacherBar');
  if (bar) { bar.classList.remove('active'); bar.setAttribute('aria-hidden', 'true'); }
  const btn = document.getElementById('teacherToggle');
  if (btn) { btn.textContent = '🎓 Teach'; btn.setAttribute('aria-pressed', 'false'); }
  document.querySelectorAll('section').forEach(s => s.classList.remove('tm-active', 'tm-inactive'));
  const projBtn = document.getElementById('tmProjector');
  if (projBtn) projBtn.textContent = '⬛ Projector';
}

export function navigateSection(delta) {
  const total = SECTIONS.length;
  state.currentSectionIdx = Math.max(0, Math.min(total - 1, state.currentSectionIdx + delta));
  persist();
  updateSectionHighlight();
  buildRevealQueue();
  const id = SECTIONS[state.currentSectionIdx];
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateSectionHighlight() {
  const idx = state.currentSectionIdx;
  const label = document.getElementById('tmLabel');
  if (label) label.textContent = `${SECTION_NAMES[idx]} (${idx + 1}/${SECTIONS.length})`;

  SECTIONS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('tm-active', i === idx);
    el.classList.toggle('tm-inactive', i !== idx);
  });

  const prevBtn = document.getElementById('tmPrev');
  const nextBtn = document.getElementById('tmNext');
  if (prevBtn) prevBtn.disabled = idx === 0;
  if (nextBtn) nextBtn.disabled = idx === SECTIONS.length - 1;
}

function buildRevealQueue() {
  const id = SECTIONS[state.currentSectionIdx];
  const section = document.getElementById(id);
  if (!section) return;
  revealQueue = Array.from(section.querySelectorAll('.rv, .card, .prob, .lawcard, .eqcard, .insight, .warn, .defbox, .ibox, .crisisbox, .gsection'));
  revealPointer = 0;
  revealQueue.forEach(el => el.classList.add('tm-hidden'));
}

function revealNext() {
  if (revealPointer < revealQueue.length) {
    revealQueue[revealPointer].classList.remove('tm-hidden');
    revealQueue[revealPointer].classList.add('tm-revealed');
    revealPointer++;
  }
  const btn = document.getElementById('tmReveal');
  if (btn) btn.textContent = revealPointer >= revealQueue.length ? '✓ All Shown' : `Reveal (${revealPointer}/${revealQueue.length})`;
}

function toggleProjector() {
  state.projectorMode = !state.projectorMode;
  persist();
  applyProjectorMode();
}

function applyProjectorMode() {
  document.body.classList.toggle('projector-mode', state.projectorMode);
  const btn = document.getElementById('tmProjector');
  if (btn) btn.textContent = state.projectorMode ? '🖥 Exit Projector' : '⬛ Projector';
}

function handleKeyboard(e) {
  if (!state.teacherMode) {
    if (e.key === 'T' && e.shiftKey && !e.ctrlKey && !e.altKey && !isInputFocused()) {
      toggleTeacher();
    }
    return;
  }

  if (isInputFocused()) return;

  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault();
      navigateSection(1);
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault();
      navigateSection(-1);
      break;
    case 'r':
    case 'R':
      revealNext();
      break;
    case 'p':
    case 'P':
      toggleProjector();
      break;
    case 'Escape':
      exitTeacher();
      break;
  }
}

function isInputFocused() {
  const tag = document.activeElement?.tagName?.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select';
}
