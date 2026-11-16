import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Vite 配置：Vue 插件 + @ 别名指向 src，base 与 GitHub Pages 仓库路径一致
const BASE = '/zwh.github.io/'

export default defineConfig({
  base: BASE,
  plugins: [
    vue(),
    // dev 下目录 URL（/saltline/ 结尾）会被 SPA fallback 劫持到博客 index.html，
    // 手动补全为 index.html 以命中 public 静态文件；GitHub Pages 原生支持该行为
    {
      name: 'serve-public-directory-index',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const raw = req.url || ''
          const [path, search] = raw.split('?')
          if (path.endsWith(`${BASE}saltline/`)) {
            req.url = path + 'index.html' + (search ? `?${search}` : '')
          }
          next()
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
