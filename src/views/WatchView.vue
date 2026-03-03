<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { movieApi } from '@/api'
import MovieCard from '@/components/MovieCard.vue'
import type { MovieDetail, EpisodeData, Movie } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useStore()

const movie = ref<MovieDetail | null>(null)
const loading = ref(true)
const error = ref('')
const currentServer = ref(0)
const currentEpisode = ref<EpisodeData | null>(null)
const relatedMovies = ref<Movie[]>([])

const episodes = computed(() => {
  if (!movie.value?.episodes?.length) return []
  return movie.value.episodes[currentServer.value]?.server_data || []
})

const servers = computed(() => {
  if (!movie.value?.episodes) return []
  return movie.value.episodes.map((s, i) => ({ name: s.server_name, index: i }))
})

// GlobalPlayer is only used when minimized (navigated away).
// On this page we always render the iframe directly in the flow.

const updateGlobalPlayer = () => {
  if (movie.value && currentEpisode.value?.link_embed) {
    store.commit('SET_MINI_PLAYER', {
      isActive: true,
      isMinimized: false,
      videoUrl: currentEpisode.value.link_embed,
      movieName: movie.value.name,
      movieSlug: movie.value.slug,
      episodeName: currentEpisode.value.name,
      episodeSlug: currentEpisode.value.slug,
      serverIndex: currentServer.value
    })
  }
}

const fetchMovie = async () => {
  loading.value = true
  error.value = ''

  try {
    const slug = route.params.slug as string
    movie.value = await movieApi.getMovieDetail(slug)

    if (movie.value.episodes?.length) {
      const tapQuery = route.query.tap as string
      const savedState = store.state.miniPlayer
      const isSameMovie = savedState.isActive && savedState.movieSlug === movie.value.slug

      // Restore server index from store if returning to the same movie
      if (isSameMovie && savedState.serverIndex < movie.value.episodes.length) {
        currentServer.value = savedState.serverIndex
      }

      const activeServer = movie.value.episodes[currentServer.value]

      // Restore episode: query param > store state > first episode
      if (tapQuery && activeServer?.server_data) {
        const found = activeServer.server_data.find(ep => ep.slug === tapQuery)
        currentEpisode.value = found || activeServer.server_data[0]
      } else if (isSameMovie && savedState.episodeSlug && activeServer?.server_data) {
        const found = activeServer.server_data.find(ep => ep.slug === savedState.episodeSlug)
        currentEpisode.value = found || activeServer.server_data[0]
      } else if (activeServer?.server_data?.length) {
        currentEpisode.value = activeServer.server_data[0]
      }
    }

    document.title = `Xem ${movie.value.name} - CINEWORLD`
    updateGlobalPlayer()

    // Fetch related movies
    try {
      const recent = await movieApi.getRecentMovies(1)
      relatedMovies.value = recent.items.slice(0, 4)
    } catch {
      // ignore
    }
  } catch (err) {
    error.value = 'Kh\u00F4ng th\u1EC3 t\u1EA3i phim'
    console.error('Failed to fetch movie:', err)
  } finally {
    loading.value = false
  }
}

const selectEpisode = (ep: EpisodeData) => {
  currentEpisode.value = ep
  router.replace({ query: { tap: ep.slug } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
  updateGlobalPlayer()
}

const selectServer = (index: number) => {
  const prevEpisode = currentEpisode.value
  currentServer.value = index
  const serverData = movie.value?.episodes?.[index]?.server_data
  if (serverData?.length && prevEpisode) {
    // Try to find the same episode on the new server
    const match =
      serverData.find(ep => ep.slug === prevEpisode.slug) ||
      serverData.find(ep => ep.name === prevEpisode.name) ||
      serverData[Math.min(
        movie.value?.episodes?.[index - 1]?.server_data?.indexOf(prevEpisode) ?? 0,
        serverData.length - 1
      )]
    selectEpisode(match || serverData[0])
  } else if (serverData?.length) {
    selectEpisode(serverData[0])
  }
}

// Screen Wake Lock - keep screen on while watching
let wakeLock: WakeLockSentinel | null = null

const requestWakeLock = async () => {
  if (!('wakeLock' in navigator)) return
  try {
    wakeLock = await navigator.wakeLock.request('screen')
    wakeLock.addEventListener('release', () => { wakeLock = null })
  } catch {
    // Wake lock request failed (e.g. low battery)
  }
}

const releaseWakeLock = () => {
  wakeLock?.release()
  wakeLock = null
}

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible' && currentEpisode.value?.link_embed) {
    requestWakeLock()
  }
}

