import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://amoghskanda.github.io',
  output: 'static',
  compressHTML: true,
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
