import type { VitePWAOptions } from 'vite-plugin-pwa';

export const pwaConfig: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'vite.svg'],
  devOptions: {
    enabled: true,
    type: 'module',
  },
  manifest: {
    name: 'Kochess',
    short_name: 'Kochess',
    description: 'Kochess | AI-powered collection of your favorite recipes',
    theme_color: '#fdc700',
    background_color: '#ffffff',
    display: 'standalone',
    icons: [
      {
        src: 'vite.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\./i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60,
          },
        },
      },
    ],
  },
};
