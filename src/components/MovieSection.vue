<script setup lang="ts">
import MovieCard from './MovieCard.vue'
import type { Movie } from '@/types'

defineProps<{
  title: string
  movies: Movie[]
  loading?: boolean
  viewAllLink?: string
}>()
</script>

<template>
  <section class="movie-section">
    <div class="section-header">
      <h2 class="section-title">{{ title }}</h2>
      <router-link v-if="viewAllLink" :to="viewAllLink" class="view-all">
        Xem tất cả
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </router-link>
    </div>

    <div v-if="loading" class="loading-spinner"></div>

    <div v-else-if="movies.length === 0" class="empty-state">
      <h3>Không có phim</h3>
      <p>Chưa có phim nào trong danh mục này</p>
    </div>

    <div v-else class="movie-grid">
      <MovieCard v-for="movie in movies" :key="movie._id" :movie="movie" />
    </div>
  </section>
</template>

<style scoped>
.movie-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.view-all {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: var(--transition);
}

.view-all:hover {
  color: var(--primary-color);
}
</style>
