<script setup lang="ts">
// 页脚：版权信息 + GitHub/Mail 图标链接 + Made with Heart
import { Github, Mail, Heart } from 'lucide-vue-next'

const GITHUB_URL = 'https://github.com/zouwenhuagit'
const MAIL_URL = 'mailto:zouwenhuagit@example.com'

// 当前年份，用于版权信息
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-border bg-surface/50">
    <div class="container py-8 flex flex-col items-center gap-4">
      <!-- 社交图标链接 -->
      <div class="flex items-center gap-5">
        <a
          :href="GITHUB_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted-light transition-colors hover:text-primary"
          title="GitHub"
        >
          <Github :size="20" />
        </a>
        <a
          :href="MAIL_URL"
          class="text-muted-light transition-colors hover:text-primary"
          title="邮箱"
        >
          <Mail :size="20" />
        </a>
      </div>

      <!-- 版权 -->
      <p class="text-sm text-muted font-mono">
        © {{ year }} zouwenhuagit. All rights reserved.
      </p>

      <!-- Made with Heart -->
      <p class="text-xs text-muted flex items-center gap-1">
        Made with
        <Heart :size="14" class="text-primary fill-primary" />
        using Vue 3 &amp; Tailwind CSS
      </p>
    </div>
  </footer>
</template>
