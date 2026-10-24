<script setup lang="ts">
// GitHub 统计卡片：IntersectionObserver 触发 0→N 缓动滚动计数 + 骨架屏
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { FolderGit2, Star, Users, UserPlus } from 'lucide-vue-next'
import { useBlogStore } from '@/stores/blog'

const store = useBlogStore()

// 统计项图标映射
const iconMap = {
  repos: FolderGit2,
  stars: Star,
  followers: Users,
  following: UserPlus,
} as const

// 根底层数据计算四张卡片的目标值
const stats = computed(() => [
  { key: 'repos', label: '公开仓库', value: store.user?.public_repos ?? 0 },
  { key: 'stars', label: '获得星标', value: store.totalStars },
  { key: 'followers', label: '关注者', value: store.user?.followers ?? 0 },
  { key: 'following', label: '关注中', value: store.user?.following ?? 0 },
])

// 交错入场延迟类名（静态书写以便 Tailwind 扫描生成）
const delayClasses = ['animate-delay-100', 'animate-delay-200', 'animate-delay-300', 'animate-delay-400']

// 数字滚动：当前显示值（各卡片独立）
const displayValues = ref<number[]>([0, 0, 0, 0])

// 滚动动画时长
const DURATION = 1200

// 数字缓动函数：easeOutCubic，先快后慢
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// 从 0 滚动到目标值
function animateTo(target: number, index: number) {
  const start = performance.now()
  function tick(now: number) {
    const progress = Math.min((now - start) / DURATION, 1)
    displayValues.value[index] = Math.round(easeOutCubic(progress) * target)
    if (progress < 1) {
      requestAnimationFrame(tick)
    }
  }
  requestAnimationFrame(tick)
}

// 容器引用与 IntersectionObserver
const sectionRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
// 防止重复触发
let animated = false

// 启动所有卡片的数字滚动
function startCounting() {
  if (animated) return
  animated = true
  stats.value.forEach((stat, index) => animateTo(stat.value, index))
}

onMounted(() => {
  // 拉取数据（store 内部有缓存，重复调用无副作用）
  store.fetchUser()
  store.fetchRepos()

  // 元素进入视口时触发计数动画
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounting()
          observer?.disconnect()
        }
      })
    },
    { threshold: 0.3 },
  )
  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <section ref="sectionRef" class="container py-16">
    <!-- 四列统计卡片网格 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <template v-if="store.userLoading && !store.user">
        <!-- 加载骨架屏 -->
        <div
          v-for="i in 4"
          :key="i"
          class="card-glow p-6 animate-pulse"
        >
          <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-light mb-4"></div>
          <div class="h-8 w-16 bg-surface-light rounded mb-2"></div>
          <div class="h-4 w-20 bg-surface-light rounded"></div>
        </div>
      </template>

      <template v-else-if="store.userError">
        <!-- 加载失败状态 -->
        <div class="col-span-2 lg:col-span-4 card-glow p-6 text-center text-muted">
          GitHub 数据加载失败，请检查网络后刷新重试
        </div>
      </template>

      <template v-else>
        <!-- 统计卡片 -->
        <div
          v-for="(stat, index) in stats"
          :key="stat.key"
          class="card-glow p-6 flex flex-col items-center text-center"
          :class="delayClasses[index]"
        >
          <span class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-3">
            <component :is="iconMap[stat.key as keyof typeof iconMap]" :size="20" />
          </span>
          <span class="text-2xl md:text-3xl font-bold font-mono text-white tabular-nums">
            {{ displayValues[index] }}
          </span>
          <span class="text-sm text-muted mt-1">{{ stat.label }}</span>
        </div>
      </template>
    </div>
  </section>
</template>
