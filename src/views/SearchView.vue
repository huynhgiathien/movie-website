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
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const searchQuery = ref('')

const search = async () => {
  const keyword = route.query.q as string
  if (!keyword) {
    movies.value = []
    return
  }

  searchQuery.value = keyword
  loading.value = true
  const page = Number(route.query.page) || 1
  currentPage.value = page

  try {
    const data = await movieApi.searchMovies(keyword, { page, limit: 24 })
    movies.value = data?.items ?? []
    totalPages.value = data?.params?.pagination?.totalPages ?? 1
    document.title = `T\u00ECm ki\u1EBFm: ${keyword} - CINEWORLD`
  } catch (error) {
    console.error('Search failed:', error)
    movies.value = []
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

const onPageChange = (page: number) => {
  router.push({ query: { ...route.query, page } })
}

onMounted(search)
watch(() => [route.query.q, route.query.page], search)
</script>

<template>
  <div class="search-page">
    <div class="container">
      <h1 class="page-title">
        <template v-if="searchQuery">
          Kết quả tìm kiếm: "{{ searchQuery }}"
        </template>
        <template v-else>
          Tìm kiếm phim
        </template>
      </h1>

      <div v-if="loading" class="loading-spinner"></div>

      <template v-else>
        <div v-if="!searchQuery" class="empty-state">
          <h3>Nhập từ khóa để tìm kiếm</h3>
          <p>Sử dụng ô tìm kiếm ở trên để tìm phim bạn muốn xem</p>
        </div>

        <div v-else-if="movies.length === 0" class="empty-state">
          <h3>Không tìm thấy kết quả</h3>
          <p>Thử tìm kiếm với từ khóa khác</p>
        </div>

        <template v-else>
          <p class="result-count">Tìm thấy {{ movies.length }} kết quả</p>
          <div class="movie-grid">
            <MovieCard v-for="movie in movies" :key="movie._id" :movie="movie" />
          </div>

          <PaginationComponent
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="onPageChange"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  padding: 2.5rem 0;
  min-height: calc(100vh - 72px - 200px);
}

.page-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #FFFFFF;
}

.result-count {
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 2rem;
  font-size: 0.875rem;
  padding: 0.625rem 1rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  display: inline-block;
}
</style>
