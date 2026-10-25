# CLAUDE.md

Personal portfolio site for Naveen Tennakoon. One static page, built with Vite + TypeScript and deployed to GitHub Pages by GitHub Actions. See README.md for scripts and structure.

## Commands

- `npm run dev`: dev server on port 5173 (`.claude/launch.json` has `dev` and `preview` configs)
- `npm run build`: `tsc --noEmit` and then `vite build`. Run it before calling work done.
- `npm run format`: Prettier. CI fails on unformatted files (`npm run format:check`).

There are no tests. Verify changes in the browser at desktop width and at a phone width (≤768px). Scroll-linked motion only advances while the browser pane is rendering, so take a screenshot after each scroll step when checking it.

## Design direction

- **Monochrome.** Pure black, white and greys only. No accent colours. Contrast and character come from type, scale, whitespace and motion.
- Type: **Cormorant Garamond** (500/600) for display and headings, **Poppins** (300/400/500) for body and labels. Both are self-hosted via `@fontsource`.
- Photos are greyscale or inverted to fit the theme.
- Motion is the point of the site: polished, choreographed, and always supporting the content. Never decorative noise.

## Architecture

- `index.html` holds all content. Sections are `<section id="…">`. Nav links are `#id` anchors. The scroll-spy in `nav.ts` sets `aria-current` on them.
- `src/main.ts` imports the stylesheet and wires the modules. Add a behaviour as a new file in `src/modules/` exporting `initX()`, then call it from `main.ts`.
- Modules:
  - `smooth-scroll.ts`: Lenis, driven by GSAP's ticker.
  - `intro.ts`: page-load timeline. Shorter on repeat visits in the same session.
  - `scroll.ts`: parallax, hero fade, reveals, headline line masks, grouped reveals.
  - `nav.ts`: header progress bar, scroll-spy, anchor scrolling, the full-screen mobile menu.
  - `roadmap.ts`: the work-experience roadmap (see below).
  - `cursor.ts`: custom cursor (fine pointers only).
- Styles are plain CSS with custom properties. Put tokens (colours, type, spacing, easing, durations) in `styles/tokens.css` and reuse them rather than hard-coding values. `base.css` has reset, type, buttons and the grain. `layout.css` has the header, mobile menu, cursor and footer. `sections.css` has the page sections.
- Class names follow BEM-ish `block__element--modifier`. State uses `is-*` classes or ARIA attributes.
- Icons are inline SVG with `class="icon"` (stroke-based, 1.5 width, `currentColor`). There is no icon font or sprite.
- Images live in `src/assets/images/` as WebP and are referenced by root path in HTML (`/src/assets/images/x.webp`), so Vite hashes them. Files in `public/` keep a stable URL. The CV must stay at `/naveen_tennakoon.pdf` because it is linked from outside the site.

## Motion conventions

- **Libraries:** GSAP 3 with ScrollTrigger, and Lenis. Use `gsap.matchMedia()` for breakpoint-dependent motion, and clean up with its return value.
- **Only animate `transform`, `opacity` and `clip-path`**, plus SVG `stroke-dashoffset` for the roadmap road.
- **Reveals:** `data-reveal` on an element fades and rises it once when it reaches 85% of the viewport. Put `.rule` hairlines inside it and they draw out alongside. Headings use `.h2 > .line > .line__inner` for the line mask. Grouped items use `data-reveal-item` or the batch selectors in `scroll.ts`.
- **Parallax:** `data-speed` on a layer. The photo inside it counter-moves, so the frame stays still.
- **Roadmap:** the road is drawn by scrubbing `stroke-dashoffset`. Each stop lights up when the drawn line reaches its node, and its card slides in from its side. Stop positions are computed from the path with `getPointAtLength`. Up to 1024px it becomes a vertical rail, with stops lit by the rail's scale.
- **CSS motion states** are gated on `.roadmap--anim`, which JS adds before the roadmap is shown. Without JS, or with reduced motion, everything is visible and lit.
- **Reduced motion:** `base.css` shortens all CSS transitions and animations. `main.ts` skips every GSAP and Lenis effect when `prefers-reduced-motion: reduce` is set. Keep that true for any new motion.
- **Hover and cursor:** the custom cursor is off on touch devices and reduced motion. Don't rely on hover for information.
- **Tabs in the background:** GSAP and Lenis pause when the tab is hidden. Keep timers and loops cheap, and stop them when the page is hidden if they run indefinitely.

## Conventions

- TypeScript is strict (`noUncheckedIndexedAccess` included). Use no `any`, and guard `querySelector` results.
- Wrap `sessionStorage` and `localStorage` in try/catch. They throw in some private windows.
- Keep the page accessible: real buttons for controls, `aria-label` on icon-only links, visible `:focus-visible` outlines, and `alt` text on meaningful images. Modal surfaces (the mobile menu) trap focus and set `inert` on the page behind.
- Don't edit `dist/` or commit it. The deploy workflow builds it.
