import type Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SECTION_IDS = ['home', 'about', 'experience', 'blog', 'contact'];

/** Scroll progress bar, active-section marking and in-page anchor scrolling. */
export function initHeader(lenis: Lenis | null): void {
  const bar = document.querySelector<HTMLElement>('.progress__bar');
  if (bar) {
    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
    });
  }

  const setCurrent = (id: string) => {
    document
      .querySelectorAll<HTMLAnchorElement>('.nav__link, .mobile-menu__link')
      .forEach((link) => {
        if (link.hash === `#${id}`) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
  };

  SECTION_IDS.forEach((id) => {
    const section = document.getElementById(id);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) setCurrent(id);
      },
    });
  });

  document.addEventListener('click', (event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link || link.hash.length < 2) return;

    const target = document.querySelector<HTMLElement>(link.hash);
    if (!target) return;

    event.preventDefault();
    // Lenis already honours scroll-margin-top, which keeps sections clear of the header.
    if (lenis) {
      lenis.scrollTo(target);
    } else {
      target.scrollIntoView({ behavior: 'auto' });
    }
  });
}

/** Full-screen mobile menu: sheet wipe, staggered links, focus trap and Escape to close. */
export function initMenu(lenis: Lenis | null): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  const closeButton = menu.querySelector<HTMLButtonElement>('[data-menu-close]');
  const links = menu.querySelectorAll<HTMLAnchorElement>('.mobile-menu__text');
  const page = document.querySelectorAll<HTMLElement>('.site-header, main');
  let lastFocus: HTMLElement | null = null;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const finishClose = () => {
    menu.hidden = true;
    page.forEach((el) => el.toggleAttribute('inert', false));
    lastFocus?.focus();
  };

  const timeline = gsap
    .timeline({ paused: true, onReverseComplete: finishClose })
    .fromTo(
      menu,
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'power4.inOut' },
      0,
    )
    .fromTo(
      links,
      { yPercent: 110 },
      { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.07 },
      0.35,
    );

  const open = () => {
    lastFocus = toggle;
    menu.hidden = false;
    page.forEach((el) => el.toggleAttribute('inert', true));
    toggle.setAttribute('aria-expanded', 'true');
    lenis?.stop();
    if (reduced) timeline.progress(1);
    else timeline.play(0);
    menu.querySelector<HTMLAnchorElement>('.mobile-menu__link')?.focus();
  };

  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    lenis?.start();
    if (reduced) {
      timeline.progress(0);
      finishClose();
    } else {
      timeline.reverse();
    }
  };

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  toggle.addEventListener('click', () => (isOpen() ? close() : open()));
  closeButton?.addEventListener('click', close);

  // Links close the menu and let the anchor handler in initHeader do the scrolling.
  menu
    .querySelectorAll('[data-menu-link]')
    .forEach((link) => link.addEventListener('click', close));

  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = [...menu.querySelectorAll<HTMLElement>('a[href], button')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}
