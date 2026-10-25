import './styles/main.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSmoothScroll } from './modules/smooth-scroll';
import { initHeader, initMenu } from './modules/nav';
import { initIntro } from './modules/intro';
import { initScrollEffects } from './modules/scroll';
import { initRoadmap } from './modules/roadmap';
import { initCursor } from './modules/cursor';

gsap.registerPlugin(ScrollTrigger);

const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis = reduced ? null : initSmoothScroll();

initHeader(lenis);
initMenu(lenis);

if (reduced) {
  // Everything stays visible; the roadmap is shown fully drawn and lit.
  initRoadmap(true);
} else {
  initIntro();
  initScrollEffects();
  initRoadmap(false);
  initCursor();
}
