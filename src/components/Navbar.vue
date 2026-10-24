<script setup lang="ts">
// 固定顶栏导航：毛玻璃效果、路由高亮、移动端汉堡菜单、GitHub 外链
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Github, Menu, X, Terminal } from 'lucide-vue-next'

// GitHub 主页地址
const GITHUB_URL = 'https://github.com/zouwenhuagit'

// 导航项配置
const navItems = [
  { name: '首页', to: '/' },
  { name: '文章', to: '/articles' },
  { name: '项目', to: '/projects' },
  { name: '关于', to: '/about' },
]

// 移动端菜单开合状态
const menuOpen = ref(false)
const route = useRoute()

// 路由变化时收起移动端菜单
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)
</script>

<template>
  <!-- 固定顶栏：毛玻璃 + 底部边框 -->
  <header class="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
    <nav class="container flex items-center justify-between h-16">
      <!-- 左侧 Logo -->
      <router-link to="/" class="flex items-center gap-2 text-lg font-bold font-mono text-white">
        <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
          <Terminal :size="18" />
        </span>
        <span>zouwenhuagit</span>
      </router-link>

      <!-- 桌面端导航 -->
      <div class="hidden md:flex items-center gap-8">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link text-sm"
        >
          {{ item.name }}
        </router-link>
        <!-- GitHub 图标外链 -->
        <a
          :href="GITHUB_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted-light transition-colors hover:text-primary"
          title="GitHub 主页"
        >
          <Github :size="20" />
        </a>
      </div>

      <!-- 移动端汉堡按钮 -->
      <button
        class="md:hidden text-muted-light hover:text-white transition-colors"
        :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
        @click="menuOpen = !menuOpen"
      >
        <X v-if="menuOpen" :size="24" />
        <Menu v-else :size="24" />
      </button>
    </nav>

    <!-- 移动端下拉菜单 -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="menuOpen" class="md:hidden bg-surface/95 backdrop-blur-md border-b border-border">
        <div class="container py-4 flex flex-col gap-1">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-3 py-2.5 rounded-lg text-muted-light transition-colors hover:bg-surface-light hover:text-white"
            :class="{ 'text-primary bg-surface-light': route.path === item.to }"
          >
            {{ item.name }}
          </router-link>
          <a
            :href="GITHUB_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 px-3 py-2.5 rounded-lg text-muted-light hover:bg-surface-light hover:text-white transition-colors"
          >
            <Github :size="18" />
            GitHub
          </a>
        </div>
      </div>
    </transition>
  </header>
</template>
