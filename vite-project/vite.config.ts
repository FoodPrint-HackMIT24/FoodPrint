import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    injectRegister: "inline",

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'FoodPrint',
      short_name: 'FoodPrint',
      description: 'description',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'apple_icon_2.png',
          sizes: '256x256',
          type: 'image/png'
        },
        {
          src: 'apple_icon_1.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      "screenshots": [
        {
          "src": "/apple_icon_1.png",
          "sizes": "512x512",
          "type": "image/png",
          "label": "apple icon"
        }
      ]
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})