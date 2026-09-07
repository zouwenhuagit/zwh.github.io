import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'WebKiss Blog',
  description: '个人技术博客',
  base: '/zwh.github.io/',
  
  themeConfig: {
    logo: {
      src: '/logo.png',
      alt: 'WebKiss Blog',
      height: 36
    },
    
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '简历', link: '/resume' },
      { text: '关于', link: '/about' }
    ],
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zouwenhuagit' }
    ],
    
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 WebKiss'
    },
    
    search: {
      provider: 'local'
    }
  }
})
