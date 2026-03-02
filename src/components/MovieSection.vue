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
        Xem t&#7845;t c&#7843;
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </router-link>
    </div>

    <div v-if="loading" class="loading-spinner"></div>

    <div v-else-if="movies.length === 0" class="empty-state">
      <h3>Kh&ocirc;ng c&oacute; phim</h3>
      <p>Ch&#432;a c&oacute; phim n&agrave;o trong danh m&#7909;c n&agrave;y</p>
    </div>

    <div v-else class="movie-grid">
      <MovieCard v-for="movie in movies" :key="movie._id" :movie="movie" />
    </div>
  </section>
</template>

<style scoped>
.movie-section {
  margin-bottom: 48px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.section-title {
  font-family: 'Sora', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF;
}

.view-all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  transition: var(--transition);
}

.view-all:hover {
  color: #E50914;
}

.view-all svg {
  transition: var(--transition);
}

.view-all:hover svg {
  transform: translateX(3px);
}
</style>
