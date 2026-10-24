<script setup lang="ts">
// Markdown 渲染器：markdown-it + highlight.js 深色高亮
// 样式细节（代码块语言标签条、行内 code 药丸、blockquote 边框等）见 index.css 的 .markdown-body
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/common'
// highlight.js 深色主题样式
import 'highlight.js/styles/github-dark.css'

// 接收 markdown 源文本
const props = defineProps<{
  content: string
}>()

// 创建 markdown-it 实例，代码块走 highlight.js 高亮
const md: MarkdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  highlight(code: string, lang: string): string {
    // 语言标签条文本（无语言时显示 text）
    const langLabel = lang || 'text'
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          `<pre class="hljs"><span class="code-lang">${langLabel}</span>` +
          `<code>${hljs.highlight(code, { language: lang, ignoreIllegals: true }).value}</code></pre>`
        )
      } catch {
        // 高亮失败时降级为纯文本输出
      }
    }
    return (
      `<pre class="hljs"><span class="code-lang">${langLabel}</span>` +
      `<code>${md.utils.escapeHtml(code)}</code></pre>`
    )
  },
})

// 渲染为 HTML 字符串
const html = computed(() => md.render(props.content))
</script>

<template>
  <!-- v-html 渲染 md 输出；content 为本地静态数据，无 XSS 风险 -->
  <div class="markdown-body" v-html="html"></div>
</template>
