<script setup lang="ts">
// 文章卡片：标签 pills、标题、摘要、阅读时长、日期，hover 上浮发光
import { computed } from 'vue'
import { Calendar, Clock } from 'lucide-vue-next'
import type { Article } from '@/types'
import { formatDate } from '@/utils/format'

// 接收文章数据
const props = defineProps<{
  article: Article
}>()

// 格式化后的日期
const dateText = computed(() => formatDate(props.article.date))
</script>

<template>
  <!-- 整卡可点击，跳转文章详情 -->
  <router-link
    :to="`/articles/${article.slug}`"
    class="card-glow block p-6 group"
  >
    <!-- 标签 pills -->
    <div class="flex flex-wrap gap-2 mb-4">
      <span v-for="tag in article.tags" :key="tag" class="tag-pill group-hover:border-primary/40 group-hover:text-primary">
        {{ tag }}
      </span>
    </div>

    <!-- 标题 -->
    <h3 class="text-lg font-bold text-white mb-2 transition-colors duration-200 group-hover:text-primary line-clamp-2">
      {{ article.title }}
    </h3>

    <!-- 摘要：最多两行截断 -->
    <p class="text-sm text-muted leading-relaxed mb-4 line-clamp-2">
      {{ article.excerpt }}
    </p>

    <!-- 底部元信息：日期与阅读时长 -->
    <div class="flex items-center gap-4 text-xs text-muted font-mono">
      <span class="flex items-center gap-1">
        <Calendar :size="13" />
        {{ dateText }}
      </span>
      <span class="flex items-center gap-1">
        <Clock :size="13" />
        {{ article.readingTime }} 分钟阅读
      </span>
    </div>
  </router-link>
</template>
