import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  buildOptions: {
    site: "https://code.halfapx.com/guideline-generator/",
  },
  experimental: {
    contentCollectionCache: false,
  },
});
