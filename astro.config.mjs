import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://shizukani-cp.github.io/blog',
  base: '/blog',
  integrations: [tailwind()],
  output: 'static',
});
