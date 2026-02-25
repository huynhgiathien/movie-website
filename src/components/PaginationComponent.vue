<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const pages = computed(() => {
  const items: (number | string)[] = []
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      items.push(i)
    }
  } else {
    items.push(1)

    if (current > 3) {
      items.push('...')
    }

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      items.push(i)
    }

    if (current < total - 2) {
      items.push('...')
    }

    items.push(total)
  }

  return items
})

const goToPage = (page: number | string) => {
  if (typeof page === 'number' && page !== props.currentPage) {
    emit('page-change', page)
  }
}
</script>

<template>
  <div class="pagination" v-if="totalPages > 1">
    <button
      class="pagination-btn"
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
    >
      Trước
    </button>

    <button
      v-for="(page, index) in pages"
      :key="index"
      class="pagination-btn"
      :class="{ active: page === currentPage }"
      :disabled="page === '...'"
      @click="goToPage(page)"
    >
      {{ page }}
    </button>

    <button
      class="pagination-btn"
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
    >
      Sau
    </button>
  </div>
</template>
