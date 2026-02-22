import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "src": fileURLToPath(new URL("./src", import.meta.url)),
      "pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "layouts": fileURLToPath(new URL("./src/layouts", import.meta.url)),
      "components": fileURLToPath(new URL("./src/components", import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      // Все запросы, начинающиеся с /auth, перенаправлять на C++ бэкенд
      '/auth': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true
      },
      // На будущее: если у тебя появятся пути /api/...
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true
      }
    }
  },
});
