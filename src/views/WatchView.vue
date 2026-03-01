<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { movieApi } from '@/api'
import type { MovieDetail, EpisodeData } from '@/types'

const route = useRoute()
const router = useRouter()

const movie = ref<MovieDetail | null>(null)
const loading = ref(true)
const error = ref('')
const currentServer = ref(0)
const currentEpisode = ref<EpisodeData | null>(null)

const episodes = computed(() => {
  if (!movie.value?.episodes?.length) return []
  return movie.value.episodes[currentServer.value]?.server_data || []
})

const servers = computed(() => {
  if (!movie.value?.episodes) return []
  return movie.value.episodes.map((s, i) => ({ name: s.server_name, index: i }))
})

const fetchMovie = async () => {
  loading.value = true
  error.value = ''

  try {
    const slug = route.params.slug as string
    movie.value = await movieApi.getMovieDetail(slug)

    if (movie.value.episodes?.length) {
      const tapQuery = route.query.tap as string
      const firstServer = movie.value.episodes[0]

      if (tapQuery && firstServer?.server_data) {
        const found = firstServer.server_data.find(ep => ep.slug === tapQuery)
        currentEpisode.value = found || firstServer.server_data[0]
      } else if (firstServer?.server_data?.length) {
        currentEpisode.value = firstServer.server_data[0]
      }
    }

    document.title = `Xem ${movie.value.name} - Free Movie`
  } catch (err) {
    error.value = 'Không thể tải phim'
    console.error('Failed to fetch movie:', err)
  } finally {
    loading.value = false
  }
}

const selectEpisode = (ep: EpisodeData) => {
  currentEpisode.value = ep
  router.replace({ query: { tap: ep.slug } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const selectServer = (index: number) => {
  currentServer.value = index
  const serverData = movie.value?.episodes?.[index]?.server_data
  if (serverData?.length) {
    selectEpisode(serverData[0])
  }
}

const getImageUrl = (url: string | null) => movieApi.getImageUrl(url)

onMounted(fetchMovie)
watch(() => route.params.slug, fetchMovie)
</script>

<template>
  <div class="watch-page">
    <div v-if="loading" class="loading-spinner"></div>

    <div v-else-if="error" class="container">
      <div class="error-message">{{ error }}</div>
    </div>

    <template v-else-if="movie">
      <div class="player-container">
        <div class="player-wrapper">
          <iframe
            v-if="currentEpisode?.link_embed"
            :src="currentEpisode.link_embed"
            frameborder="0"
            allowfullscreen
            allow="autoplay; encrypted-media"
          ></iframe>
          <div v-else class="no-player">
            <p>Không có nguồn phát cho tập này</p>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="watch-info">
          <div class="movie-header">
            <img :src="getImageUrl(movie.poster_url)" :alt="movie.name" class="movie-thumb" />
            <div class="movie-meta">
              <h1 class="movie-title">{{ movie.name }}</h1>
              <p class="movie-origin">{{ movie.origin_name }}</p>
              <p v-if="currentEpisode" class="current-episode">
                Đang xem: <strong>{{ currentEpisode.name }}</strong>
              </p>
              <router-link :to="`/phim/${movie.slug}`" class="btn btn-secondary">
                Xem chi tiết phim
              </router-link>
            </div>
          </div>

          <div v-if="servers.length > 1" class="server-selector">
            <h3>Chọn Server:</h3>
            <div class="server-list">
              <button
                v-for="server in servers"
                :key="server.index"
                :class="['server-btn', { active: currentServer === server.index }]"
                @click="selectServer(server.index)"
              >
                {{ server.name }}
              </button>
            </div>
          </div>

          <div v-if="episodes.length" class="episode-selector">
            <h3>Danh sách tập:</h3>
            <div class="episode-grid">
              <button
                v-for="ep in episodes"
                :key="ep.slug"
                :class="['episode-btn', { active: currentEpisode?.slug === ep.slug }]"
                @click="selectEpisode(ep)"
              >
                {{ ep.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.watch-page {
  padding-bottom: 3rem;
}

.player-container {
  background: #000;
  margin-bottom: 2.5rem;
  position: relative;
}

.player-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to top, var(--bg-color), transparent);
  pointer-events: none;
}

.player-wrapper {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  aspect-ratio: 16/9;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.player-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.no-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  color: var(--text-muted);
  font-size: 1.1rem;
}

.watch-info {
  max-width: 1200px;
  margin: 0 auto;
}

.movie-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2.5rem;
  padding: 1.75rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(12px);
}

.movie-thumb {
  width: 130px;
  height: auto;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.movie-meta {
  flex: 1;
}

.movie-title {
  font-size: 1.625rem;
  font-weight: 700;
  margin-bottom: 0.375rem;
  letter-spacing: -0.02em;
}

.movie-origin {
  color: var(--text-muted);
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.current-episode {
  margin-bottom: 1.25rem;
  padding: 0.625rem 1rem;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: var(--radius-md);
  display: inline-block;
  font-size: 0.9rem;
}

.current-episode strong {
  color: var(--primary-color);
}

.server-selector,
.episode-selector {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(12px);
}

.server-selector h3,
.episode-selector h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.server-selector h3::before,
.episode-selector h3::before {
  content: '';
  width: 3px;
  height: 16px;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
}

.server-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.server-btn {
  padding: 0.625rem 1.5rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  transition: var(--transition);
}

.server-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.server-btn.active {
  background: var(--gradient-primary);
  border-color: transparent;
  box-shadow: 0 0 20px var(--primary-glow);
}

.episode-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.episode-btn {
  padding: 0.625rem 1.25rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  min-width: 70px;
  transition: var(--transition);
}

.episode-btn:hover {
  border-color: var(--primary-color);
  background: rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.episode-btn.active {
  background: var(--gradient-primary);
  border-color: transparent;
  box-shadow: 0 0 20px var(--primary-glow);
}

@media (max-width: 768px) {
  .movie-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
  }

  .movie-thumb {
    width: 110px;
  }

  .movie-title {
    font-size: 1.375rem;
  }

  .current-episode {
    display: block;
    text-align: center;
  }

  .server-selector,
  .episode-selector {
    padding: 1.25rem;
  }
}
</style>
