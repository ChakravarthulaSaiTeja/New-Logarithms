import { big, sub, sup } from '../utils.js';

const HELPER_LABELS = ['x-axis', 'y-axis', 'asym', 'kp'];

const crosshairPlugin = {
  id: 'crosshairPlugin',
  afterEvent(chart, args) {
    const evt = args.event;
    if (evt.type === 'mousemove') {
      const { left, right } = chart.chartArea || {};
      if (left != null && evt.x >= left && evt.x <= right) {
        chart._crossX = evt.x;
      } else {
        chart._crossX = null;
      }
    } else if (evt.type === 'mouseout') {
      chart._crossX = null;
    }
    args.changed = true;
  },
  afterDraw(chart) {
    const x = chart._crossX;
    if (x == null) return;
    const { ctx, chartArea: { top, bottom, left, right } } = chart;
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
  }
};

const chartState = {
  egChart: null,
  lgChart: null,
  showEgB1: true,
  showEgB2: true,
  showEgKP: false,
  showEgAsym: true,
  showLg1: true,
  showLg2: true,
  showLgE: true,
  showLgM: false,
  showLgKP: false,
  showLgAsym: true,
};

const CHART_OPTS_BASE = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  interaction: {
    mode: 'nearest',
    intersect: false,
    axis: 'xy',
  },
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
      caretSize: 5,
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
    title: { display: true, text: 'x', color: '#e6ecfa', font: { size: 15, weight: '700' } },
  },
  y: {
    min: -2, max: 12,
    ticks: { color: '#c7cede', maxTicksLimit: 9, font: { size: 12, weight: '600' } },
    grid: { color: 'rgba(255,255,255,0.12)' },
    border: { color: 'rgba(255,255,255,0.45)', width: 1.4 },
    title: { display: true, text: 'y', color: '#e6ecfa', font: { size: 15, weight: '700' } },
  },
};

