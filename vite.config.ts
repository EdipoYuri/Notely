import path from "path"
import react from "@vitejs/plugin-react"
import svgrPlugin from 'vite-plugin-svgr'
import commonjs from 'vite-plugin-commonjs'
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), svgrPlugin(), commonjs()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    open: true,
    port: 3000
  },
})
