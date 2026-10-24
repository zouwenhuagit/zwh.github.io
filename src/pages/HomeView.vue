<script setup lang="ts">
// 首页：Hero + GitHub 统计 + 最新 3 篇文章 + 星标 Top6 项目
import { computed, onMounted } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import HeroSection from '@/components/HeroSection.vue'
import GitHubStats from '@/components/GitHubStats.vue'
import ArticleCard from '@/components/ArticleCard.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import { useBlogStore } from '@/stores/blog'

const store = useBlogStore()

// 最新 3 篇文章
const latestArticles = computed(() => store.articlesByDate.slice(0, 3))

// 星标最高的 6 个仓库
const topRepos = computed(() => store.reposByStars.slice(0, 6))

onMounted(() => {
  store.fetchUser()
  store.fetchRepos()
})
</script>

<template>
  <div>
    <!-- Hero 区：打字机 + 头像 + 按钮 -->
    <HeroSection />

    <!-- GitHub 数据统计卡片 -->
    <GitHubStats />

    <!-- 最新文章 -->
    <section class="container py-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-white">
          最新<span class="text-gradient">文章</span>
        </h2>
        <router-link
          to="/articles"
          class="flex items-center gap-1 text-sm text-primary hover:text-primary-dim transition-colors"
        >
          查看全部
          <ArrowRight :size="16" />
        </router-link>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ArticleCard
          v-for="article in latestArticles"
          :key="article.slug"
          :article="article"
        />
      </div>
    </section>

    <!-- 精选项目 -->
    <section class="container py-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-white">
          精选<span class="text-gradient">项目</span>
        </h2>
        <router-link
          to="/projects"
          class="flex items-center gap-1 text-sm text-primary hover:text-primary-dim transition-colors"
        >
          查看全部
          <ArrowRight :size="16" />
        </router-link>
      </div>

      <!-- 骨架屏 -->
      <div v-if="store.reposLoading && !store.repos.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="card-glow p-6 animate-pulse">
          <div class="h-5 w-32 bg-surface-light rounded mb-3"></div>
          <div class="h-4 w-full bg-surface-light rounded mb-2"></div>
          <div class="h-4 w-2/3 bg-surface-light rounded mb-4"></div>
          <div class="h-3 w-40 bg-surface-light rounded"></div>
        </div>
      </div>

      <!-- 星标 Top6 项目网格 -->
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard v-for="repo in topRepos" :key="repo.id" :repo="repo" />
      </div>
    </section>
  </div>
</template>
