<script setup lang="ts">
// 应用根组件：固定顶栏 + 路由视图 + 页脚
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <!-- 深色主题整体布局，最小高度占满视口 -->
  <div class="min-h-screen bg-background text-gray-100 font-sans flex flex-col">
    <Navbar />
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <!-- 路由切换时使用淡入动画 -->
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
/* 页面切换过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
