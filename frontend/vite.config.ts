import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The dpm codegen-js output under src/generated/daml.js is linked in via
  // an npm workspace, but it's plain CommonJS (`require`/`exports.Main = `).
  // Vite skips its default CJS->ESM interop for linked workspace packages
  // (it assumes they're ESM source you want HMR on), so without forcing it
  // into optimizeDeps the browser gets served the raw CommonJS file
  // verbatim and fails with "does not provide an export named 'Main'".
  optimizeDeps: {
    include: ['@daml.js/daml-main-0.0.1'],
  },
  server: {
    proxy: {
      // Avoids CORS entirely: the browser only ever talks to the Vite dev
      // server, which proxies to the local Canton sandbox's JSON Ledger API.
      '/v2': {
        target: 'http://localhost:7575',
        changeOrigin: true,
      },
    },
  },
})
