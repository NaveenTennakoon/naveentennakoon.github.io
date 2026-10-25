# naveentennakoon.github.io

Personal site of Naveen Tennakoon, served at <https://naveentennakoon.github.io/>.

A single black-and-white page (home, about, experience, blog, contact) built with [Vite](https://vite.dev) and TypeScript. No UI framework: semantic HTML, plain CSS with custom properties, and small TypeScript modules for the motion.

## Getting started

Requires Node 22 (see `.nvmrc`).

```bash
npm install
npm run dev        # dev server on http://localhost:5173
```

| Script                 | What it does                       |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Start the Vite dev server with HMR |
| `npm run build`        | Type-check, then build to `dist/`  |
| `npm run preview`      | Serve the production build locally |
| `npm run typecheck`    | Run `tsc --noEmit`                 |
| `npm run format`       | Format everything with Prettier    |
| `npm run format:check` | Check formatting (runs in CI)      |

## Project structure

```
index.html              Page markup (all content); Vite entry point
public/                 Copied as-is to the site root
  favicon.svg
  naveen_tennakoon.pdf  CV, linked from the hero
src/
  main.ts               Wires the modules together
  modules/              One behaviour per file
    smooth-scroll.ts    Lenis smooth scrolling
    intro.ts            Page-load sequence
    scroll.ts           Parallax, reveals, headline masks
    nav.ts              Header, scroll-spy, anchors, mobile menu
    roadmap.ts          Work-experience roadmap
    cursor.ts           Custom cursor
  styles/               tokens → base → layout → sections, imported by main.css
  assets/images/        WebP images, processed and hashed by Vite
.github/workflows/      GitHub Pages build and deploy
```

Motion uses [GSAP](https://gsap.com) with ScrollTrigger, and [Lenis](https://lenis.darkroom.engineering) for smooth scrolling. Typefaces are Cormorant Garamond and Poppins, self-hosted through `@fontsource`.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages.

The repository's Pages source must be set to **GitHub Actions** (Settings → Pages → Build and deployment → Source). With the old "Deploy from a branch" setting, Pages would serve the raw source and the site would break.

## Credits

The site began as a [Colorlib](https://colorlib.com) template (CC BY 3.0). The current design, markup, styles and scripts are rewritten from scratch.
