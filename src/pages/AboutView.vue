<script setup lang="ts">
// 关于页：GitHub 头像/bio 卡片 + 8 项技能进度条（渐变填充）+ 联系方式
import { onMounted } from 'vue'
import { MapPin, Github, Mail, CalendarDays, Code2 } from 'lucide-vue-next'
import { useBlogStore } from '@/stores/blog'
import { formatDate } from '@/utils/format'

const store = useBlogStore()

// 技能清单：名称 + 熟练度百分比
const skills = [
  { name: 'JavaScript / TypeScript', level: 90 },
  { name: 'Vue 生态（Vue 3 / Pinia）', level: 85 },
  { name: '小程序开发', level: 88 },
  { name: 'CSS / Tailwind CSS', level: 85 },
  { name: 'React', level: 75 },
  { name: 'Node.js', level: 72 },
  { name: '数据库（MySQL / MongoDB）', level: 68 },
  { name: 'DevOps / CI/CD', level: 60 },
]

onMounted(() => {
  store.fetchUser()
})
</script>

<template>
  <section class="container pt-28 pb-16">
    <div class="max-w-3xl mx-auto">
      <!-- 页面标题 -->
      <h1 class="text-3xl md:text-4xl font-bold text-white mb-10 animate-fadeIn">
        关于<span class="text-gradient">我</span>
      </h1>

      <!-- 个人信息卡片 -->
      <div class="card-glow p-8 mb-12 animate-slideUp">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <!-- 头像 -->
          <div class="shrink-0 p-0.5 rounded-full bg-gradient-to-tr from-primary to-accent">
            <img
              v-if="store.user"
              :src="store.user.avatar_url"
              :alt="store.user.login + ' 的头像'"
              class="w-24 h-24 rounded-full object-cover"
            />
            <div v-else class="w-24 h-24 rounded-full bg-surface-light animate-pulse"></div>
          </div>

          <!-- 资料文本 -->
          <div class="text-center sm:text-left">
            <h2 class="text-2xl font-bold text-white mb-1">
              {{ store.user?.name || store.user?.login || 'zouwenhuagit' }}
            </h2>
            <p class="text-primary font-mono text-sm mb-3">@{{ store.user?.login || 'zouwenhuagit' }}</p>
            <p class="text-muted leading-relaxed mb-4">
              {{ store.user?.bio || '一名热爱技术的全栈开发者，专注于前端工程化与跨端开发，乐于分享与开源。' }}
            </p>
            <!-- 元信息：位置 + 加入时间 -->
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-1 text-sm text-muted font-mono">
              <span v-if="store.user?.location" class="flex items-center gap-1.5">
                <MapPin :size="14" />
                {{ store.user.location }}
              </span>
              <span v-if="store.user?.created_at" class="flex items-center gap-1.5">
                <CalendarDays :size="14" />
                {{ formatDate(store.user.created_at) }} 加入
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 技能进度条 -->
      <div class="mb-12 animate-slideUp animate-delay-100">
        <h3 class="flex items-center gap-2 text-xl font-bold text-white mb-6">
          <Code2 :size="20" class="text-primary" />
          技能栈
        </h3>
        <div class="space-y-5">
          <div v-for="skill in skills" :key="skill.name">
            <!-- 技能名 + 百分比 -->
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-sm text-gray-300">{{ skill.name }}</span>
              <span class="text-sm font-mono text-primary">{{ skill.level }}%</span>
            </div>
            <!-- 进度条底轨 -->
            <div class="h-2 rounded-full bg-surface-light overflow-hidden">
              <!-- 渐变填充 -->
              <div
                class="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                :style="{ width: skill.level + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 联系方式 -->
      <div class="card-glow p-8 animate-slideUp animate-delay-200">
        <h3 class="text-xl font-bold text-white mb-6">联系我</h3>
        <div class="flex flex-wrap gap-4">
          <a
            href="https://github.com/zouwenhuagit"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-outline !py-2.5"
          >
            <Github :size="18" />
            GitHub
          </a>
          <a href="mailto:zouwenhuagit@example.com" class="btn-outline !py-2.5">
            <Mail :size="18" />
            邮箱
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