onMounted(() => {
  fetchMovie()
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  releaseWakeLock()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

watch(() => route.params.slug, () => {
  fetchMovie()
})

watch(currentEpisode, () => {
  updateGlobalPlayer()
  if (currentEpisode.value?.link_embed) {
    requestWakeLock()
  } else {
    releaseWakeLock()
  }
})
</script>

<template>
  <div class="watch-page">
    <div v-if="loading" class="loading-spinner" style="min-height: 60vh;"></div>

    <div v-else-if="error" class="container">
      <div class="error-message">{{ error }}</div>
    </div>

    <template v-else-if="movie">
      <!-- Video Player (always rendered directly in flow, not fixed) -->
      <section class="video-player">
        <div class="player-wrapper">
          <iframe
            v-if="currentEpisode?.link_embed"
            :src="currentEpisode.link_embed"
            frameborder="0"
            allowfullscreen
            allow="autoplay; encrypted-media"
          ></iframe>
          <div v-else class="no-player">
            <p>Kh&ocirc;ng c&oacute; ngu&#7891;n ph&aacute;t cho t&#7853;p n&agrave;y</p>
          </div>
        </div>
      </section>

      <!-- Below Player -->
      <section class="below-player">
        <!-- Movie Info (left) -->
        <div class="movie-info-col">
          <div class="movie-info-row">
            <h1 class="movie-name">{{ movie.name }}</h1>
            <div class="movie-meta-row">
              <span v-if="movie.year" class="meta-text">{{ movie.year }}</span>
              <span v-if="movie.time" class="meta-dot"></span>
              <span v-if="movie.time" class="meta-text">{{ movie.time }}</span>
              <span v-if="movie.quality" class="meta-dot"></span>
              <span v-if="movie.quality" class="meta-quality">{{ movie.quality }}</span>
            </div>
            <p v-if="currentEpisode" class="current-ep">
              &#272;ang xem: <strong>{{ currentEpisode.name }}</strong>
            </p>
          </div>

          <p class="movie-desc" v-if="movie.origin_name">{{ movie.origin_name }}</p>

          <div class="movie-actions">
            <router-link :to="`/phim/${movie.slug}`" class="btn btn-secondary action-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              Chi ti&#7871;t
            </router-link>
          </div>
        </div>

        <!-- Sidebar (right) -->
        <div class="sidebar">
          <!-- Server Section -->
          <div v-if="servers.length > 1" class="sidebar-block">
            <h3 class="sidebar-title">Server</h3>
            <div class="server-list">
              <button
                v-for="server in servers"
                :key="server.index"
                :class="['server-btn', { active: currentServer === server.index }]"
                @click="selectServer(server.index)"
              >{{ server.name }}</button>
            </div>
          </div>

          <!-- Episode Section -->
          <div v-if="episodes.length" class="sidebar-block">
            <h3 class="sidebar-title">Danh s&aacute;ch t&#7853;p</h3>
            <div class="episode-grid">
              <button
                v-for="ep in episodes"
                :key="ep.slug"
                :class="['episode-btn', { active: currentEpisode?.slug === ep.slug }]"
                @click="selectEpisode(ep)"
              >{{ ep.name }}</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Related Movies -->
      <section v-if="relatedMovies.length" class="related-section">
        <h2 class="related-title">Phim &#273;&#7873; xu&#7845;t</h2>
        <div class="related-grid">
          <MovieCard v-for="m in relatedMovies" :key="m._id" :movie="m" />
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.watch-page {
  background: #0A0A0A;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}

/* Video Player */
.video-player {
  background: #000000;
  width: 100%;
  overflow: hidden;
}

.player-wrapper {
  position: relative;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  aspect-ratio: 16/9;
  overflow: hidden;
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
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
}

/* Below Player */
.below-player {
  display: flex;
  gap: 32px;
  padding: 32px;
  background: #0A0A0A;
  width: 100%;
  overflow: hidden;
}

.movie-info-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.movie-info-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.movie-name {
  font-family: 'Sora', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
}

.movie-meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-text {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.meta-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
}

.meta-quality {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #FFD700;
}

.current-ep {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.current-ep strong {
  color: #E50914;
}

.movie-desc {
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.53);
  line-height: 1.7;
}

.movie-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-sm {
  padding: 8px 16px;
  font-size: 13px;
}

/* Sidebar */
.sidebar {
  width: 380px;
  flex-shrink: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-title {
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.server-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.server-btn {
  font-family: 'Sora', sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.6);
  transition: var(--transition);
}

.server-btn:hover {
  border-color: rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
}

.server-btn.active {
  background: #E50914;
  border-color: #E50914;
  color: #FFFFFF;
}

.episode-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 100%;
}

.episode-btn {
  font-family: 'Sora', sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 8px 14px;
  min-width: 50px;
  text-align: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.6);
  transition: var(--transition);
}

.episode-btn:hover {
  border-color: rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
}

.episode-btn.active {
  background: #E50914;
  border-color: #E50914;
  color: #FFFFFF;
}

/* Related Movies */
.related-section {
  padding: 32px;
  background: #0A0A0A;
  width: 100%;
  overflow: hidden;
}

.related-title {
  font-family: 'Sora', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 20px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 1024px) {
  .below-player {
    flex-direction: column;
    padding: 24px;
  }

  .sidebar {
    width: 100%;
    min-width: 0;
  }

  .related-section {
    padding: 24px;
  }

  .related-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .below-player {
    padding: 16px;
  }

  .movie-name {
    font-size: 20px;
  }

  .related-section {
    padding: 16px;
  }

  .related-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
