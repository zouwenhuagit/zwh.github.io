<script setup lang="ts">
// 项目页：全仓库按星标降序、双列网格、空状态、骨架屏
import { onMounted } from 'vue'
import { PackageOpen } from 'lucide-vue-next'
import ProjectCard from '@/components/ProjectCard.vue'
import { useBlogStore } from '@/stores/blog'

const store = useBlogStore()

onMounted(() => {
  store.fetchRepos()
})
</script>

<template>
  <section class="container pt-28 pb-16">
    <!-- 页面标题 -->
    <h1 class="text-3xl md:text-4xl font-bold text-white mb-3 animate-fadeIn">
      开源<span class="text-gradient">项目</span>
    </h1>
    <p class="text-muted mb-10 animate-fadeIn">来自 GitHub 的公开仓库，按星标数量排序。</p>

    <!-- 骨架屏 -->
    <div v-if="store.reposLoading && !store.repos.length" class="grid md:grid-cols-2 gap-6">
      <div v-for="i in 4" :key="i" class="card-glow p-6 animate-pulse">
        <div class="flex justify-between mb-3">
          <div class="h-5 w-32 bg-surface-light rounded"></div>
          <div class="h-5 w-5 bg-surface-light rounded"></div>
        </div>
        <div class="h-4 w-full bg-surface-light rounded mb-2"></div>
        <div class="h-4 w-2/3 bg-surface-light rounded mb-4"></div>
        <div class="h-3 w-44 bg-surface-light rounded"></div>
      </div>
    </div>

    <!-- 仓库双列网格 -->
    <div v-else-if="store.repos.length" class="grid md:grid-cols-2 gap-6">
      <ProjectCard
        v-for="repo in store.reposByStars"
        :key="repo.id"
        :repo="repo"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="flex flex-col items-center justify-center py-24 text-center">
      <PackageOpen :size="48" class="text-muted mb-4" />
      <p class="text-lg text-white font-medium mb-2">暂无公开项目</p>
      <p class="text-sm text-muted">GitHub 仓库数据加载失败或为空</p>
    </div>
  </section>
</template>
