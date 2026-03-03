<script setup lang="ts">
import { computed } from 'vue'
import { movieApi } from '@/api'
import type { Movie } from '@/types'

const props = defineProps<{
  movie: Movie
}>()

const posterUrl = computed(() => {
  return movieApi.getImageUrl(props.movie.thumb_url || props.movie.poster_url)
})

const movieUrl = computed(() => `/phim/${props.movie.slug}`)

const genre = computed(() => {
  if (props.movie.category && props.movie.category.length > 0) {
    return props.movie.category[0].name
  }
  return ''
})
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
        <!-- Rating Badge -->
        <div v-if="movie.quality" class="rating-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span>{{ movie.quality }}</span>
        </div>
        <!-- Play Button -->
        <div class="play-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
      <span v-if="movie.episode_current" class="episode-badge">{{ movie.episode_current }}</span>
    </div>
    <div class="movie-info">
      <h3 class="movie-title">{{ movie.name }}</h3>
      <div class="movie-meta">
        <span v-if="movie.year" class="meta-year">{{ movie.year }}</span>
        <span v-if="genre" class="meta-genre">{{ genre }}</span>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.movie-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: var(--transition);
  min-width: 0;
  max-width: 100%;
}

.movie-card:hover {
  color: inherit;
}

.movie-poster {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: #1A1A1A;
  aspect-ratio: 2/3;
}

.movie-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-slow);
}

.movie-card:hover .movie-poster img {
  transform: scale(1.05);
}

.movie-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 50%);
  opacity: 0;
  transition: var(--transition);
}

.movie-card:hover .movie-overlay {
  opacity: 1;
}

.rating-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #FFD700;
}

.play-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(229, 9, 20, 0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  transform: scale(0.8);
}

.movie-card:hover .play-btn {
  transform: scale(1);
  background: rgba(229, 9, 20, 0.8);
}

.episode-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.7);
  color: #FFFFFF;
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
  z-index: 2;
}

.movie-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.movie-title {
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.93);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.movie-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-year,
.meta-genre {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}
</style>
