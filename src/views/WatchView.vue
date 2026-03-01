<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
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

// Mini player state
const playerContainer = ref<HTMLElement | null>(null)
const showMiniPlayer = ref(false)
const miniPlayerClosed = ref(false)

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

// Mini player scroll handler
const handleScroll = () => {
  if (!playerContainer.value || miniPlayerClosed.value) return

  const rect = playerContainer.value.getBoundingClientRect()
  const isOutOfView = rect.bottom < 100
  showMiniPlayer.value = isOutOfView
}

const closeMiniPlayer = () => {
  miniPlayerClosed.value = true
  showMiniPlayer.value = false
}

const scrollToPlayer = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  showMiniPlayer.value = false
  miniPlayerClosed.value = false
}

onMounted(() => {
  fetchMovie()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(() => route.params.slug, () => {
  fetchMovie()
  miniPlayerClosed.value = false
  showMiniPlayer.value = false
})
</script>

<template>
  <div class="watch-page">
    <div v-if="loading" class="loading-spinner"></div>

    <div v-else-if="error" class="container">
      <div class="error-message">{{ error }}</div>
    </div>

    <template v-else-if="movie">
      <!-- Main Player -->
      <div ref="playerContainer" class="player-container">
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

      <!-- Mini Player -->
      <Teleport to="body">
        <div
          v-if="showMiniPlayer && currentEpisode?.link_embed"
          class="mini-player"
        >
          <div class="mini-player-header">
            <span class="mini-player-title">{{ movie.name }}</span>
            <div class="mini-player-actions">
              <button class="mini-player-btn" @click="scrollToPlayer" title="Mở rộng">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </button>
              <button class="mini-player-btn" @click="closeMiniPlayer" title="Đóng">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          <div class="mini-player-video">
            <iframe
              :src="currentEpisode.link_embed"
              frameborder="0"
              allowfullscreen
              allow="autoplay; encrypted-media"
            ></iframe>
          </div>
        </div>
      </Teleport>

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

/* Mini Player Styles */
.mini-player {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  background: #0a0a0f;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
  z-index: 9999;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.mini-player-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: rgba(20, 20, 28, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mini-player-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.mini-player-actions {
  display: flex;
  gap: 8px;
}

.mini-player-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mini-player-btn:hover {
  background: rgba(99, 102, 241, 0.3);
  color: #f1f5f9;
}

.mini-player-video {
  position: relative;
  aspect-ratio: 16/9;
  background: #000;
}

.mini-player-video iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@media (max-width: 480px) {
  .mini-player {
    bottom: 10px;
    right: 10px;
    left: 10px;
    width: auto;
  }
}
</style>
