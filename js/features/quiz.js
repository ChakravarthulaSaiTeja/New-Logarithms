import { quizQuestions } from '../data/quiz.js';
import { state, persist } from '../state.js';
import { renderMastery } from './mastery.js';

const qState = {
  qi: 0,
  answered: false,
  startedAt: null,
  results: [],
  timer: null,
  timeRemaining: 30,
};

const TIME_LIMIT = 30;

export function buildQuiz() {
  const box = document.getElementById('quizBox');
  if (!box) return;

  clearTimer();

  if (qState.qi >= quizQuestions.length) {
    showResults(box);
    return;
  }

  const q = quizQuestions[qState.qi];
  qState.answered = false;
  qState.startedAt = Date.now();
  qState.timeRemaining = TIME_LIMIT;

  const isTimedMode = document.getElementById('timedModeCheck')?.checked;

  box.innerHTML = `
    <div class="qbox">
      <div class="qprog" aria-label="Question ${qState.qi + 1} of ${quizQuestions.length}">${qState.qi + 1} / ${quizQuestions.length}</div>
      <div class="qtxt" style="margin-top:.75rem">${q.q}</div>
      <div class="qopts" role="group" aria-label="Answer options">
        ${q.opts.map((o, i) => `<button class="qo" data-opt="${i}" aria-label="Option ${i+1}: ${o}">${o}</button>`).join('')}
      </div>
      <div class="qfb" id="qfb" role="status" aria-live="polite"></div>
      <div class="qnav">
        <span></span>
        <button class="btn" id="qnxt" style="display:none" aria-label="Next question">Next →</button>
      </div>
    </div>`;

  box.querySelectorAll('.qo').forEach(btn => {
    btn.addEventListener('click', () => answerQuestion(Number(btn.dataset.opt)));
  });

  document.getElementById('qnxt')?.addEventListener('click', () => {
    qState.qi++;
    qState.answered = false;
    buildQuiz();
  });

  if (isTimedMode) startTimer();
  updateTimerUI();
}

function startTimer() {
  const timerEl = document.getElementById('quizTimer');
  if (timerEl) timerEl.style.display = 'flex';
  qState.timeRemaining = TIME_LIMIT;
  updateTimerUI();
  qState.timer = setInterval(() => {
    qState.timeRemaining--;
    updateTimerUI();
    if (qState.timeRemaining <= 0) {
      clearTimer();
      if (!qState.answered) answerQuestion(-1, true);
    }
  }, 1000);
}

function clearTimer() {
  if (qState.timer) { clearInterval(qState.timer); qState.timer = null; }
}

function updateTimerUI() {
  const val = document.getElementById('timerVal');
  const bar = document.getElementById('timerBar');
  if (!val || !bar) return;
  val.textContent = qState.timeRemaining;
  const pct = (qState.timeRemaining / TIME_LIMIT) * 100;
  bar.style.width = `${pct}%`;
  bar.classList.toggle('warn', qState.timeRemaining <= 8);
}

function answerQuestion(i, timeout = false) {
  if (qState.answered) return;
  qState.answered = true;
  clearTimer();

  const q = quizQuestions[qState.qi];
  const timeMs = Date.now() - (qState.startedAt || Date.now());
  const correct = !timeout && i === q.c;

  qState.results.push({ qi: qState.qi, chosen: i, correct, timeMs });

  document.querySelectorAll('.qo').forEach((b, j) => {
    b.disabled = true;
    if (j === q.c) b.classList.add('correct');
    else if (j === i) b.classList.add('wrong');
  });

  const fb = document.getElementById('qfb');
  if (fb) {
    if (timeout) {
      fb.innerHTML = `<span style="color:var(--re);font-weight:600">Time's up! </span>${q.ex}`;
    } else {
      fb.innerHTML = correct
        ? `<span style="color:var(--a3);font-weight:600">Correct! </span>${q.ex}`
        : `<span style="color:var(--re);font-weight:600">Not quite. </span>${q.ex}`;
    }
  }

  const timerEl = document.getElementById('quizTimer');
  if (timerEl) timerEl.style.display = 'none';

  document.getElementById('qnxt')?.style.setProperty('display', 'block');
}

function showResults(box) {
  const results = qState.results;
  const total = quizQuestions.length;
  const correct = results.filter(r => r.correct).length;
  const pct = Math.round((correct / total) * 100);
  const avgMs = results.length ? Math.round(results.reduce((a, r) => a + r.timeMs, 0) / results.length / 1000) : 0;

  const score = pct >= 90 ? { emoji: '🏆', msg: 'Outstanding!', color: 'var(--a3)' }
    : pct >= 70 ? { emoji: '🎉', msg: 'Well done!', color: 'var(--a2)' }
    : pct >= 50 ? { emoji: '👍', msg: 'Good effort!', color: 'var(--a)' }
    : { emoji: '📚', msg: 'Keep practising!', color: 'var(--re)' };

  state.quizHistory.push({ score: correct, total, avgMs, ts: Date.now() });
  persist();
  renderMastery();

  box.innerHTML = `
    <div class="qbox" style="text-align:center;padding:2.5rem 2rem">
      <div style="font-size:48px;margin-bottom:.5rem">${score.emoji}</div>
      <div style="font-family:var(--serif);font-size:32px;color:${score.color};margin-bottom:.25rem">${score.msg}</div>
      <div style="font-size:14px;color:var(--mt);margin-bottom:1.5rem">You scored ${correct}/${total} (${pct}%)</div>

      <div class="analytics-grid" role="region" aria-label="Quiz results">
        <div class="analytics-stat">
          <div class="analytics-num" style="color:${score.color}">${pct}%</div>
          <div class="analytics-lbl">Score</div>
        </div>
        <div class="analytics-stat">
          <div class="analytics-num">${correct}</div>
          <div class="analytics-lbl">Correct</div>
        </div>
        <div class="analytics-stat">
          <div class="analytics-num">${total - correct}</div>
          <div class="analytics-lbl">Missed</div>
        </div>
        <div class="analytics-stat">
          <div class="analytics-num">${avgMs}s</div>
          <div class="analytics-lbl">Avg Time</div>
        </div>
      </div>

      <div style="text-align:left;margin:1.5rem 0">
        <div style="font-size:12px;font-weight:600;color:var(--mt);text-transform:uppercase;letter-spacing:.06em;margin-bottom:.75rem">Question Breakdown</div>
        ${results.map(r => {
          const q = quizQuestions[r.qi];
          return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:13px">
            <span style="color:${r.correct ? 'var(--a3)' : 'var(--re)'};flex-shrink:0">${r.correct ? '✓' : '✗'}</span>
            <span style="flex:1;color:var(--mt)">${q.q}</span>
            <span style="font-family:var(--mono);font-size:11px;color:var(--mt)">${Math.round(r.timeMs / 1000)}s</span>
          </div>`;
        }).join('')}
      </div>

      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:1rem">
        <button class="btn" id="quizRestart">Try Again</button>
        <button class="btng" id="quizReview" onclick="window.goTo?.('laws')">Review Laws</button>
      </div>
    </div>`;

  document.getElementById('quizRestart')?.addEventListener('click', () => {
    qState.qi = 0;
    qState.answered = false;
    qState.results = [];
    const timerEl = document.getElementById('quizTimer');
    if (timerEl) timerEl.style.display = 'none';
    buildQuiz();
  });
}

export function initQuizEvents() {
  const check = document.getElementById('timedModeCheck');
  const timerEl = document.getElementById('quizTimer');
  check?.addEventListener('change', () => {
    if (!check.checked && timerEl) timerEl.style.display = 'none';
  });
}
