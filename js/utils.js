export function sup(n) {
  return String(n).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d] || d).join('');
}

export function sub(n) {
  return String(n).split('').map(d => '₀₁₂₃₄₅₆₇₈₉'[d] || d).join('');
}

export function big(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(1) + ' trillion';
  if (n >= 1e9) return (n / 1e9).toFixed(1) + ' billion';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + ' million';
  if (n >= 1e3) return n.toLocaleString();
  return String(n);
}

export function fmt(v) {
  return isNaN(v) ? 'N/A' : v.toFixed(4);
}

export function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function normalizeAnswer(v) {
  if (v == null) return '';
  return String(v)
    .trim()
    .toLowerCase()
    .replace(/[−–—]/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/\s+/g, '');
}

export function checkAnswer(userRaw, correctRaw, altAnswers = []) {
  const user = normalizeAnswer(userRaw);
  if (!user) return false;
  const allCorrect = [correctRaw, ...altAnswers].map(normalizeAnswer);
  if (allCorrect.includes(user)) return true;
  const strip = s => s.replace(/^[xy]=/, '');
  if (allCorrect.some(c => strip(c) === strip(user))) return true;
  return false;
}
