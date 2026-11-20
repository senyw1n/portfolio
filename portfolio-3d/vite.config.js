import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Адрес сайта для превью ссылок (og:image и т. п. должны быть полными URL).
// На Vercel берётся из системной переменной сборки; локально — localhost.
const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:5173'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'site-url',
      transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
    },
  ],
  server: { port: 5173, open: false },
})
