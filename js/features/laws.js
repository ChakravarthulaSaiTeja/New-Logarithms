import { laws } from '../data/laws.js';
import { fmt } from '../utils.js';

export function buildLaws() {
  const c = document.getElementById('lawsList');
  if (!c) return;

  c.innerHTML = laws.map(l => `
    <div class="lawcard" id="lw${l.num}" role="button" tabindex="0" aria-expanded="false"
         onclick="this.classList.toggle('open');this.setAttribute('aria-expanded',this.classList.contains('open'))">
      <div class="lhdr">
        <div class="lnum" aria-hidden="true">${l.num}</div>
        <div class="ltitle">${l.title}</div>
        <div class="lform">${l.formula}</div>
        <div class="lchev" aria-hidden="true">▼</div>
      </div>
      <div class="lbody">
        <div class="psteps">
          ${l.steps.map((s, i) => `
            <div class="pstep">
              <div class="psn" aria-hidden="true">${i + 1}</div>
              <div><div class="peq">${s.eq}</div><div class="pwhy">${s.why}</div></div>
            </div>`).join('')}
        </div>
        <div class="exbox">
          <div class="exlabel">${l.ex.lbl}</div>
          <div class="exrow">${l.ex.eqs.map((e, i) =>
            `<span class="exeq">${e}</span>${i < l.ex.eqs.length - 1 ? '<span style="color:var(--mt);font-size:11px" aria-hidden="true">→</span>' : ''}`
          ).join('')}</div>
          <div style="font-size:11px;color:var(--a3);margin-top:5px">${l.ex.verify}</div>
        </div>
      </div>
    </div>`).join('');

  c.querySelectorAll('.lawcard').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });
}

export function verLaws() {
  const b = parseFloat(document.getElementById('vBase')?.value || '2');
  const m = parseFloat(document.getElementById('vM')?.value || '8');
  const n = parseFloat(document.getElementById('vN')?.value || '4');
  const output = document.getElementById('vRes');
  if (!output) return;

  if (b <= 1 || m <= 0 || n <= 0) {
    output.innerHTML = '<span class="ver2">Need: base &gt; 1, m &gt; 0, n &gt; 0</span>';
    return;
  }

  const lb = v => Math.log(v) / Math.log(b);
  const chk = (a, bc) => Math.abs(a - bc) < 1e-4 ? '<span class="vok">✓</span>' : '<span class="ver2">✗</span>';
  const lm = lb(m), ln_ = lb(n);

  output.innerHTML = `
<span class="vok">Product:</span>  log(${m}×${n}) = ${fmt(lb(m * n))}  |  log(${m})+log(${n}) = ${fmt(lm + ln_)} ${chk(lb(m * n), lm + ln_)}
<span class="vok">Quotient:</span> log(${m}/${n}) = ${fmt(lb(m / n))}  |  log(${m})−log(${n}) = ${fmt(lm - ln_)} ${chk(lb(m / n), lm - ln_)}
<span class="vok">Power:</span>    log(${m}³) = ${fmt(lb(Math.pow(m, 3)))}  |  3×log(${m}) = ${fmt(3 * lm)} ${chk(lb(Math.pow(m, 3)), 3 * lm)}
<span class="vok">Reciprocal:</span> logₐ(m)×logₘ(a) = ${fmt(lm * (1 / lm))} ${chk(1, 1)}
<span class="vok">log(1)=0:</span> ${fmt(lb(1))} ${chk(lb(1), 0)}
<span class="vok">log(a)=1:</span> ${fmt(lb(b))} ${chk(lb(b), 1)}`;
}
