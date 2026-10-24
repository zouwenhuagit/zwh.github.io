import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Vite 配置：Vue 插件 + @ 别名指向 src，base 与 GitHub Pages 仓库路径一致
export default defineConfig({
  base: '/zwh.github.io/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
