import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Samples along the road when finding where each stop sits on the path. */
const SAMPLES = 800;

/**
 * Work-experience roadmap. Scrolling draws the road (stroke-dashoffset, scrubbed).
 * Each stop lights up once the drawn line reaches it, and its card slides in from its side.
 * On screens up to 1024px the road becomes a vertical rail with the same behaviour.
 */
export function initRoadmap(reduced: boolean): void {
  const root = document.querySelector<HTMLElement>('[data-roadmap]');
  const path = root?.querySelector<SVGPathElement>('[data-road]');
  if (!root || !path) return;

  const stops = [...root.querySelectorAll<SVGGElement>('[data-stop]')];
  const cards = [...root.querySelectorAll<HTMLElement>('[data-card]')];
  if (stops.length === 0 || stops.length !== cards.length) return;

  const setReached = (index: number, reached: boolean) => {
    stops[index]?.classList.toggle('is-reached', reached);
    cards[index]?.classList.toggle('is-reached', reached);
  };

  if (reduced) {
    stops.forEach((_, i) => setReached(i, true));
    return;
  }

  root.classList.add('roadmap--anim');

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1025px)', () => {
    const length = path.getTotalLength();
    const thresholds = stops.map((stop) => stopProgress(path, length, stop));

    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    gsap.fromTo(
      path,
      { strokeDashoffset: length },
      {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top 65%', end: 'bottom 65%', scrub: 0.6 },
        onUpdate(this: gsap.core.Tween) {
          syncStops(this.progress(), thresholds, setReached);
        },
      },
    );

    return () => {
      path.removeAttribute('style');
      stops.forEach((_, i) => setReached(i, false));
    };
  });

  mm.add('(max-width: 1024px)', () => {
    const rail = root.querySelector<HTMLElement>('.roadmap__rail-fill');
    if (!rail) return;

    // Evenly spaced along the rail, first stop lit as the rail starts.
    const thresholds = stops.map((_, i) => i / (stops.length - 1));

    gsap.fromTo(
      rail,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top 65%', end: 'bottom 65%', scrub: 0.6 },
        onUpdate(this: gsap.core.Tween) {
          syncStops(this.progress(), thresholds, setReached);
        },
      },
    );

    return () => stops.forEach((_, i) => setReached(i, false));
  });

  // Recalculate once images and fonts have settled so the start/end points are right.
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

/** Progress (0–1) along the path at which a stop's node sits. */
function stopProgress(path: SVGPathElement, length: number, stop: SVGGElement): number {
  const node = stop.querySelector<SVGCircleElement>('.roadmap__node');
  const x = Number(node?.getAttribute('cx'));
  const y = Number(node?.getAttribute('cy'));

  let best = 0;
  let bestDistance = Infinity;
  for (let i = 0; i <= SAMPLES; i++) {
    const point = path.getPointAtLength((i / SAMPLES) * length);
    const distance = (point.x - x) ** 2 + (point.y - y) ** 2;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i / SAMPLES;
    }
  }
  return best;
}

function syncStops(
  progress: number,
  thresholds: number[],
  setReached: (index: number, reached: boolean) => void,
): void {
  thresholds.forEach((threshold, i) => setReached(i, progress >= threshold));
}
