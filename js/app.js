import { initNav, initReveal } from './features/nav.js';
import {
  buildEgGraph, buildLgGraph, initChartEvents,
  postRenderResize, updateLogEx, updateMult,
} from './features/charts.js';
import { buildLaws, verLaws } from './features/laws.js';
import { initProblems } from './features/problems.js';
import { buildQuiz, initQuizEvents } from './features/quiz.js';
import { initTeacher } from './features/teacher.js';
import { renderMastery } from './features/mastery.js';

window.verLaws = verLaws;

window.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initChartEvents();
  buildLaws();
  verLaws();
  buildQuiz();
  initQuizEvents();
  initProblems();
  initTeacher();
  renderMastery();

  updateMult(4);
  updateLogEx();
  buildEgGraph();
  buildLgGraph();
  postRenderResize();
});
