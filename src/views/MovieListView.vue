<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { movieApi } from '@/api'
import MovieCard from '@/components/MovieCard.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'
import type { Movie } from '@/types'

const route = useRoute()
const router = useRouter()

const movies = ref<Movie[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)

const typeMap: Record<string, string> = {
  '/phim-bo': 'phim-bo',
  '/phim-le': 'phim-le',
  '/hoat-hinh': 'hoat-hinh',
  '/tv-shows': 'tv-shows'
}

const titleMap: Record<string, string> = {
  'phim-bo': 'Phim Bộ',
  'phim-le': 'Phim Lẻ',
  'hoat-hinh': 'Hoạt Hình',
  'tv-shows': 'TV Shows'
}

const fetchMovies = async () => {
  loading.value = true
  const type = typeMap[route.path] || 'phim-bo'
  const page = Number(route.query.page) || 1
  currentPage.value = page

  try {
    const data = await movieApi.getMovieList(type, { page, limit: 24 })
    movies.value = data.items
    totalPages.value = data.params.pagination.totalPages
    document.title = `${titleMap[type]} - PhimHay`
  } catch (error) {
    console.error('Failed to fetch movies:', error)
  } finally {
    loading.value = false
  }
}

const onPageChange = (page: number) => {
  router.push({ query: { ...route.query, page } })
}

onMounted(fetchMovies)
watch(() => [route.path, route.query.page], fetchMovies)
</script>

<template>
  <div class="movie-list-page">
    <div class="container">
      <h1 class="page-title">{{ titleMap[typeMap[route.path]] || 'Danh Sách Phim' }}</h1>

      <div v-if="loading" class="loading-spinner"></div>

      <template v-else>
        <div v-if="movies.length === 0" class="empty-state">
          <h3>Không tìm thấy phim</h3>
          <p>Vui lòng thử lại sau</p>
        </div>

        <div v-else class="movie-grid">
          <MovieCard v-for="movie in movies" :key="movie._id" :movie="movie" />
        </div>

        <PaginationComponent
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="onPageChange"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.movie-list-page {
  padding: 2rem 0;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-title::before {
  content: '';
  width: 4px;
  height: 28px;
  background: var(--primary-color);
  border-radius: 2px;
}
</style>