const AXES_LG = {
  x: {
    type: 'linear', min: -3, max: 12,
    ticks: { color: '#c7cede', maxTicksLimit: 8, font: { size: 12, weight: '600' } },
    grid: { color: 'rgba(255,255,255,0.12)' },
    border: { color: 'rgba(255,255,255,0.45)', width: 1.4 },
    title: { display: true, text: 'x', color: '#e6ecfa', font: { size: 15, weight: '700' } },
  },
  y: {
    min: -8, max: 8,
    ticks: { color: '#c7cede', maxTicksLimit: 8, font: { size: 12, weight: '600' } },
    grid: { color: 'rgba(255,255,255,0.12)' },
    border: { color: 'rgba(255,255,255,0.45)', width: 1.4 },
    title: { display: true, text: 'y', color: '#e6ecfa', font: { size: 15, weight: '700' } },
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
  if (slider) { slider.value = base; document.getElementById('egBaseVal').textContent = parseFloat(base).toFixed(1); }
  buildEgGraph();
}

export function setLgPreset(base) {
  const slider = document.getElementById('lgBase');
  if (slider) { slider.value = base; document.getElementById('lgBaseVal').textContent = parseFloat(base).toFixed(1); }
  buildLgGraph();
}

export function toggleEg(which) {
  if (which === 'b1') chartState.showEgB1 = !chartState.showEgB1;
  else chartState.showEgB2 = !chartState.showEgB2;
  document.getElementById('togEg1').classList.toggle('on', chartState.showEgB1);
  document.getElementById('togEg2').classList.toggle('on2', chartState.showEgB2);
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
  const b = parseFloat(document.getElementById('egBase').value);
  const datasets = [];

  if (chartState.showEgB1) {
    const pts = [];
    for (let x = -5; x <= 5; x += 0.12) {
      const y = Math.pow(b, x);
      if (y < 50) pts.push({ x: +x.toFixed(2), y: +y.toFixed(4) });
    }
    datasets.push({
      label: `${b.toFixed(1)}ˣ (a>1)`,
      data: pts, showLine: true,
      borderColor: '#7eb8f7', borderWidth: 2.5,
      pointRadius: 0, pointHoverRadius: 6,
      pointHoverBackgroundColor: '#7eb8f7',
      pointHoverBorderColor: '#fff', pointHoverBorderWidth: 1.5,
      tension: 0.3, fill: false,
    });
  }
  if (chartState.showEgB2) {
    const b2 = b > 1 ? 1 / b : b;
    const pts = [];
    for (let x = -5; x <= 5; x += 0.12) {
      const y = Math.pow(b2, x);
      if (y < 50) pts.push({ x: +x.toFixed(2), y: +y.toFixed(4) });
    }
    datasets.push({
      label: `${b2.toFixed(2)}ˣ (0<a<1)`,
      data: pts, showLine: true,
      borderColor: '#7edfa0', borderWidth: 2.5,
      pointRadius: 0, pointHoverRadius: 6,
      pointHoverBackgroundColor: '#7edfa0',
      pointHoverBorderColor: '#fff', pointHoverBorderWidth: 1.5,
      tension: 0.3, fill: false,
    });
  }

  datasets.push({ label: 'x-axis', data: [{ x: -5, y: 0 }, { x: 5, y: 0 }], showLine: true, borderColor: 'rgba(235,242,255,0.9)', borderWidth: 1.8, pointRadius: 0, pointHoverRadius: 0, fill: false });
  datasets.push({ label: 'y-axis', data: [{ x: 0, y: -2 }, { x: 0, y: 12 }], showLine: true, borderColor: 'rgba(235,242,255,0.9)', borderWidth: 1.8, pointRadius: 0, pointHoverRadius: 0, fill: false });

  if (chartState.showEgAsym) {
    datasets.push({ label: 'asym', data: [{ x: -5, y: 0 }, { x: 5, y: 0 }], showLine: true, borderColor: 'rgba(240,112,112,0.5)', borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 0, fill: false, borderDash: [6, 4] });
  }
  if (chartState.showEgKP) {
    datasets.push({ label: 'kp', data: [{ x: 0, y: 1 }], showLine: false, borderColor: '#c8a96e', backgroundColor: '#c8a96e', pointRadius: 8, pointHoverRadius: 9 });
  }

  const c = document.getElementById('egChart');
  if (chartState.egChart) chartState.egChart.destroy();
  chartState.egChart = new Chart(c, {
    type: 'scatter',
    data: { datasets },
    options: { ...CHART_OPTS_BASE, scales: AXES_EG },
  });

  const f = document.getElementById('egFacts');
  if (f) f.innerHTML = `
    <div class="gfact">Always passes through: <span>(0, 1)</span></div>
    <div class="gfact">For a&gt;1: <span>Increasing, range (0,∞)</span></div>
    <div class="gfact">For 0&lt;a&lt;1: <span>Decreasing, range (0,∞)</span></div>
    <div class="gfact">Horizontal asymptote: <span style="color:var(--re)">y = 0</span></div>
    <div class="gfact">Domain: <span>ℝ (all real x)</span></div>`;
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
  const b = parseFloat(document.getElementById('lgBase').value);
  const lB = Math.log(b);
  const datasets = [];

  if (chartState.showLg1) {
    const pts = [];
    for (let x = 0.04; x <= 12; x += 0.1)
      pts.push({ x: +x.toFixed(3), y: +(Math.log(x) / lB).toFixed(4) });
    datasets.push({
      label: `log${b.toFixed(1)}(x)`,
      data: pts, showLine: true,
      borderColor: '#7eb8f7', borderWidth: 2.5,
      pointRadius: 0, pointHoverRadius: 6,
      pointHoverBackgroundColor: '#7eb8f7',
      pointHoverBorderColor: '#fff', pointHoverBorderWidth: 1.5,
      tension: 0.3, fill: false,
    });
  }
  if (chartState.showLg2) {
    const lB2 = Math.log(1 / b);
    const pts = [];
    for (let x = 0.04; x <= 12; x += 0.1)
      pts.push({ x: +x.toFixed(3), y: +(Math.log(x) / lB2).toFixed(4) });
    datasets.push({
      label: `log₁/₍${b.toFixed(1)}₎(x)`,
      data: pts, showLine: true,
      borderColor: '#7edfa0', borderWidth: 2.5,
      pointRadius: 0, pointHoverRadius: 6,
      pointHoverBackgroundColor: '#7edfa0',
      pointHoverBorderColor: '#fff', pointHoverBorderWidth: 1.5,
      tension: 0.3, fill: false, borderDash: [4, 3],
    });
  }
  if (chartState.showLgE) {
    const pts = [];
    for (let x = -3; x <= 5; x += 0.1) {
      const y = Math.pow(b, x);
      if (y <= 12) pts.push({ x: +x.toFixed(2), y: +y.toFixed(4) });
    }
    datasets.push({
      label: `${b.toFixed(1)}ˣ`,
      data: pts, showLine: true,
      borderColor: '#c8a96e', borderWidth: 1.5,
      pointRadius: 0, pointHoverRadius: 6,
      pointHoverBackgroundColor: '#c8a96e',
      pointHoverBorderColor: '#fff', pointHoverBorderWidth: 1.5,
      tension: 0.3, fill: false, borderDash: [5, 4],
    });
  }
  if (chartState.showLgM) {
    datasets.push({ label: 'y=x', data: [{ x: -3, y: -3 }, { x: 12, y: 12 }], showLine: true, borderColor: 'rgba(255,255,255,0.15)', borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 0, fill: false, borderDash: [3, 5] });
  }

  datasets.push({ label: 'x-axis', data: [{ x: -3, y: 0 }, { x: 12, y: 0 }], showLine: true, borderColor: 'rgba(235,242,255,0.9)', borderWidth: 1.8, pointRadius: 0, pointHoverRadius: 0, fill: false });
  datasets.push({ label: 'y-axis', data: [{ x: 0, y: -8 }, { x: 0, y: 8 }], showLine: true, borderColor: 'rgba(235,242,255,0.9)', borderWidth: 1.8, pointRadius: 0, pointHoverRadius: 0, fill: false });

  if (chartState.showLgAsym) {
    datasets.push({ label: 'asym', data: [{ x: 0.001, y: -8 }, { x: 0.001, y: 8 }], showLine: true, borderColor: 'rgba(240,112,112,0.5)', borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 0, fill: false, borderDash: [6, 4] });
  }
  if (chartState.showLgKP) {
    datasets.push({ label: 'kp', data: [{ x: 1, y: 0 }, { x: b, y: 1 }], showLine: false, borderColor: '#c8a96e', backgroundColor: '#c8a96e', pointRadius: 8, pointHoverRadius: 9 });
  }

  const c = document.getElementById('lgChart');
  if (chartState.lgChart) chartState.lgChart.destroy();
  chartState.lgChart = new Chart(c, {
    type: 'scatter',
    data: { datasets },
    options: { ...CHART_OPTS_BASE, scales: AXES_LG },
  });

  const f = document.getElementById('lgFacts');
  if (f) f.innerHTML = `
    <div class="gfact">Domain: <span>x &gt; 0 only</span></div>
    <div class="gfact">Range: <span>all ℝ</span></div>
    <div class="gfact">Always through: <span>(1, 0)</span></div>
    <div class="gfact">Vertical asymptote: <span style="color:var(--re)">x = 0</span></div>
    <div class="gfact">Mirror of exponential: <span>across y = x</span></div>`;
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
    setTimeout(() => { chartState.egChart?.resize(); chartState.lgChart?.resize(); }, 120);
  } catch (e) { console.error('Fullscreen failed', e); }
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
    document.getElementById('egBaseVal').textContent = parseFloat(egBase.value).toFixed(1);
    buildEgGraph();
  });
  lgBase?.addEventListener('input', () => {
    document.getElementById('lgBaseVal').textContent = parseFloat(lgBase.value).toFixed(1);
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
