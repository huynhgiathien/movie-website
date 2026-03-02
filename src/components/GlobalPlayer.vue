<script setup lang="ts">
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

const store = useStore()
const router = useRouter()
const route = useRoute()

const miniPlayer = computed(() => store.state.miniPlayer)

// Check if we're on the watch page for the current movie
const isOnWatchPage = computed(() => {
  return route.name === 'WatchMovie' && route.params.slug === miniPlayer.value.movieSlug
})

// Only show as minimized PIP when navigated away from the watch page
const showMiniPlayer = computed(() => {
  return miniPlayer.value.isActive && miniPlayer.value.videoUrl && !isOnWatchPage.value
})

// Watch route changes to minimize/maximize
watch(isOnWatchPage, (onWatchPage) => {
  if (onWatchPage) {
    store.commit('MAXIMIZE_PLAYER')
  } else if (miniPlayer.value.isActive) {
    store.commit('MINIMIZE_PLAYER')
  }
}, { immediate: true })

const closeMiniPlayer = () => {
  store.commit('CLOSE_MINI_PLAYER')
}

const goToMovie = () => {
  if (miniPlayer.value.movieSlug) {
    router.push(`/xem-phim/${miniPlayer.value.movieSlug}`)
  }
}
</script>

<template>
  <Teleport to="body">
    <!-- Only render as a minimized PIP when NOT on the watch page -->
    <div
      v-if="showMiniPlayer"
      class="global-player is-minimized"
    >
      <div class="mini-player-header">
        <div class="mini-player-info">
          <span class="mini-player-title">{{ miniPlayer.movieName }}</span>
          <span v-if="miniPlayer.episodeName" class="mini-player-episode">
            {{ miniPlayer.episodeName }}
          </span>
        </div>
        <div class="mini-player-actions">
          <button class="mini-player-btn" @click="goToMovie" title="M&#7903; r&#7897;ng">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </button>
          <button class="mini-player-btn" @click="closeMiniPlayer" title="&#272;&oacute;ng">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="player-video">
        <iframe
          :src="miniPlayer.videoUrl"
          frameborder="0"
          allowfullscreen
          allow="autoplay; encrypted-media; picture-in-picture"
        ></iframe>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.global-player.is-minimized {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
  z-index: 9999;
  background: #000;
}

.player-video {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
}

.player-video iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.mini-player-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: rgba(10, 10, 10, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  gap: 8px;
}

.mini-player-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mini-player-title {
  font-family: 'Sora', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #FFFFFF;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-player-episode {
  font-family: 'Space Mono', monospace;
  font-size: 0.7rem;
  color: #E50914;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-player-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
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
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mini-player-btn:hover {
  background: rgba(229, 9, 20, 0.3);
  color: #FFFFFF;
}

@media (max-width: 480px) {
  .global-player.is-minimized {
    bottom: 10px;
    right: 10px;
    left: 10px;
    width: auto;
  }
}
</style>
