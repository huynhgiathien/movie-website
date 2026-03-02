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

const currentCountry = computed(() => {
  const slug = route.params.slug as string
  return store.state.countries.find((c: any) => c.slug === slug)
})

const fetchMovies = async () => {
  loading.value = true
  const slug = route.params.slug as string
  const page = Number(route.query.page) || 1
  currentPage.value = page

  try {
    const data = await movieApi.getMoviesByCountry(slug, { page, limit: 24 })
    movies.value = data.items
    totalPages.value = data.params.pagination.totalPages

    const countryName = currentCountry.value?.name || slug
    document.title = `Phim ${countryName} - CINEWORLD`
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
  <div class="country-page">
    <div class="container">
      <h1 class="page-title">
        Phim {{ currentCountry?.name || route.params.slug }}
      </h1>

      <div v-if="loading" class="loading-spinner"></div>

      <template v-else>
        <div v-if="movies.length === 0" class="empty-state">
          <h3>Không có phim</h3>
          <p>Chưa có phim nào từ quốc gia này</p>
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
.country-page {
  padding: 2.5rem 0;
  min-height: calc(100vh - 72px - 200px);
}

.page-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-title::before {
  content: '';
  width: 4px;
  height: 28px;
  background: #E50914;
  border-radius: 2px;
}
</style>
