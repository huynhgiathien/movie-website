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

    document.title = `Xem ${movie.value.name} - PhimHay`
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
  padding-bottom: 2rem;
}

.player-container {
  background: #000;
  margin-bottom: 2rem;
}

.player-wrapper {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  aspect-ratio: 16/9;
}

.player-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  color: var(--text-secondary);
}

.watch-info {
  max-width: 1200px;
  margin: 0 auto;
}

.movie-header {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.movie-thumb {
  width: 120px;
  height: auto;
  border-radius: 8px;
}

.movie-meta {
  flex: 1;
}

.movie-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.movie-origin {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.current-episode {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.server-selector,
.episode-selector {
  margin-bottom: 1.5rem;
}

.server-selector h3,
.episode-selector h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.server-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.server-btn {
  padding: 0.5rem 1.5rem;
  background: var(--bg-card);
  color: var(--text-color);
  border-radius: 4px;
  font-size: 0.9rem;
  transition: var(--transition);
}

.server-btn:hover,
.server-btn.active {
  background: var(--primary-color);
}

.episode-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.episode-btn {
  padding: 0.5rem 1rem;
  background: var(--bg-card);
  color: var(--text-color);
  border-radius: 4px;
  font-size: 0.9rem;
  min-width: 60px;
  transition: var(--transition);
}

.episode-btn:hover {
  background: var(--bg-secondary);
}

.episode-btn.active {
  background: var(--primary-color);
}

@media (max-width: 768px) {
  .movie-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .movie-thumb {
    width: 100px;
  }

  .movie-title {
    font-size: 1.25rem;
  }
}
</style>
