<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const searchQuery = ref('')
const isMenuOpen = ref(false)
const isSearchOpen = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)

const genres = computed(() => store.state.genres.slice(0, 10))
const countries = computed(() => store.state.countries.slice(0, 10))

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'Search', query: { q: searchQuery.value.trim() } })
    searchQuery.value = ''
    isSearchOpen.value = false
  }
}

const openSearch = () => {
  isSearchOpen.value = true
  nextTick(() => {
    searchInput.value?.focus()
  })
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <header class="header">
    <div class="header-inner">
      <!-- Logo Area -->
      <router-link to="/" class="logo">
        <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/>
          <path d="m6.2 5.3 3.1 3.9"/>
          <path d="m12.4 3.4 3.1 4"/>
          <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>
        </svg>
        <span class="logo-text">CINEWORLD</span>
      </router-link>

      <!-- Navigation -->
      <nav class="nav" :class="{ 'nav-open': isMenuOpen }">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/" class="nav-link nav-link--active" @click="isMenuOpen = false">Trang ch&#7911;</router-link>
          </li>
          <li class="nav-item dropdown">
            <router-link to="/phim-le" class="nav-link" @click="isMenuOpen = false">Phim l&#7867;</router-link>
            <ul class="dropdown-menu">
              <li><router-link to="/phim-le" @click="isMenuOpen = false">Phim L&#7867;</router-link></li>
              <li><router-link to="/hoat-hinh" @click="isMenuOpen = false">Ho&#7841;t H&igrave;nh</router-link></li>
              <li><router-link to="/tv-shows" @click="isMenuOpen = false">TV Shows</router-link></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <router-link to="/phim-bo" class="nav-link" @click="isMenuOpen = false">Phim b&#7897;</router-link>
          </li>
          <li class="nav-item dropdown">
            <span class="nav-link">Qu&#7889;c gia</span>
            <ul class="dropdown-menu dropdown-grid">
              <li v-for="country in countries" :key="country._id">
                <router-link :to="`/quoc-gia/${country.slug}`" @click="isMenuOpen = false">
                  {{ country.name }}
                </router-link>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <span class="nav-link">Th&#7875; lo&#7841;i</span>
            <ul class="dropdown-menu dropdown-grid">
              <li v-for="genre in genres" :key="genre._id">
                <router-link :to="`/the-loai/${genre.slug}`" @click="isMenuOpen = false">
                  {{ genre.name }}
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <!-- Right Area -->
      <div class="header-right">
        <button class="search-icon-btn" type="button" @click="openSearch">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
        <div class="search-box" :class="{ 'search-open': isSearchOpen }">
          <svg class="search-box-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="search"
            inputmode="search"
            placeholder="T&igrave;m ki&#7871;m phim..."
            @keyup.enter="handleSearch"
          />
          <button class="search-close-btn" type="button" @click="isSearchOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <button class="menu-toggle" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1000;
}

.header-inner {
  max-width: 1440px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 56px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.logo-icon {
  color: #E50914;
}

.logo-text {
  font-family: 'Sora', sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: 2px;
}

.logo:hover {
  color: inherit;
}

.nav {
  display: flex;
  align-items: center;
}

.nav-list {
  display: flex;
  align-items: center;
  gap: 36px;
}

.nav-item {
  position: relative;
}

.nav-link {
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.67);
  cursor: pointer;
  transition: var(--transition);
  padding: 8px 0;
}

.nav-link:hover {
  color: #FFFFFF;
}

.nav-link--active,
.nav-link.router-link-exact-active {
  color: #FFFFFF;
  font-weight: 600;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  min-width: 180px;
  background: #1A1A1A;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px;
  opacity: 0;
  visibility: hidden;
  transition: var(--transition);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}

.dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.dropdown-menu li a {
  display: block;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  transition: var(--transition);
}

.dropdown-menu li a:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #FFFFFF;
}

.dropdown-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  min-width: 280px;
  gap: 2px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-icon-btn {
  display: none;
  padding: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  transition: var(--transition);
}

.search-icon-btn:hover {
  color: #FFFFFF;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 18px;
  padding: 0 16px;
  height: 36px;
  width: 200px;
  transition: var(--transition);
}

.search-box:focus-within {
  background: rgba(255, 255, 255, 0.12);
  width: 260px;
}

.search-box-icon {
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}

.search-box input {
  flex: 1;
  background: transparent;
  border: none;
  color: #FFFFFF;
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  outline: none;
  width: 100%;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.search-close-btn {
  display: none;
  padding: 4px;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  background: transparent;
}

.menu-toggle span {
  width: 20px;
  height: 2px;
  background: #FFFFFF;
  border-radius: 2px;
  transition: var(--transition);
}

@media (max-width: 1024px) {
  .header-inner {
    padding: 0 24px;
  }

  .nav-list {
    gap: 24px;
  }

  .search-box {
    display: none;
  }

  .search-box.search-open {
    display: flex;
    position: fixed;
    top: 80px;
    left: 16px;
    right: 16px;
    width: auto;
    background: #1A1A1A;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
    z-index: 1001;
    height: 44px;
    border-radius: 22px;
    padding: 0 16px;
  }

  .search-box.search-open input {
    font-size: 16px;
  }

  .search-box.search-open .search-close-btn {
    display: flex;
    align-items: center;
  }

  .search-icon-btn {
    display: flex;
  }
}

@media (max-width: 768px) {
  .nav {
    display: block;
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    height: calc(100vh - 72px);
    height: calc(100dvh - 72px);
    background: #0A0A0A;
    padding: 1.5rem;
    padding-bottom: 100px;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    z-index: 999;
  }

  .nav.nav-open {
    transform: translateX(0);
  }

  .nav-list {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .nav-link {
    display: block;
    padding: 12px;
    font-size: 15px;
    color: #FFFFFF;
  }

  .dropdown-menu {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 8px;
    padding: 8px;
    margin-top: 4px;
    box-shadow: none;
    min-width: 100%;
  }

  .dropdown-grid {
    min-width: auto;
  }

  .menu-toggle {
    display: flex;
  }
}
</style>
