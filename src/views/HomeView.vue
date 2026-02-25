<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { movieApi } from '@/api'
import MovieSection from '@/components/MovieSection.vue'
import type { Movie } from '@/types'

const recentMovies = ref<Movie[]>([])
const seriesMovies = ref<Movie[]>([])
const singleMovies = ref<Movie[]>([])
const animeMovies = ref<Movie[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [recent, series, single, anime] = await Promise.all([
      movieApi.getRecentMovies(1),
      movieApi.getMovieList('phim-bo', { limit: 12 }),
      movieApi.getMovieList('phim-le', { limit: 12 }),
      movieApi.getMovieList('hoat-hinh', { limit: 12 })
    ])

    recentMovies.value = recent.items.slice(0, 12)
    seriesMovies.value = series.items
    singleMovies.value = single.items
    animeMovies.value = anime.items
  } catch (error) {
    console.error('Failed to fetch movies:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="home-page">
    <div class="container">
      <div v-if="loading" class="loading-spinner"></div>

      <template v-else>
        <MovieSection
          title="Phim Mới Cập Nhật"
          :movies="recentMovies"
        />

        <MovieSection
          title="Phim Bộ"
          :movies="seriesMovies"
          view-all-link="/phim-bo"
        />

        <MovieSection
          title="Phim Lẻ"
          :movies="singleMovies"
          view-all-link="/phim-le"
        />

        <MovieSection
          title="Hoạt Hình"
          :movies="animeMovies"
          view-all-link="/hoat-hinh"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  padding: 2rem 0;
}
</style>
