import { big, sub, sup } from '../utils.js';

const HELPER_LABELS = ['x-axis', 'y-axis', 'asym', 'kp'];

const crosshairPlugin = {
  id: 'crosshairPlugin',
  afterEvent(chart, args) {
    const evt = args.event;
    if (evt.type === 'mousemove') {
      const { left, right } = chart.chartArea || {};
      chart._crossX = (left != null && evt.x >= left && evt.x <= right) ? evt.x : null;
    } else if (evt.type === 'mouseout') {
      chart._crossX = null;
    }
    args.changed = true;
  },
  afterDraw(chart) {
    const x = chart._crossX;
    if (x == null) return;
    const { ctx, chartArea: { top, bottom } } = chart;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.strokeStyle = 'rgba(200,169,110,0.8)';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([5, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  },
};

const chartState = {
  egChart: null,
  lgChart: null,
  showEgMain: true,
  showEgMirror: true,
  showEgKP: false,
  showEgAsym: true,
  showLg1: true,
  showLg2: true,
  showLgE: false,
  showLgM: false,
  showLgKP: false,
  showLgAsym: true,
};

function safeBase(b) {
  return b > 0 && Math.abs(b - 1) >= 0.04;
}

const CHART_OPTS_BASE = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  interaction: { mode: 'nearest', intersect: false, axis: 'xy' },
  plugins: {
    legend: {
      display: true,
      labels: {
        filter: item => !HELPER_LABELS.includes(item.text),
        color: '#aaa',
        font: { size: 11 },
        boxWidth: 14,
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(10,13,25,0.93)',
      borderColor: 'rgba(200,169,110,0.55)',
      borderWidth: 1,
      titleColor: '#c8a96e',
      bodyColor: '#c7cede',
      padding: { x: 14, y: 10 },
      cornerRadius: 8,
      displayColors: true,
      boxWidth: 10,
      boxHeight: 10,
      boxPadding: 4,
      filter: item => !HELPER_LABELS.includes(item.dataset.label),
      callbacks: {
        title: items => items.length ? `x = ${(+items[0].parsed.x).toFixed(3)}` : '',
        label: c => `  ${c.dataset.label}:  y = ${(+c.parsed.y).toFixed(3)}`,
      },
    },
  },
};

const AXES_EG = {
  x: {
    type: 'linear', min: -5, max: 5,
    ticks: { color: '#c7cede', maxTicksLimit: 9, font: { size: 12, weight: '600' } },
    grid: { color: 'rgba(255,255,255,0.12)' },
    border: { color: 'rgba(255,255,255,0.45)', width: 1.4 },
    title: { display: true, text: 'x  (the exponent / power)', color: '#e6ecfa', font: { size: 13, weight: '600' } },
  },
  y: {
    min: -0.5, max: 10,
    ticks: { color: '#c7cede', maxTicksLimit: 9, font: { size: 12, weight: '600' } },
    grid: { color: 'rgba(255,255,255,0.12)' },
    border: { color: 'rgba(255,255,255,0.45)', width: 1.4 },
    title: { display: true, text: 'y = aˣ  (the result)', color: '#e6ecfa', font: { size: 13, weight: '600' } },
  },
};

const AXES_LG = {
  x: {
    type: 'linear', min: -0.5, max: 12,
    ticks: { color: '#c7cede', maxTicksLimit: 8, font: { size: 12, weight: '600' } },
    grid: { color: 'rgba(255,255,255,0.12)' },
    border: { color: 'rgba(255,255,255,0.45)', width: 1.4 },
    title: { display: true, text: 'x  (the input)', color: '#e6ecfa', font: { size: 13, weight: '600' } },
  },
  y: {
    min: -6, max: 6,
    ticks: { color: '#c7cede', maxTicksLimit: 8, font: { size: 12, weight: '600' } },
    grid: { color: 'rgba(255,255,255,0.12)' },
    border: { color: 'rgba(255,255,255,0.45)', width: 1.4 },
    title: { display: true, text: 'y = logₐ(x)  (the exponent)', color: '#e6ecfa', font: { size: 13, weight: '600' } },
  },
};

export function updateMult(n) {
  document.getElementById('mVal').textContent = n;
  document.getElementById('painN').textContent = n;
  const show = Math.min(n, 18);
  let html = '';
  for (let i = 0; i < show; i++) html += `<div class="mb">${i === 0 ? '2' : '×2'}</div>`;
  if (n > 18) html += `<span style="font-size:12px;color:var(--mt);padding:4px 8px;align-self:center">…+${n - 18} more</span>`;
  document.getElementById('mBlocks').innerHTML = html;
  const val = Math.pow(2, n);
  document.getElementById('mResult').textContent = val > 1e15 ? '2' + sup(n) : big(val);
  document.getElementById('mNote').textContent = val > 1e15 ? `(≈${val.toExponential(2)})` : `= 2${sup(n)}`;
  document.getElementById('mPain').style.display = n >= 8 ? 'block' : 'none';
}

export function updateLogEx() {
  const lBase = document.getElementById('lBase');
  const lPow = document.getElementById('lPow');
  const b = +lBase.value, x = +lPow.value;
  document.getElementById('lBaseV').textContent = b;
  document.getElementById('lPowV').textContent = x;
  const n = Math.pow(b, x);
  const ns = n > 1e9 ? n.toExponential(2) : n.toLocaleString();
  document.getElementById('expForm').textContent = `${b}${sup(x)} = ${ns}`;
  document.getElementById('logForm').textContent = `log${sub(b)}(${ns}) = ${x}`;
  document.getElementById('readAloud').textContent = `"What power must I raise ${b} to, to get ${ns}? Answer: ${x}."`;
}

export function setEgPreset(base) {
  const slider = document.getElementById('egBase');
  if (slider) {
    slider.value = base;
    document.getElementById('egBaseVal').textContent = parseFloat(base).toFixed(2);
  }
  buildEgGraph();
}

export function setLgPreset(base) {
  const slider = document.getElementById('lgBase');
  if (slider) {
    slider.value = base;
    document.getElementById('lgBaseVal').textContent = parseFloat(base).toFixed(2);
  }
  buildLgGraph();
}

export function toggleEg(which) {
  if (which === 'main') chartState.showEgMain = !chartState.showEgMain;
  else chartState.showEgMirror = !chartState.showEgMirror;
  document.getElementById('togEg1').classList.toggle('on', chartState.showEgMain);
  document.getElementById('togEg2').classList.toggle('on2', chartState.showEgMirror);
  buildEgGraph();
}

export function toggleEgKP() {
  chartState.showEgKP = !chartState.showEgKP;
  document.getElementById('togEgKP')?.classList.toggle('on', chartState.showEgKP);
  buildEgGraph();
}

export function toggleEgAsym() {
  chartState.showEgAsym = !chartState.showEgAsym;
  document.getElementById('togEgAsym')?.classList.toggle('on', chartState.showEgAsym);
  buildEgGraph();
}

export function buildEgGraph() {
  if (typeof Chart === 'undefined') return;
  const rawB = parseFloat(document.getElementById('egBase').value);

  if (!safeBase(rawB)) {
    const f = document.getElementById('egFacts');
    if (f) f.innerHTML = `<div class="gfact" style="color:var(--re)">Base cannot equal 1 — please move the slider away from 1.</div>`;
    return;
  }

  const b = rawB;
  const bMirror = +(1 / b).toFixed(5);
  const datasets = [];

  if (chartState.showEgMain) {
    const pts = [];
    for (let x = -5; x <= 5; x += 0.08) {
      const y = Math.pow(b, x);
      if (isFinite(y) && y >= -0.5 && y <= 20) pts.push({ x: +x.toFixed(2), y: +y.toFixed(5) });
    }
    datasets.push({
      label: `y = ${b.toFixed(2)}ˣ`,
      data: pts, showLine: true,
      borderColor: '#7eb8f7', borderWidth: 2.8,
      pointRadius: 0, pointHoverRadius: 7,
      pointHoverBackgroundColor: '#7eb8f7',
      pointHoverBorderColor: '#fff', pointHoverBorderWidth: 2,
      tension: 0.25, fill: false,
    });
  }

  if (chartState.showEgMirror) {
    const pts = [];
    for (let x = -5; x <= 5; x += 0.08) {
      const y = Math.pow(bMirror, x);
      if (isFinite(y) && y >= -0.5 && y <= 20) pts.push({ x: +x.toFixed(2), y: +y.toFixed(5) });
    }
    datasets.push({
      label: `y = ${bMirror.toFixed(2)}ˣ`,
      data: pts, showLine: true,
      borderColor: '#7edfa0', borderWidth: 2.8,
      pointRadius: 0, pointHoverRadius: 7,
      pointHoverBackgroundColor: '#7edfa0',
      pointHoverBorderColor: '#fff', pointHoverBorderWidth: 2,
      tension: 0.25, fill: false, borderDash: [6, 3],
    });
  }

  datasets.push({ label: 'x-axis', data: [{ x: -5, y: 0 }, { x: 5, y: 0 }], showLine: true, borderColor: 'rgba(235,242,255,0.85)', borderWidth: 1.6, pointRadius: 0, pointHoverRadius: 0, fill: false });
  datasets.push({ label: 'y-axis', data: [{ x: 0, y: -0.5 }, { x: 0, y: 10 }], showLine: true, borderColor: 'rgba(235,242,255,0.85)', borderWidth: 1.6, pointRadius: 0, pointHoverRadius: 0, fill: false });

  if (chartState.showEgAsym) {
    datasets.push({ label: 'asym', data: [{ x: -5, y: 0 }, { x: 5, y: 0 }], showLine: true, borderColor: 'rgba(240,112,112,0.6)', borderWidth: 1.8, pointRadius: 0, pointHoverRadius: 0, fill: false, borderDash: [8, 5] });
  }
  if (chartState.showEgKP) {
    datasets.push({ label: 'kp', data: [{ x: 0, y: 1 }], showLine: false, borderColor: '#c8a96e', backgroundColor: '#c8a96e', pointRadius: 9, pointHoverRadius: 11 });
  }

  const c = document.getElementById('egChart');
  if (chartState.egChart) chartState.egChart.destroy();
  chartState.egChart = new Chart(c, { type: 'scatter', data: { datasets }, options: { ...CHART_OPTS_BASE, scales: AXES_EG } });

  const isGrowth = b > 1;
  const f = document.getElementById('egFacts');
  if (f) f.innerHTML = `
    <div class="gfact"><strong>Base a = ${b.toFixed(2)}</strong>: <span style="color:${isGrowth ? 'var(--a3)' : 'var(--a2)'}">${isGrowth ? '▲ Exponential growth (a > 1)' : '▼ Exponential decay (0 < a < 1)'}</span></div>
    <div class="gfact">Always passes through: <span>(0, 1)</span> &nbsp;→&nbsp; any base raised to power 0 = 1</div>
    <div class="gfact">Also passes through: <span>(1, ${b.toFixed(2)})</span> &nbsp;→&nbsp; a¹ = a</div>
    <div class="gfact">Also passes through: <span>(-1, ${bMirror.toFixed(3)})</span> &nbsp;→&nbsp; a⁻¹ = 1/a</div>
    <div class="gfact">Horizontal asymptote: <span style="color:var(--re)">y = 0</span> (never touches the x-axis)</div>
    <div class="gfact">Domain: <span>all real x</span> &nbsp;|&nbsp; Range: <span>y > 0 only</span></div>`;
}

export function toggleLg(which) {
  if (which === 'log1') chartState.showLg1 = !chartState.showLg1;
  else if (which === 'log2') chartState.showLg2 = !chartState.showLg2;
  else if (which === 'exp') chartState.showLgE = !chartState.showLgE;
  else chartState.showLgM = !chartState.showLgM;
  document.getElementById('togLg1').classList.toggle('on', chartState.showLg1);
  document.getElementById('togLg2').classList.toggle('on2', chartState.showLg2);
  document.getElementById('togLgE').classList.toggle('on3', chartState.showLgE);
  document.getElementById('togLgM').classList.toggle('on', chartState.showLgM);
  buildLgGraph();
}

export function toggleLgKP() {
  chartState.showLgKP = !chartState.showLgKP;
  document.getElementById('togLgKP')?.classList.toggle('on', chartState.showLgKP);
  buildLgGraph();
}

export function toggleLgAsym() {
  chartState.showLgAsym = !chartState.showLgAsym;
  document.getElementById('togLgAsym')?.classList.toggle('on', chartState.showLgAsym);
  buildLgGraph();
}

export function buildLgGraph() {
  if (typeof Chart === 'undefined') return;
  const rawB = parseFloat(document.getElementById('lgBase').value);

  if (!safeBase(rawB)) {
    const f = document.getElementById('lgFacts');
    if (f) f.innerHTML = `<div class="gfact" style="color:var(--re)">Base cannot equal 1 — logarithm is undefined at a = 1.</div>`;
    return;
  }

  const b = rawB;
  const lnB = Math.log(b);
  const bMirror = +(1 / b).toFixed(5);
  const lnBMirror = Math.log(bMirror);
  const datasets = [];

  if (chartState.showLg1) {
    const pts = [];
    for (let x = 0.03; x <= 12; x += 0.06) {
      const y = Math.log(x) / lnB;
      if (isFinite(y) && y >= -6 && y <= 6) pts.push({ x: +x.toFixed(3), y: +y.toFixed(5) });
    }
    datasets.push({
      label: `log_${b.toFixed(2)}(x)`,
      data: pts, showLine: true,
      borderColor: '#7eb8f7', borderWidth: 2.8,
      pointRadius: 0, pointHoverRadius: 7,
      pointHoverBackgroundColor: '#7eb8f7',
      pointHoverBorderColor: '#fff', pointHoverBorderWidth: 2,
      tension: 0.25, fill: false,
    });
  }

  if (chartState.showLg2) {
    const pts = [];
    for (let x = 0.03; x <= 12; x += 0.06) {
      const y = Math.log(x) / lnBMirror;
      if (isFinite(y) && y >= -6 && y <= 6) pts.push({ x: +x.toFixed(3), y: +y.toFixed(5) });
    }
    datasets.push({
      label: `log_${bMirror.toFixed(2)}(x)`,
      data: pts, showLine: true,
      borderColor: '#7edfa0', borderWidth: 2.8,
      pointRadius: 0, pointHoverRadius: 7,
      pointHoverBackgroundColor: '#7edfa0',
      pointHoverBorderColor: '#fff', pointHoverBorderWidth: 2,
      tension: 0.25, fill: false, borderDash: [6, 3],
    });
  }

  if (chartState.showLgE) {
    const pts = [];
    for (let x = -3; x <= 12; x += 0.08) {
      const y = Math.pow(b, x);
      if (isFinite(y) && y >= -0.5 && y <= 12) pts.push({ x: +x.toFixed(2), y: +y.toFixed(5) });
    }
    datasets.push({
      label: `y = ${b.toFixed(2)}ˣ`,
      data: pts, showLine: true,
      borderColor: '#c8a96e', borderWidth: 1.8,
      pointRadius: 0, pointHoverRadius: 6,
      pointHoverBackgroundColor: '#c8a96e',
      pointHoverBorderColor: '#fff', pointHoverBorderWidth: 1.5,
      tension: 0.25, fill: false, borderDash: [5, 4],
    });
  }

  if (chartState.showLgM) {
    datasets.push({ label: 'y=x', data: [{ x: -0.5, y: -0.5 }, { x: 6, y: 6 }], showLine: true, borderColor: 'rgba(255,255,255,0.18)', borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 0, fill: false, borderDash: [3, 5] });
  }

  datasets.push({ label: 'x-axis', data: [{ x: -0.5, y: 0 }, { x: 12, y: 0 }], showLine: true, borderColor: 'rgba(235,242,255,0.85)', borderWidth: 1.6, pointRadius: 0, pointHoverRadius: 0, fill: false });
  datasets.push({ label: 'y-axis', data: [{ x: 0, y: -6 }, { x: 0, y: 6 }], showLine: true, borderColor: 'rgba(235,242,255,0.85)', borderWidth: 1.6, pointRadius: 0, pointHoverRadius: 0, fill: false });

  if (chartState.showLgAsym) {
    datasets.push({ label: 'asym', data: [{ x: 0.001, y: -6 }, { x: 0.001, y: 6 }], showLine: true, borderColor: 'rgba(240,112,112,0.6)', borderWidth: 1.8, pointRadius: 0, pointHoverRadius: 0, fill: false, borderDash: [8, 5] });
  }
  if (chartState.showLgKP) {
    const kpData = [{ x: 1, y: 0 }];
    if (b > 0.03 && b < 12) kpData.push({ x: b, y: 1 });
    datasets.push({ label: 'kp', data: kpData, showLine: false, borderColor: '#c8a96e', backgroundColor: '#c8a96e', pointRadius: 9, pointHoverRadius: 11 });
  }

  const c = document.getElementById('lgChart');
  if (chartState.lgChart) chartState.lgChart.destroy();
  chartState.lgChart = new Chart(c, { type: 'scatter', data: { datasets }, options: { ...CHART_OPTS_BASE, scales: AXES_LG } });

  const isGrowth = b > 1;
  const f = document.getElementById('lgFacts');
  if (f) f.innerHTML = `
    <div class="gfact"><strong>Base a = ${b.toFixed(2)}</strong>: <span style="color:${isGrowth ? 'var(--a2)' : 'var(--a3)'}">${isGrowth ? '▲ Increasing log (a > 1)' : '▼ Decreasing log (0 < a < 1)'}</span></div>
    <div class="gfact">Always passes through: <span>(1, 0)</span> &nbsp;→&nbsp; log of 1 = 0 for any base</div>
    <div class="gfact">Also passes through: <span>(${b.toFixed(2)}, 1)</span> &nbsp;→&nbsp; logₐ(a) = 1 always</div>
    <div class="gfact">Vertical asymptote: <span style="color:var(--re)">x = 0</span> (undefined for x ≤ 0)</div>
    <div class="gfact">Domain: <span>x > 0 only</span> &nbsp;|&nbsp; Range: <span>all real y</span></div>
    <div class="gfact">Mirror of exponential: <span>y = logₐ(x) is the inverse of y = aˣ</span></div>`;
}

export async function toggleGraphFullscreen(wrapId, btnId) {
  const el = document.getElementById(wrapId);
  const btn = document.getElementById(btnId);
  if (!el) return;
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      if (btn) btn.textContent = 'Fullscreen';
    } else {
      await el.requestFullscreen();
      if (btn) btn.textContent = 'Exit Fullscreen';
    }
    setTimeout(() => { chartState.egChart?.resize(); chartState.lgChart?.resize(); }, 150);
  } catch (e) { console.error('Fullscreen failed', e); }
}

