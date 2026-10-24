<script setup lang="ts">
// 文章详情页：返回链接、标签、标题、日期/阅读时长、Markdown 渲染
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Calendar, Clock } from 'lucide-vue-next'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { useBlogStore } from '@/stores/blog'
import { formatDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const store = useBlogStore()

// 当前 slug 对应的文章（路由守卫已保证存在，此处再兜底）
const article = computed(() => store.getArticleBySlug(route.params.slug as string))

// 格式化日期与元信息
const dateText = computed(() => (article.value ? formatDate(article.value.date) : ''))
</script>

<template>
  <section v-if="article" class="container pt-28 pb-16">
    <div class="max-w-3xl mx-auto">
      <!-- 返回文章列表 -->
      <button
        class="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-8"
        @click="router.push('/articles')"
      >
        <ArrowLeft :size="16" />
        返回文章列表
      </button>

      <!-- 标签 pills -->
      <div class="flex flex-wrap gap-2 mb-4 animate-fadeIn">
        <span v-for="tag in article.tags" :key="tag" class="tag-pill">{{ tag }}</span>
      </div>

      <!-- 标题 -->
      <h1 class="text-3xl md:text-4xl font-bold text-white leading-tight mb-4 animate-fadeIn">
        {{ article.title }}
      </h1>

      <!-- 元信息：日期 + 阅读时长 -->
      <div class="flex items-center gap-5 text-sm text-muted font-mono mb-10 pb-8 border-b border-border animate-fadeIn">
        <span class="flex items-center gap-1.5">
          <Calendar :size="15" />
          {{ dateText }}
        </span>
        <span class="flex items-center gap-1.5">
          <Clock :size="15" />
          {{ article.readingTime }} 分钟阅读
        </span>
      </div>

      <!-- Markdown 正文 -->
      <MarkdownRenderer :content="article.content" />
    </div>
  </section>
</template>
