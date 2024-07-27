import { defineConfig } from 'astro/config';
// https://astro.build/config
export default defineConfig({
  site: "https://code.halfapx.com",
  base: "guideline-generator",
  trailingSlash: "ignore",
  experimental: {
    contentCollectionCache: false
  }
});