import { problems } from '../data/problems.js';
import { checkAnswer, esc } from '../utils.js';
import { state, recordAttempt, persist } from '../state.js';
import { renderMastery } from './mastery.js';
import { observeRevealNodes } from './nav.js';

const localState = {
  filter: 'All',
  stepState: {},
  practiceMode: false,
};

function getTagClass(tag) {
  return `ptag-${tag}`;
}

function getLevelLabel(p) {
  return p.level;
}

function getVisibleProblems() {
  const list = localState.practiceMode
    ? [...problems].sort(() => Math.random() - 0.5)
    : problems;
  if (localState.filter === 'All') return list;
  return list.filter(p => p.level === localState.filter);
}

function masteryBadge(id) {
  const m = state.mastery[id];
  if (m?.correct) return `<span class="mastery-badge mb-solved" title="Solved!">✓ Solved</span>`;
  if (m?.attempts) return `<span class="mastery-badge mb-unsolved">${m.attempts} attempt${m.attempts > 1 ? 's' : ''}</span>`;
  return '';
}

export function renderProblems() {
  const container = document.getElementById('probsList');
  if (!container) return;

  const visible = getVisibleProblems();
  if (!visible.length) {
    container.innerHTML = '<div class="prob">No problems found for this filter.</div>';
    return;
  }

  container.innerHTML = visible.map(p => {
    const idx = problems.indexOf(p);
    const tagClass = getTagClass(p.tag);
    return `
    <div class="prob" id="prob-card-${idx}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:.5rem;flex-wrap:wrap">
        <span class="prob-tag ${tagClass}">${getLevelLabel(p)}</span>
        ${masteryBadge(p.id)}
      </div>
      <div class="prob-q">${esc(p.question)}</div>
      <div class="prob-tools">
        <button class="prob-btn" data-action="hint" data-index="${idx}" aria-label="Show hint">Hint</button>
        <button class="prob-btn" data-action="step" data-index="${idx}" aria-label="Reveal next step">Next Step</button>
      </div>
      <div class="prob-hint" id="hint-${idx}" role="note">${esc(p.hint)}</div>
      <div class="prob-steps" id="steps-${idx}" aria-live="polite"></div>
      <div class="prob-answer">
        <input id="answer-${idx}" placeholder="Enter answer"
               aria-label="Your answer for: ${esc(p.question)}"
               autocomplete="off" spellcheck="false"/>
        <button class="prob-btn" data-action="check" data-index="${idx}" aria-label="Check answer">Check</button>
        <div class="prob-feedback" id="feedback-${idx}" role="status" aria-live="polite"></div>
      </div>
      <div id="sol-toggle-${idx}" style="margin-top:.5rem">
        <button class="sol-btn" data-action="solution" data-index="${idx}" aria-expanded="false">Show solution</button>
      </div>
      <div class="sol-body" id="sol-body-${idx}" aria-hidden="true">
        ${p.steps.map((s, i) => `
          <div class="sol-step">
            <div class="ssn" aria-hidden="true">${i + 1}</div>
            <div>
              <div class="sseq">${esc(s.eq)}</div>
              <div class="ssw">${esc(s.why)}</div>
            </div>
          </div>`).join('')}
        <div class="final-ans">Answer: ${esc(p.answer)}</div>
      </div>
    </div>`;
  }).join('');

  container.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const idx = inp.id.replace('answer-', '');
        checkProblemAnswer(Number(idx));
      }
    });
  });

  observeRevealNodes(container);
}

function showHint(i) {
  const el = document.getElementById(`hint-${i}`);
  if (!el) return;
  el.classList.toggle('show');
}

function showStep(i) {
  if (localState.stepState[i] == null) localState.stepState[i] = 0;
  const container = document.getElementById(`steps-${i}`);
  if (!container) return;
  const step = problems[i]?.steps[localState.stepState[i]];
  if (!step) return;
  const div = document.createElement('div');
  div.className = 'prob-step';
  div.textContent = step.eq;
  container.appendChild(div);
  localState.stepState[i]++;
}

function checkProblemAnswer(i) {
  const input = document.getElementById(`answer-${i}`);
  const feedback = document.getElementById(`feedback-${i}`);
  if (!input || !feedback) return;

  const p = problems[i];
  const correct = checkAnswer(input.value, p.answer, p.altAnswers || []);
  recordAttempt(p.id, correct);

  if (correct) {
    feedback.textContent = '✅ Correct!';
    feedback.className = 'prob-feedback ok';
    input.style.borderColor = 'rgba(126,223,160,0.5)';
    const card = document.getElementById(`prob-card-${i}`);
    if (card) {
      const badgeArea = card.querySelector('[class*="mastery-badge"]');
      if (badgeArea) badgeArea.outerHTML = `<span class="mastery-badge mb-solved">✓ Solved</span>`;
    }
  } else {
    feedback.textContent = '❌ Try again';
    feedback.className = 'prob-feedback bad';
    input.style.borderColor = 'rgba(240,112,112,0.4)';
    input.focus();
  }

  renderMastery();
}

function toggleSolution(i) {
  const body = document.getElementById(`sol-body-${i}`);
  const btn = document.querySelector(`[data-action="solution"][data-index="${i}"]`);
  if (!body || !btn) return;
  const open = body.classList.toggle('show');
  body.setAttribute('aria-hidden', String(!open));
  btn.setAttribute('aria-expanded', String(open));
  btn.textContent = open ? 'Hide solution' : 'Show solution';
}

function pickRandomProblem() {
  const visible = getVisibleProblems();
  if (!visible.length) return;
  const pick = visible[Math.floor(Math.random() * visible.length)];
  const idx = problems.indexOf(pick);
  localState.stepState[idx] = 0;
  renderProblems();
  setTimeout(() => {
    document.getElementById(`answer-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById(`answer-${idx}`)?.focus();
  }, 100);
}

export function initProblems() {
  const container = document.getElementById('probsList');
  const filter = document.getElementById('difficultyFilter');
  const randomBtn = document.getElementById('randomProblemBtn');
  const practiceModeBtn = document.getElementById('practiceModeBtn');

  container?.addEventListener('click', e => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const index = Number(target.dataset.index);
    const action = target.dataset.action;
    if (isNaN(index) || !action) return;
    if (action === 'hint') showHint(index);
    if (action === 'step') showStep(index);
    if (action === 'check') checkProblemAnswer(index);
    if (action === 'solution') toggleSolution(index);
  });

  filter?.addEventListener('change', () => {
    localState.filter = filter.value;
    renderProblems();
  });

  randomBtn?.addEventListener('click', pickRandomProblem);

  practiceModeBtn?.addEventListener('click', () => {
    localState.practiceMode = !localState.practiceMode;
    practiceModeBtn.classList.toggle('active', localState.practiceMode);
    practiceModeBtn.textContent = localState.practiceMode ? '🔀 Practice: ON' : '🔀 Practice Mode';
    renderProblems();
  });

  renderProblems();
}
