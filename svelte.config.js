import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    files: {
      appTemplate: process.env.NODE_ENV === 'development' ? 'src/app.html' : 'src/app.prod.html'
    }
  }
};

export default config;