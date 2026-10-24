<script setup lang="ts">
// 项目卡片：语言色点、星标数、fork 数、更新日期、外链图标
import { computed } from 'vue'
import { Star, GitFork, ExternalLink } from 'lucide-vue-next'
import type { GitHubRepo } from '@/types'
import { formatDate, formatNumber, getLanguageColor } from '@/utils/format'

// 接收仓库数据
const props = defineProps<{
  repo: GitHubRepo
}>()

// 仓库主页链接
const repoUrl = computed(() => props.repo.html_url)

// 语言颜色点
const langColor = computed(() => getLanguageColor(props.repo.language))

// 格式化后的更新时间
const updatedText = computed(() => formatDate(props.repo.updated_at))
</script>

<template>
  <article class="card-glow p-6 group relative">
    <!-- 标题行：仓库名 + 外链图标 -->
    <div class="flex items-start justify-between gap-3 mb-2">
      <a
        :href="repoUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="text-base font-bold font-mono text-white transition-colors duration-200 group-hover:text-primary break-all"
      >
        {{ repo.name }}
      </a>
      <a
        :href="repoUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="shrink-0 text-muted transition-colors hover:text-primary"
        :title="'打开 ' + repo.name"
      >
        <ExternalLink :size="16" />
      </a>
    </div>

    <!-- 描述 -->
    <p class="text-sm text-muted leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
      {{ repo.description || '暂无描述' }}
    </p>

    <!-- 底部元信息：语言色点、星标、fork、更新日期 -->
    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted font-mono">
      <!-- 语言 -->
      <span v-if="repo.language" class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full inline-block" :style="{ backgroundColor: langColor }"></span>
        {{ repo.language }}
      </span>
      <!-- 星标 -->
      <span class="flex items-center gap-1">
        <Star :size="13" class="text-yellow-500/80" />
        {{ formatNumber(repo.stargazers_count) }}
      </span>
      <!-- Fork -->
      <span class="flex items-center gap-1">
        <GitFork :size="13" />
        {{ formatNumber(repo.forks_count) }}
      </span>
      <!-- 更新时间 -->
      <span class="ml-auto">更新于 {{ updatedText }}</span>
    </div>
  </article>
</template>
