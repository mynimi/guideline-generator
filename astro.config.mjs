import { defineConfig } from 'astro/config';

import relativeLinks from "astro-relative-links";

// https://astro.build/config
export default defineConfig({
  site: "https://code.halfapx.com",
  base: "/guideline-generator/",
  experimental: {
    contentCollectionCache: false
  },
  integrations: [relativeLinks()]
});