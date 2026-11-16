<script setup lang="ts">
// 项目页：全仓库按星标降序、双列网格、空状态、骨架屏；顶部附带自制游戏入口
import { onMounted } from 'vue'
import { Gamepad2, Play, PackageOpen } from 'lucide-vue-next'
import ProjectCard from '@/components/ProjectCard.vue'
import { useBlogStore } from '@/stores/blog'

const store = useBlogStore()

// 自制游戏页面地址（public/saltline/，随 base 自动拼接）
const GAME_URL = `${import.meta.env.BASE_URL}saltline/`

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

    <!-- 自制游戏入口 -->
    <a
      :href="GAME_URL"
      class="card-glow group relative flex flex-col md:flex-row items-start md:items-center gap-5 p-6 mb-10 overflow-hidden animate-fadeIn"
    >
      <div class="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <span class="flex items-center justify-center w-14 h-14 shrink-0 rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
        <Gamepad2 :size="28" />
      </span>
      <div class="flex-1">
        <div class="flex items-center gap-3">
          <h2 class="text-xl font-bold text-white">Saltline</h2>
          <span class="tag-pill">自制游戏</span>
        </div>
        <p class="text-muted text-sm mt-2 leading-relaxed">
          基于 Three.js 的第一人称波次生存射击游戏，含罗盘 HUD、无线电与目标追踪，支持桌面与移动端触控。
        </p>
      </div>
      <span class="btn-primary shrink-0">
        <Play :size="16" />
        开始游戏
      </span>
    </a>

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
