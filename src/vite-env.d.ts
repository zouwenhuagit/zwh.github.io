/// <reference types="vite/client" />

// 声明 .vue 单文件组件模块类型，供 TypeScript 识别
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}
