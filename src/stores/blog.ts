// 博客全局状态：GitHub 用户/仓库（带缓存）+ 本地文章数据
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Article, GitHubRepo, GitHubUser } from '@/types'
import { fetchGitHubRepos, fetchGitHubUser } from '@/utils/api'
import { articles } from '@/data/articles'

export const useBlogStore = defineStore('blog', () => {
  // ===== 状态 =====
  const user = ref<GitHubUser | null>(null)
  const repos = ref<GitHubRepo[]>([])
  const userLoading = ref(false)
  const reposLoading = ref(false)
  const userError = ref(false)
  const reposError = ref(false)

  // 已请求标志：避免重复发起相同请求（缓存）
  let userFetched = false
  let reposFetched = false

  // ===== 计算属性 =====
  // 获得星标总数：所有仓库 stargazers_count 求和（修正 React 版硬编码 0 的缺陷）
  const totalStars = computed(() =>
    repos.value.reduce((sum, repo) => sum + repo.stargazers_count, 0),
  )

  // 按星标降序排列的仓库
  const reposByStars = computed(() =>
    [...repos.value].sort((a, b) => b.stargazers_count - a.stargazers_count),
  )

  // 按日期降序的文章
  const articlesByDate = computed(() =>
    [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  )

  // 全部文章标签去重集合
  const allTags = computed(() => Array.from(new Set(articles.flatMap((a) => a.tags))))

  // ===== 动作 =====
  // 获取 GitHub 用户资料（带缓存，避免重复请求）
  async function fetchUser() {
    if (userFetched || userLoading.value) return
    userFetched = true
    userLoading.value = true
    userError.value = false
    try {
      user.value = await fetchGitHubUser()
    } catch {
      userError.value = true
    } finally {
      userLoading.value = false
    }
  }

  // 获取 GitHub 仓库列表（带缓存，避免重复请求）
  async function fetchRepos() {
    if (reposFetched || reposLoading.value) return
    reposFetched = true
    reposLoading.value = true
    reposError.value = false
    try {
      repos.value = await fetchGitHubRepos()
    } catch {
      reposError.value = true
    } finally {
      reposLoading.value = false
    }
  }

  // 根据 slug 查找本地文章
  function getArticleBySlug(slug: string): Article | undefined {
    return articles.find((a) => a.slug === slug)
  }

  return {
    user,
    repos,
    userLoading,
    reposLoading,
    userError,
    reposError,
    totalStars,
    reposByStars,
    articlesByDate,
    allTags,
    fetchUser,
    fetchRepos,
    getArticleBySlug,
  }
})
