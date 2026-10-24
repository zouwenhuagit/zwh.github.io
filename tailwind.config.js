/** @type {import('tailwindcss').Config} */
// 设计 tokens 与 React 版 1:1 对等：深色主题配色、等宽/无衬线字体、入场动画
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#14141f',
        'surface-light': '#1e1e2e',
        primary: '#00d4aa',
        'primary-dim': '#00b894',
        accent: '#7c3aed',
        muted: '#6b7280',
        'muted-light': '#9ca3af',
        border: '#2a2a3a',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Noto Sans SC', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out both',
        slideUp: 'slideUp 0.6s ease-out both',
        countUp: 'countUp 0.8s ease-out both',
      },
    },
  },
  container: {
    center: true,
    padding: '1rem',
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1152px',
    },
  },
  plugins: [],
}
