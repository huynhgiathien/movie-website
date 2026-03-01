<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { movieApi } from '@/api'
import MovieCard from '@/components/MovieCard.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'
import type { Movie } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useStore()

const movies = ref<Movie[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)

const currentGenre = computed(() => {
  const slug = route.params.slug as string
  return store.state.genres.find((g: any) => g.slug === slug)
})

const fetchMovies = async () => {
  loading.value = true
  const slug = route.params.slug as string
  const page = Number(route.query.page) || 1
  currentPage.value = page

  try {
    const data = await movieApi.getMoviesByGenre(slug, { page, limit: 24 })
    movies.value = data.items
    totalPages.value = data.params.pagination.totalPages

    const genreName = currentGenre.value?.name || slug
    document.title = `Phim ${genreName} - Free Movie`
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
watch(() => [route.params.slug, route.query.page], fetchMovies)
</script>

<template>
  <div class="genre-page">
    <div class="container">
      <h1 class="page-title">
        Phim {{ currentGenre?.name || route.params.slug }}
      </h1>

      <div v-if="loading" class="loading-spinner"></div>

      <template v-else>
        <div v-if="movies.length === 0" class="empty-state">
          <h3>Không có phim</h3>
          <p>Chưa có phim nào trong thể loại này</p>
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
.genre-page {
  padding: 2.5rem 0;
  min-height: calc(100vh - 72px - 200px);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  letter-spacing: -0.02em;
}

.page-title::before {
  content: '';
  width: 4px;
  height: 32px;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
}
</style>
