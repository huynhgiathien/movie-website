<script setup lang="ts">
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import HeaderComponent from '@/components/HeaderComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import GlobalPlayer from '@/components/GlobalPlayer.vue'

const store = useStore()

onMounted(() => {
  store.dispatch('fetchGenres')
  store.dispatch('fetchCountries')
})
</script>

<template>
  <div class="app">
    <HeaderComponent />
    <main class="main-content">
      <router-view />
    </main>
    <FooterComponent />
    <GlobalPlayer />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  padding-top: 72px;
  width: 100%;
  min-width: 0;
  overflow-x: hidden;
}
</style>
