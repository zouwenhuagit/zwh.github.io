<script setup lang="ts">
// 文章列表页：搜索框（标题/摘要包含匹配）+ 标签筛选 + 双列卡片 + 空状态
import { computed, ref } from 'vue'
import { Search, FileX2 } from 'lucide-vue-next'
import ArticleCard from '@/components/ArticleCard.vue'
import TagFilter from '@/components/TagFilter.vue'
import { useBlogStore } from '@/stores/blog'

const store = useBlogStore()

// 搜索关键字
const keyword = ref('')
// 当前选中标签（空 = 全部）
const activeTag = ref('')

// 前几张卡片的交错入场延迟类名（静态书写以便 Tailwind 扫描生成）
const delayClasses = ['animate-delay-100', 'animate-delay-200', 'animate-delay-300', 'animate-delay-400', 'animate-delay-500']

// 按搜索词与标签过滤后的文章
const filteredArticles = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return store.articlesByDate.filter((article) => {
    // 标签筛选
    const tagMatched = activeTag.value === '' || article.tags.includes(activeTag.value)
    // 搜索：标题或摘要包含关键字
    const searchMatched =
      kw === '' ||
      article.title.toLowerCase().includes(kw) ||
      article.excerpt.toLowerCase().includes(kw)
    return tagMatched && searchMatched
  })
})
</script>

<template>
  <section class="container pt-28 pb-16">
    <!-- 页面标题 -->
    <h1 class="text-3xl md:text-4xl font-bold text-white mb-8 animate-fadeIn">
      文章<span class="text-gradient">列表</span>
    </h1>

    <!-- 搜索框 -->
    <div class="relative mb-6 animate-slideUp">
      <Search :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      <input
        v-model="keyword"
        type="text"
        placeholder="搜索文章标题或摘要..."
        class="w-full bg-surface border border-border rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder:text-muted outline-none transition-colors focus:border-primary/60"
      />
    </div>

    <!-- 标签筛选 -->
    <div class="mb-10 animate-slideUp animate-delay-100">
      <TagFilter v-model="activeTag" :tags="store.allTags" />
    </div>

    <!-- 文章双列网格 -->
    <div v-if="filteredArticles.length" class="grid md:grid-cols-2 gap-6">
      <ArticleCard
        v-for="(article, index) in filteredArticles"
        :key="article.slug"
        :article="article"
        :class="delayClasses[index] ?? ''"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="flex flex-col items-center justify-center py-24 text-center">
      <FileX2 :size="48" class="text-muted mb-4" />
      <p class="text-lg text-white font-medium mb-2">没有找到匹配的文章</p>
      <p class="text-sm text-muted">换个关键字或标签试试吧</p>
    </div>
  </section>
</template>
