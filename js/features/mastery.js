import { state, resetProgress } from '../state.js';
import { problems } from '../data/problems.js';

const LEVELS = ['Easy', 'Medium', 'Hard', 'JEE'];
const LEVEL_COLORS = { Easy: '#7edfa0', Medium: '#c8a96e', Hard: '#f07070', JEE: '#7eb8f7' };

export function renderMastery() {
  const dash = document.getElementById('masteryDash');
  if (!dash) return;

  const byLevel = {};
  LEVELS.forEach(lv => { byLevel[lv] = { total: 0, solved: 0 }; });
  problems.forEach(p => {
    const lv = p.level;
    if (byLevel[lv]) {
      byLevel[lv].total++;
      if (state.mastery[p.id]?.correct) byLevel[lv].solved++;
    }
  });

  const totalProbs = problems.length;
  const totalSolved = Object.values(state.mastery).filter(m => m.correct).length;
  const overallPct = totalProbs ? Math.round((totalSolved / totalProbs) * 100) : 0;

  const streakHtml = state.streak > 0
    ? `<span class="mastery-streak">🔥 ${state.streak}-answer streak</span>`
    : '';

  const attemptsHtml = state.totalAttempts > 0
    ? `<span style="font-size:12px;color:var(--mt)">${state.totalAttempts} attempts · ${state.totalCorrect} correct</span>`
    : `<span style="font-size:12px;color:var(--mt)">No attempts yet — try some problems!</span>`;

  dash.innerHTML = `
    <div class="mastery-total rv">
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;margin-bottom:6px">Overall Progress — ${totalSolved}/${totalProbs} problems solved</div>
        <div class="mastery-bar"><div class="mastery-bar-fill" style="width:${overallPct}%"></div></div>
      </div>
      <div style="font-family:var(--mono);font-size:20px;color:var(--a3);font-weight:600">${overallPct}%</div>
      ${streakHtml}
    </div>
    <div style="margin-bottom:.75rem">${attemptsHtml}</div>
    <div class="mastery-grid rv">
      ${LEVELS.map(lv => {
        const d = byLevel[lv];
        const pct = d.total ? Math.round((d.solved / d.total) * 100) : 0;
        const color = LEVEL_COLORS[lv];
        const circ = 2 * Math.PI * 28;
        const dash_ = circ - (circ * pct) / 100;
        return `
        <div class="mastery-card">
          <div class="mastery-ring">
            <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
              <circle class="bg" cx="36" cy="36" r="28" stroke-dasharray="${circ}" stroke-dashoffset="0"/>
              <circle class="fg" cx="36" cy="36" r="28" stroke="${color}" stroke-dasharray="${circ}" stroke-dashoffset="${dash_}"/>
            </svg>
            <div class="mastery-pct">${pct}%</div>
          </div>
          <div class="mastery-level" style="color:${color}">${lv}</div>
          <div class="mastery-count">${d.solved} / ${d.total} solved</div>
        </div>`;
      }).join('')}
    </div>
    <button class="btng" id="resetMasteryBtn" style="margin-top:.5rem;font-size:12px">Reset all progress</button>
  `;

  document.getElementById('resetMasteryBtn')?.addEventListener('click', () => {
    if (confirm('Reset all mastery progress? This cannot be undone.')) {
      resetProgress();
      renderMastery();
    }
  });
}