function clampBase(rawVal) {
  let v = parseFloat(rawVal);
  if (v > 0.94 && v < 1.06) {
    v = v < 1 ? 0.9 : 1.1;
  }
  return v;
}

export function initChartEvents() {
  if (typeof Chart !== 'undefined') {
    Chart.register(crosshairPlugin);
  }

  const mSlider = document.getElementById('mSlider');
  const egBase = document.getElementById('egBase');
  const lgBase = document.getElementById('lgBase');
  const lBase = document.getElementById('lBase');
  const lPow = document.getElementById('lPow');

  mSlider?.addEventListener('input', () => updateMult(+mSlider.value));
  lBase?.addEventListener('input', updateLogEx);
  lPow?.addEventListener('input', updateLogEx);

  egBase?.addEventListener('input', () => {
    const v = clampBase(egBase.value);
    document.getElementById('egBaseVal').textContent = v.toFixed(2);
    buildEgGraph();
  });

  lgBase?.addEventListener('input', () => {
    const v = clampBase(lgBase.value);
    document.getElementById('lgBaseVal').textContent = v.toFixed(2);
    buildLgGraph();
  });

  window.toggleEg = toggleEg;
  window.toggleLg = toggleLg;
  window.toggleEgKP = toggleEgKP;
  window.toggleEgAsym = toggleEgAsym;
  window.toggleLgKP = toggleLgKP;
  window.toggleLgAsym = toggleLgAsym;
  window.toggleGraphFullscreen = toggleGraphFullscreen;
  window.setEgPreset = setEgPreset;
  window.setLgPreset = setLgPreset;
}

export function postRenderResize() {
  setTimeout(() => {
    chartState.egChart?.resize();
    chartState.lgChart?.resize();
  }, 200);
}
