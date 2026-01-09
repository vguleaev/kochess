import type { VitePWAOptions } from 'vite-plugin-pwa';

export const pwaConfig: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
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
      { purpose: 'maskable', sizes: '512x512', src: 'icon512_maskable.png', type: 'image/png' },
      { purpose: 'any', sizes: '512x512', src: 'icon512_rounded.png', type: 'image/png' },
    ],
  },
  workbox: {
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true,
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
  },
};
