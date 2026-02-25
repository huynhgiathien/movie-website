<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { movieApi } from '@/api'
import type { MovieDetail } from '@/types'

const route = useRoute()
const movie = ref<MovieDetail | null>(null)
const loading = ref(true)
const error = ref('')

const fetchMovie = async () => {
  loading.value = true
  error.value = ''

  try {
    const slug = route.params.slug as string
    movie.value = await movieApi.getMovieDetail(slug)
    document.title = `${movie.value.name} - PhimHay`
  } catch (err) {
    error.value = 'Không thể tải thông tin phim'
    console.error('Failed to fetch movie:', err)
  } finally {
    loading.value = false
  }
}

const getImageUrl = (url: string | null) => movieApi.getImageUrl(url)

onMounted(fetchMovie)
watch(() => route.params.slug, fetchMovie)
</script>

<template>
  <div class="movie-detail-page">
    <div v-if="loading" class="loading-spinner"></div>

    <div v-else-if="error" class="container">
      <div class="error-message">{{ error }}</div>
    </div>

    <template v-else-if="movie">
      <div class="movie-backdrop" :style="{ backgroundImage: `url(${getImageUrl(movie.thumb_url)})` }">
        <div class="backdrop-overlay"></div>
      </div>

      <div class="container">
        <div class="movie-content">
          <div class="movie-poster">
            <img :src="getImageUrl(movie.poster_url)" :alt="movie.name" />
          </div>

          <div class="movie-info">
            <h1 class="movie-title">{{ movie.name }}</h1>
            <p class="movie-origin-name">{{ movie.origin_name }}</p>

            <div class="movie-meta">
              <span v-if="movie.year" class="meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {{ movie.year }}
              </span>
              <span v-if="movie.time" class="meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ movie.time }}
              </span>
              <span v-if="movie.quality" class="badge badge-quality">{{ movie.quality }}</span>
              <span v-if="movie.lang" class="badge badge-lang">{{ movie.lang }}</span>
            </div>

            <div class="movie-tags">
              <span class="tag-label">Thể loại:</span>
              <router-link
                v-for="cat in movie.category"
                :key="cat.id"
                :to="`/the-loai/${cat.slug}`"
                class="tag"
              >
                {{ cat.name }}
              </router-link>
            </div>

            <div class="movie-tags">
              <span class="tag-label">Quốc gia:</span>
              <router-link
                v-for="country in movie.country"
                :key="country.id"
                :to="`/quoc-gia/${country.slug}`"
                class="tag"
              >
                {{ country.name }}
              </router-link>
            </div>

            <div v-if="movie.director?.length" class="movie-tags">
              <span class="tag-label">Đạo diễn:</span>
              <span class="tag-text">{{ movie.director.join(', ') }}</span>
            </div>

            <div v-if="movie.actor?.length" class="movie-tags">
              <span class="tag-label">Diễn viên:</span>
              <span class="tag-text">{{ movie.actor.slice(0, 5).join(', ') }}</span>
            </div>

            <div class="movie-status">
              <span>Trạng thái: {{ movie.status }}</span>
              <span v-if="movie.episode_current">{{ movie.episode_current }}</span>
            </div>

            <div class="movie-actions">
              <router-link
                v-if="movie.episodes?.length && movie.episodes[0]?.server_data?.length"
                :to="`/xem-phim/${movie.slug}`"
                class="btn btn-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Xem Phim
              </router-link>
              <a
                v-if="movie.trailer_url"
                :href="movie.trailer_url"
                target="_blank"
                class="btn btn-secondary"
              >
                Xem Trailer
              </a>
            </div>
          </div>
        </div>

        <div class="movie-description">
          <h2 class="section-title">Nội Dung Phim</h2>
          <div class="description-content" v-html="movie.content"></div>
        </div>

        <div v-if="movie.episodes?.length" class="movie-episodes">
          <h2 class="section-title">Danh Sách Tập</h2>
          <div v-for="server in movie.episodes" :key="server.server_name" class="server-group">
            <h3 class="server-name">{{ server.server_name }}</h3>
            <div class="episode-list">
              <router-link
                v-for="ep in server.server_data"
                :key="ep.slug"
                :to="`/xem-phim/${movie.slug}?tap=${ep.slug}`"
                class="episode-btn"
              >
                {{ ep.name }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.movie-detail-page {
  position: relative;
  min-height: calc(100vh - 70px);
}

.movie-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 500px;
  background-size: cover;
  background-position: center top;
  z-index: 0;
}

.backdrop-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(20, 20, 20, 0.7) 0%, var(--bg-color) 100%);
}

.container {
  position: relative;
  z-index: 1;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.movie-content {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
}

.movie-poster {
  flex-shrink: 0;
  width: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.movie-poster img {
  width: 100%;
  height: auto;
}

.movie-info {
  flex: 1;
}

.movie-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.movie-origin-name {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.movie-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.movie-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.tag-label {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: var(--bg-card);
  border-radius: 20px;
  font-size: 0.85rem;
  transition: var(--transition);
}

.tag:hover {
  background: var(--primary-color);
  color: white;
}

.tag-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.movie-status {
  display: flex;
  gap: 1rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-card);
  border-radius: 8px;
}

.movie-actions {
  display: flex;
  gap: 1rem;
}

.movie-description {
  margin-bottom: 3rem;
}

.description-content {
  color: var(--text-secondary);
  line-height: 1.8;
}

.movie-episodes {
  margin-bottom: 2rem;
}

.server-group {
  margin-bottom: 1.5rem;
}

.server-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.episode-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.episode-btn {
  padding: 0.5rem 1rem;
  background: var(--bg-card);
  border-radius: 4px;
  font-size: 0.9rem;
  transition: var(--transition);
  min-width: 60px;
  text-align: center;
}

.episode-btn:hover {
  background: var(--primary-color);
  color: white;
}

@media (max-width: 768px) {
  .movie-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .movie-poster {
    width: 200px;
  }

  .movie-title {
    font-size: 1.5rem;
  }

  .movie-meta,
  .movie-tags {
    justify-content: center;
  }

  .movie-actions {
    justify-content: center;
  }
}
</style>
