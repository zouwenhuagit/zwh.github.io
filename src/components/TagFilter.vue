<script setup lang="ts">
// 标签筛选器："全部" + 标签 pills，选中态 primary 填充，v-model 双向绑定
// 接收标签列表
defineProps<{
  tags: string[]
}>()

// 当前选中的标签（空字符串表示"全部"）
const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <!-- "全部" 标签 -->
    <button
      class="tag-pill cursor-pointer hover:border-primary/60"
      :class="{ 'tag-pill-active': model === '' }"
      @click="model = ''"
    >
      全部
    </button>

    <!-- 各标签按钮 -->
    <button
      v-for="tag in tags"
      :key="tag"
      class="tag-pill cursor-pointer hover:border-primary/60"
      :class="{ 'tag-pill-active': model === tag }"
      @click="model = model === tag ? '' : tag"
    >
      {{ tag }}
    </button>
  </div>
</template>
