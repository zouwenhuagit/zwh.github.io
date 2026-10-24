// GitHub 用户信息接口（字段与 GitHub REST API 响应对齐）
export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  bio: string | null
  location: string | null
  blog: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

// GitHub 仓库接口
export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  fork: boolean
  stargazers_count: number
  forks_count: number
  watchers_count: number
  language: string | null
  topics?: string[]
  created_at: string
  updated_at: string
}

// 博客文章接口（元数据 + markdown 正文）
export interface Article {
  slug: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  readingTime: number
  content: string
}
