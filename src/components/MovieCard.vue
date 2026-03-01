<script setup lang="ts">
import { computed } from 'vue'
import { movieApi } from '@/api'
import type { Movie } from '@/types'

const props = defineProps<{
  movie: Movie
}>()

const posterUrl = computed(() => {
  return movieApi.getImageUrl(props.movie.poster_url || props.movie.thumb_url)
})

const movieUrl = computed(() => `/phim/${props.movie.slug}`)
</script>

<template>
  <router-link :to="movieUrl" class="movie-card">
    <div class="movie-poster">
      <img
        :src="posterUrl"
        :alt="movie.name"
        loading="lazy"
        @error="($event.target as HTMLImageElement).src = '/placeholder.svg'"
      />
      <div class="movie-overlay">
        <button class="play-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>
      <div class="movie-badges">
        <span v-if="movie.quality" class="badge badge-quality">{{ movie.quality }}</span>
        <span v-if="movie.lang" class="badge badge-lang">{{ movie.lang }}</span>
      </div>
      <span v-if="movie.episode_current" class="episode-badge">{{ movie.episode_current }}</span>
    </div>
    <div class="movie-info">
      <h3 class="movie-title">{{ movie.name }}</h3>
      <p class="movie-origin">{{ movie.origin_name }}</p>
      <div class="movie-meta">
        <span v-if="movie.year">{{ movie.year }}</span>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.movie-card {
  display: block;
  background: var(--gradient-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition);
  border: 1px solid var(--border-color);
  position: relative;
}

.movie-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: var(--transition);
}

.movie-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-lg), 0 0 40px rgba(99, 102, 241, 0.15);
  border-color: var(--glass-border);
}

.movie-card:hover::before {
  opacity: 1;
}

.movie-poster {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
}

.movie-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-slow);
}

.movie-card:hover .movie-poster img {
  transform: scale(1.1);
}

.movie-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.4) 50%, transparent 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition);
}

.movie-card:hover .movie-overlay {
  opacity: 1;
}

.play-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  box-shadow: 0 0 30px var(--primary-glow);
  transform: scale(0.8);
}

.movie-card:hover .play-btn {
  transform: scale(1);
}

.play-btn:hover {
  transform: scale(1.15);
  box-shadow: 0 0 40px var(--primary-glow);
}

.movie-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 2;
}

.episode-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 0.375rem 0.625rem;
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  color: var(--accent-color);
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: var(--radius-sm);
  border: 1px solid var(--glass-border);
  z-index: 2;
}

.movie-info {
  padding: 1rem;
}

.movie-title {
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.375rem;
  letter-spacing: -0.01em;
}

.movie-origin {
  font-size: 0.8rem;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.movie-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
}

.movie-meta span {
  padding: 0.25rem 0.5rem;
  background: var(--bg-elevated);
  border-radius: var(--radius-sm);
}
</style>
