// GitHub 公开 API 封装：获取用户信息与仓库列表
import type { GitHubRepo, GitHubUser } from '@/types'

const GITHUB_API = 'https://api.github.com'
// 目标 GitHub 用户名
const USERNAME = 'zouwenhuagit'

// 通用请求：非 2xx 时抛出错误
async function get<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`请求失败: ${res.status} ${url}`)
  }
  return res.json() as Promise<T>
}

// 获取用户公开资料
export function fetchGitHubUser(): Promise<GitHubUser> {
  return get<GitHubUser>(`${GITHUB_API}/users/${USERNAME}`)
}

// 获取仓库列表：按最近更新排序，单页最多 100 条
export function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  return get<GitHubRepo[]>(`${GITHUB_API}/users/${USERNAME}/repos?sort=updated&per_page=100`)
}
