import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // 开发时把数据接口代理到 yunxiao-insight 的本地实时服务（bun run serve）
    proxy: {
      "/api": "http://localhost:4173",
      "/data.json": "http://localhost:4173",
    },
  },
})
