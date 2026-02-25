<script setup lang="ts">
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import HeaderComponent from '@/components/HeaderComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'

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
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 70px;
}
</style>
