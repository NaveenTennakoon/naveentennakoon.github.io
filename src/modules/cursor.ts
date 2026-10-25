import { gsap } from 'gsap';

const LINK_SELECTOR = 'a, button, .card, .focus__card';

/** Custom cursor. Fine pointers only, so touch devices keep native behaviour. */
export function initCursor(): void {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.documentElement.classList.add('has-cursor');

  const dot = document.createElement('div');
  dot.className = 'cursor__dot';
  const ring = document.createElement('div');
  ring.className = 'cursor__ring';
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.append(ring, dot);
  document.body.append(cursor);

  gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100, scale: 1 });
  gsap.set(ring, { scale: 0.2, opacity: 0 });

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });

  window.addEventListener('pointermove', (event) => {
    dotX(event.clientX);
    dotY(event.clientY);
    ringX(event.clientX);
    ringY(event.clientY);
  });

  const setLink = (on: boolean) => {
    gsap.to(ring, { scale: on ? 1 : 0.2, opacity: on ? 1 : 0, duration: 0.45, ease: 'expo.out' });
    gsap.to(dot, { scale: on ? 0 : 1, duration: 0.45, ease: 'expo.out' });
  };

  document.addEventListener('pointerover', (event) => {
    if ((event.target as Element).closest(LINK_SELECTOR)) setLink(true);
  });

  document.addEventListener('pointerout', (event) => {
    const next = event.relatedTarget as Element | null;
    if (!next?.closest(LINK_SELECTOR)) setLink(false);
  });
}
