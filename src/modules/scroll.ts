import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Largest parallax drift in percent of the layer, so backdrops always cover their window. */
const MAX_DRIFT = 4;

/**
 * Scroll-linked motion: parallax, hero fade-out, single reveals, headline line masks
 * and grouped reveals. Everything fires once and never reverses, except the
 * parallax and hero fade, which are scrubbed to the scroll position.
 */
export function initScrollEffects(): void {
  // Parallax: the photo inside each layer counter-moves, so the frame itself stays put.
  gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((layer) => {
    const speed = Number(layer.dataset.speed);
    const target = layer.querySelector('img') ?? layer;
    const drift = Math.min((1 - speed) * 10, MAX_DRIFT);

    gsap.fromTo(
      target,
      { yPercent: -drift },
      {
        yPercent: drift,
        ease: 'none',
        scrollTrigger: {
          trigger: layer.closest('section'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });

  // The hero copy drifts up and fades as the hero leaves the screen.
  gsap.to('.hero__content', {
    y: -80,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true },
  });

  // Headlines: each line rises out of its mask.
  gsap.utils.toArray<HTMLElement>('.h2').forEach((heading) => {
    gsap.from(heading.querySelectorAll('.line__inner'), {
      yPercent: 105,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.1,
      clearProps: 'transform',
      scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
    });
  });

  // Single elements: rise and fade, with any hairline rule drawing out alongside.
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });

    tl.from(
      el,
      { opacity: 0, y: 24, duration: 1, ease: 'expo.out', clearProps: 'transform,opacity' },
      0,
    );
    tl.from(el.querySelectorAll('.rule'), { scaleX: 0, duration: 0.8, ease: 'power4.inOut' }, 0);
  });

  // Groups enter with a stagger, in batches as they reach the viewport.
  ScrollTrigger.batch('[data-reveal-item]', {
    start: 'top 85%',
    once: true,
    onEnter: (items) =>
      gsap.from(items, {
        opacity: 0,
        y: 24,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.1,
        clearProps: 'transform,opacity',
      }),
  });

  ScrollTrigger.batch('.focus__card', {
    start: 'top 85%',
    once: true,
    onEnter: (cards) =>
      gsap.fromTo(
        cards,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1,
          ease: 'power4.inOut',
          stagger: 0.1,
          clearProps: 'clipPath',
        },
      ),
  });

  ScrollTrigger.batch('.blog__grid > li', {
    start: 'top 85%',
    once: true,
    onEnter: (items) => {
      gsap.from(items, {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.12,
        clearProps: 'transform,opacity',
      });
      gsap.from(
        items.map((item) => item.querySelector('img')),
        { scale: 1.2, duration: 1.6, ease: 'expo.out', stagger: 0.12, clearProps: 'transform' },
      );
    },
  });
}
