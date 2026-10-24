// 格式化工具：日期、数字、阅读时长、语言颜色

// 日期格式化为中文长日期，如 2024年6月15日
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 数字格式化：千位以上缩写为 1.2k
export function formatNumber(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}k`
  }
  return String(n)
}

// 估算阅读时长：按中文约 400 字/分钟计算，最少 1 分钟
export function getReadingTime(content: string): number {
  const charCount = content.replace(/\s/g, '').length
  return Math.max(1, Math.ceil(charCount / 400))
}

// 编程语言颜色映射表（与 GitHub 语言色对齐，原样移植 React 版）
const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Vue: '#41b883',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  PowerShell: '#012456',
  Lua: '#000080',
  Makefile: '#427819',
  Batchfile: '#C1F12E',
  EJS: '#a91e50',
  Stylus: '#ff6347',
  Less: '#1d365d',
  MDX: '#fcb32c',
  'Jupyter Notebook': '#DA5B0B',
  'Objective-C': '#438eff',
}

// 获取语言对应颜色；未知语言或空值返回默认灰
export function getLanguageColor(language: string | null): string {
  if (!language) return '#6b7280'
  return languageColors[language] ?? '#6b7280'
}
