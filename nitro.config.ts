import { defineNitroConfig } from 'nitro/config';

export default defineNitroConfig({
  preset: 'vercel',
  compatibilityDate: '2026-09-27',
  routeRules: {
    '/**': {
      headers: {
        'cache-control': 'public, max-age=0, must-revalidate',
      },
    },
  },
});
