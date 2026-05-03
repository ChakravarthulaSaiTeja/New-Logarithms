import { state, persist } from '../state.js';

const SECTIONS = ['why','what','exponents','expgraph','crisis','logdef','constraints','loggraph','laws','problems','mastery','quiz'];

export function initNav() {
  window.goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateNav = () => {
    let current = 'why';
    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 140) current = id;
    });

    const idx = SECTIONS.indexOf(current);
    if (!state.teacherMode) {
      state.currentSectionIdx = idx >= 0 ? idx : 0;
    }

    document.querySelectorAll('.ns[data-section]').forEach(b => {
      b.classList.toggle('active', b.dataset.section === current);
    });

    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    const fill = document.getElementById('progFill');
    if (fill) fill.style.width = `${Math.min(100, pct)}%`;
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

export function initReveal() {
  const ro = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    }),
    { threshold: 0.08 }
  );
  document.querySelectorAll('.rv').forEach(el => ro.observe(el));
}

export function observeRevealNodes(root) {
  const ro = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    }),
    { threshold: 0.08 }
  );
  root.querySelectorAll('.rv').forEach(el => ro.observe(el));
}
