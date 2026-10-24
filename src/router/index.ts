// 路由配置：本地历史模式，base 取自 Vite BASE_URL
import { createRouter, createWebHistory } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import HomeView from '@/pages/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/articles',
      name: 'articles',
      component: () => import('@/pages/ArticlesView.vue'),
    },
    {
      path: '/articles/:slug',
      name: 'article-detail',
      component: () => import('@/pages/ArticleDetailView.vue'),
      // slug 对应文章不存在时重定向回文章列表
      beforeEnter: (to) => {
        const slug = to.params.slug as string
        const blog = useBlogStore()
        if (!blog.getArticleBySlug(slug)) {
          return { name: 'articles' }
        }
      },
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/pages/ProjectsView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/AboutView.vue'),
    },
    // 兜底：未匹配路由重定向首页
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  // 路由跳转后滚动回顶部
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
