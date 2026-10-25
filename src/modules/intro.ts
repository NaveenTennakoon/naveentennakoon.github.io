import { gsap } from 'gsap';

const STORAGE_KEY = 'intro-seen';

/** Returns true if the intro already played this session. Storage can throw in private windows. */
function hasSeenIntro(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function markIntroSeen(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // Storage unavailable: the intro simply plays again next load.
  }
}

/** Page-load sequence. Repeat visits in the same session get a shorter version. */
export function initIntro(): void {
  const k = hasSeenIntro() ? 0.6 : 1;
  markIntroSeen();

  gsap
    .timeline({ defaults: { ease: 'expo.out' } })
    .from('.hero__kicker', { opacity: 0, y: 12, duration: 0.8 * k, ease: 'power2.out' }, 0)
    .from('.hero__bg img', { opacity: 0, scale: 1.15, duration: 2.2 * k }, 0.2 * k)
    .from(
      '.hero__title .line__inner',
      { yPercent: 105, duration: 1.2 * k, stagger: 0.12 * k },
      0.4 * k,
    )
    .from(
      '.hero__role .rule',
      { scaleX: 0, duration: 0.9 * k, ease: 'power4.inOut', stagger: 0.05 },
      1.1 * k,
    )
    .from('.hero__role > span:not(.rule)', { opacity: 0, duration: 0.9 * k }, 1.1 * k)
    .from('.site-header', { yPercent: -100, duration: 0.9 * k }, 1.4 * k)
    .from(
      // Animate the CTA row as one unit so its two buttons can never drift apart
      '.hero__lede, .hero__actions, .hero__cue',
      { opacity: 0, y: 20, duration: 0.9 * k, stagger: 0.1 * k },
      1.55 * k,
    );
}
