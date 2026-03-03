<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { movieApi } from '@/api'
import type { MovieDetail } from '@/types'

const route = useRoute()
const movie = ref<MovieDetail | null>(null)
const loading = ref(true)
const error = ref('')
const showTrailer = ref(false)

const trailerEmbedUrl = computed(() => {
  const url = movie.value?.trailer_url
  if (!url) return ''
  // Convert YouTube watch URL to embed URL
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
  if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`
  // Already an embed URL or other format
  if (url.includes('youtube.com/embed/')) return url
  return url
})

const openTrailer = () => {
  showTrailer.value = true
  document.body.style.overflow = 'hidden'
}

const closeTrailer = () => {
  showTrailer.value = false
  document.body.style.overflow = ''
}

const fetchMovie = async () => {
  loading.value = true
  error.value = ''

  try {
    const slug = route.params.slug as string
    movie.value = await movieApi.getMovieDetail(slug)
    document.title = `${movie.value.name} - CINEWORLD`
  } catch (err) {
    error.value = 'Kh\u00F4ng th\u1EC3 t\u1EA3i th\u00F4ng tin phim'
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
  <div class="detail-page">
    <div v-if="loading" class="loading-spinner" style="min-height: 60vh;"></div>

    <div v-else-if="error" class="container">
      <div class="error-message">{{ error }}</div>
    </div>

    <template v-else-if="movie">
      <!-- Detail Hero -->
      <section class="detail-hero">
        <div class="hero-backdrop" :style="{ backgroundImage: `url(${getImageUrl(movie.poster_url)})` }"></div>
        <div class="hero-overlay"></div>
        <div class="detail-content">
          <!-- Poster -->
          <div class="movie-poster">
            <img :src="getImageUrl(movie.thumb_url)" :alt="movie.name" />
          </div>
          <!-- Movie Info -->
          <div class="movie-info">
            <h1 class="movie-title">{{ movie.name }}</h1>
            <p class="movie-origin">{{ movie.origin_name }}</p>

            <div class="movie-meta">
              <span v-if="movie.year" class="meta-item">{{ movie.year }}</span>
              <span class="meta-dot" v-if="movie.year && movie.time"></span>
              <span v-if="movie.time" class="meta-item">{{ movie.time }}</span>
              <span class="meta-dot" v-if="movie.time && movie.quality"></span>
              <span v-if="movie.quality" class="meta-quality">{{ movie.quality }}</span>
              <span v-if="movie.lang" class="meta-lang">{{ movie.lang }}</span>
            </div>

            <div class="movie-genres" v-if="movie.category?.length">
              <router-link
                v-for="cat in movie.category"
                :key="cat.id"
                :to="`/the-loai/${cat.slug}`"
                class="genre-tag"
              >{{ cat.name }}</router-link>
            </div>

            <div class="movie-actions">
              <router-link
                v-if="movie.episodes?.length && movie.episodes[0]?.server_data?.length"
                :to="`/xem-phim/${movie.slug}`"
                class="btn btn-primary action-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Xem Phim
              </router-link>
              <button
                v-if="movie.trailer_url"
                class="btn btn-secondary action-btn"
                @click="openTrailer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m15 10-4 4V6l4 4z"/>
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                </svg>
                Trailer
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Info Section -->
      <section class="info-section">
        <div class="info-left">
          <!-- Movie Details -->
          <div class="detail-block">
            <h2 class="block-title">N&#7897;i Dung Phim</h2>
            <div class="description" v-html="movie.content"></div>

            <div class="detail-grid">
              <div v-if="movie.director?.length" class="detail-row">
                <span class="detail-label">&#272;&#7841;o di&#7877;n</span>
                <span class="detail-value">{{ movie.director.join(', ') }}</span>
              </div>
              <div v-if="movie.country?.length" class="detail-row">
                <span class="detail-label">Qu&#7889;c gia</span>
                <span class="detail-value">
                  <router-link v-for="(c, i) in movie.country" :key="c.id" :to="`/quoc-gia/${c.slug}`">
                    {{ c.name }}<span v-if="i < movie.country.length - 1">, </span>
                  </router-link>
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tr&#7841;ng th&aacute;i</span>
                <span class="detail-value">{{ movie.status }} <span v-if="movie.episode_current">- {{ movie.episode_current }}</span></span>
              </div>
            </div>
          </div>

          <!-- Cast Section -->
          <div v-if="movie.actor?.length" class="detail-block">
            <h2 class="block-title">Di&#7877;n Vi&ecirc;n</h2>
            <div class="cast-grid">
              <div v-for="actor in movie.actor.slice(0, 8)" :key="actor" class="cast-item">
                <div class="cast-avatar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <span class="cast-name">{{ actor }}</span>
              </div>
            </div>
          </div>

          <!-- Episodes -->
          <div v-if="movie.episodes?.length" class="detail-block">
            <h2 class="block-title">Danh S&aacute;ch T&#7853;p</h2>
            <div v-for="server in movie.episodes" :key="server.server_name" class="server-group">
              <h3 class="server-name">{{ server.server_name }}</h3>
              <div class="episode-list">
                <router-link
                  v-for="ep in server.server_data"
                  :key="ep.slug"
                  :to="`/xem-phim/${movie.slug}?tap=${ep.slug}`"
                  class="episode-btn"
                >{{ ep.name }}</router-link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Trailer Modal -->
      <Teleport to="body">
        <div v-if="showTrailer" class="trailer-modal" @click.self="closeTrailer">
          <div class="trailer-container">
            <button class="trailer-close" @click="closeTrailer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <div class="trailer-player">
              <iframe
                :src="trailerEmbedUrl"
                frameborder="0"
                allowfullscreen
                allow="autoplay; encrypted-media; picture-in-picture"
              ></iframe>
            </div>
          </div>
        </div>
      </Teleport>
    </template>
  </div>
</template>

<style scoped>
.detail-page {
  background: #0A0A0A;
  min-height: calc(100vh - 72px);
}

/* Detail Hero */
.detail-hero {
  position: relative;
  height: 560px;
  overflow: hidden;
}

.hero-backdrop {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center top;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 10, 10, 1) 0%,
    rgba(10, 10, 10, 0.53) 40%,
    rgba(10, 10, 10, 0.8) 70%,
    rgba(10, 10, 10, 1) 100%
  );
}

.detail-content {
  position: absolute;
  left: 56px;
  top: 100px;
  display: flex;
  gap: 40px;
  z-index: 1;
}

.movie-poster {
  flex-shrink: 0;
  width: 280px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.movie-poster img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.movie-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 700px;
  padding-top: 20px;
}

.movie-title {
  font-family: 'Sora', sans-serif;
  font-size: 36px;
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1.1;
  letter-spacing: -1px;
}

.movie-origin {
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: -12px;
}

.movie-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-item {
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.meta-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
}

.meta-quality {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #FFD700;
  padding: 3px 8px;
  background: rgba(255, 215, 0, 0.15);
  border-radius: 4px;
}

.meta-lang {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #E50914;
  padding: 3px 8px;
  background: rgba(229, 9, 20, 0.15);
  border-radius: 4px;
}

.movie-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.genre-tag {
  font-family: 'Sora', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  transition: var(--transition);
}

.genre-tag:hover {
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.15);
}

.movie-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 12px 24px;
  font-size: 14px;
}

/* Info Section */
.info-section {
  padding: 40px 56px;
  display: flex;
  gap: 48px;
}

.info-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.detail-block {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.block-title {
  font-family: 'Sora', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
}

.description {
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.6);
}

.description :deep(p) {
  margin-bottom: 12px;
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
}

.detail-row {
  display: flex;
  gap: 16px;
}

.detail-label {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
  min-width: 100px;
}

.detail-value {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.detail-value a {
  color: rgba(255, 255, 255, 0.7);
}

.detail-value a:hover {
  color: #E50914;
}

/* Cast */
.cast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.cast-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
}

.cast-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.cast-name {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
}

/* Server & Episodes */
.server-group {
  margin-bottom: 16px;
}

.server-name {
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 12px;
}

.episode-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.episode-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  min-width: 60px;
  text-align: center;
  transition: var(--transition);
}

.episode-btn:hover {
  background: #E50914;
  border-color: #E50914;
  color: #FFFFFF;
}

@media (max-width: 1024px) {
  .detail-content {
    left: 24px;
    right: 24px;
  }

  .info-section {
    padding: 32px 24px;
  }
}

/* Trailer Modal */
.trailer-modal {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.trailer-container {
  position: relative;
  width: 100%;
  max-width: 900px;
}

.trailer-close {
  position: absolute;
  top: -44px;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: #FFFFFF;
  cursor: pointer;
  transition: background 0.2s ease;
}

.trailer-close:hover {
  background: rgba(229, 9, 20, 0.6);
}

.trailer-player {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}

.trailer-player iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .detail-hero {
    height: auto;
    min-height: 500px;
    padding-bottom: 40px;
  }

  .detail-content {
    position: relative;
    left: auto;
    top: auto;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 100px 24px 0;
  }

  .movie-poster {
    width: 200px;
  }

  .movie-poster img {
    height: 300px;
  }

  .movie-info {
    align-items: center;
    max-width: none;
    padding-top: 0;
  }

  .movie-title {
    font-size: 24px;
  }

  .movie-meta {
    justify-content: center;
  }

  .movie-genres {
    justify-content: center;
  }

  .movie-actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  .info-section {
    flex-direction: column;
    padding: 24px 16px;
  }

  .cast-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
