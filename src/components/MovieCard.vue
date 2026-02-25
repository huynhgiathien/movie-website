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
  background: var(--bg-card);
  border-radius: 8px;
  overflow: hidden;
  transition: var(--transition);
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
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
  transition: transform 0.3s ease;
}

.movie-card:hover .movie-poster img {
  transform: scale(1.05);
}

.movie-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
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
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.play-btn:hover {
  transform: scale(1.1);
  background: var(--secondary-color);
}

.movie-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.episode-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.8);
  color: var(--primary-color);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 3px;
}

.movie-info {
  padding: 0.75rem;
}

.movie-title {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.movie-origin {
  font-size: 0.8rem;
  color: var(--text-secondary);
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
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
