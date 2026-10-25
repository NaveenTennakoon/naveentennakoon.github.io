import { defineConfig } from 'vite';

// User site (naveentennakoon.github.io) is served from the domain root.
export default defineConfig({
  base: '/',
  build: {
    target: 'es2022',
  },
});
