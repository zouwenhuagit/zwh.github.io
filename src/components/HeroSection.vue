<script setup lang="ts">
// 首页 Hero 区：打字机效果 + 渐变光斑背景 + 头像圆环 + 双按钮
import { onMounted, onUnmounted, ref } from 'vue'
import { BookOpen, Github } from 'lucide-vue-next'
import { useBlogStore } from '@/stores/blog'

const store = useBlogStore()

const GITHUB_URL = 'https://github.com/zouwenhuagit'

// 打字机目标文案
const FULL_TEXT = '热爱技术，追求极致'
// 每个字符的打字间隔（毫秒）
const TYPE_INTERVAL = 100

// 当前已显示的文本
const typedText = ref('')
let typeTimer: ReturnType<typeof setInterval> | null = null

// 启动打字机：每 100ms 追加一个字符
onMounted(() => {
  let index = 0
  typeTimer = setInterval(() => {
    index++
    typedText.value = FULL_TEXT.slice(0, index)
    if (index >= FULL_TEXT.length && typeTimer) {
      clearInterval(typeTimer)
      typeTimer = null
    }
  }, TYPE_INTERVAL)
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (typeTimer) {
    clearInterval(typeTimer)
  }
})

// 页面加载时顺便拉取用户信息，供头像展示
store.fetchUser()
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- 渐变光斑背景装饰 -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div class="absolute top-1/3 -right-24 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-1/3 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
    </div>

    <div
      class="container relative flex flex-col items-center justify-center text-center pt-36 pb-24 md:pt-44 md:pb-32"
    >
      <!-- 头像：渐变圆环包裹 GitHub 头像 -->
      <div class="animate-slideUp mb-8">
        <div class="p-1 rounded-full bg-gradient-to-tr from-primary via-accent to-primary animate-fadeIn">
          <div class="p-0.5 rounded-full bg-background">
            <img
              v-if="store.user"
              :src="store.user.avatar_url"
              :alt="store.user.login + ' 的头像'"
              class="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover"
            />
            <!-- 加载中的占位骨架 -->
            <div v-else class="w-24 h-24 md:w-28 md:h-28 rounded-full bg-surface-light animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- 问候语 -->
      <p class="animate-slideUp animate-delay-100 text-primary font-mono text-sm md:text-base mb-4 tracking-widest">
        你好，我是 wenger
      </p>

      <!-- 主标题 + 打字机 -->
      <h1 class="animate-slideUp animate-delay-200 text-3xl md:text-5xl font-bold text-white mb-6">
        <span class="text-gradient">开发者博客</span>
      </h1>
      <p class="animate-slideUp animate-delay-300 text-xl md:text-2xl text-muted-light font-mono mb-8 h-8">
        {{ typedText }}<span class="inline-block w-0.5 h-6 md:h-7 bg-primary align-middle ml-1 animate-pulse"></span>
      </p>

      <!-- 副标题 -->
      <p class="animate-slideUp animate-delay-400 max-w-xl text-muted mb-10 leading-relaxed">
        记录前端开发、JavaScript、Vue 与 AI 编程的学习笔记与实践总结，希望对你有所帮助。
      </p>

      <!-- 双按钮 -->
      <div class="animate-slideUp animate-delay-500 flex flex-wrap items-center justify-center gap-4">
        <router-link to="/articles" class="btn-primary">
          <BookOpen :size="18" />
          查看文章
        </router-link>
        <a :href="GITHUB_URL" target="_blank" rel="noopener noreferrer" class="btn-outline">
          <Github :size="18" />
          GitHub
        </a>
      </div>
    </div>
  </section>
</template>
