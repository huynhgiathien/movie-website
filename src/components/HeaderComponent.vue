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
    <div class="container header-container">
      <router-link to="/" class="logo">
        <span class="logo-text">Free Movie</span>
      </router-link>

      <nav class="nav" :class="{ 'nav-open': isMenuOpen }">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/" class="nav-link" @click="isMenuOpen = false">Trang Chủ</router-link>
          </li>
          <li class="nav-item dropdown">
            <span class="nav-link">Phim</span>
            <ul class="dropdown-menu">
              <li><router-link to="/phim-bo" @click="isMenuOpen = false">Phim Bộ</router-link></li>
              <li><router-link to="/phim-le" @click="isMenuOpen = false">Phim Lẻ</router-link></li>
              <li><router-link to="/hoat-hinh" @click="isMenuOpen = false">Hoạt Hình</router-link></li>
              <li><router-link to="/tv-shows" @click="isMenuOpen = false">TV Shows</router-link></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <span class="nav-link">Thể Loại</span>
            <ul class="dropdown-menu dropdown-grid">
              <li v-for="genre in genres" :key="genre._id">
                <router-link :to="`/the-loai/${genre.slug}`" @click="isMenuOpen = false">
                  {{ genre.name }}
                </router-link>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <span class="nav-link">Quốc Gia</span>
            <ul class="dropdown-menu dropdown-grid">
              <li v-for="country in countries" :key="country._id">
                <router-link :to="`/quoc-gia/${country.slug}`" @click="isMenuOpen = false">
                  {{ country.name }}
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <div class="header-actions">
        <div class="search-box" :class="{ 'search-open': isSearchOpen }">
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="search"
            inputmode="search"
            placeholder="Tìm kiếm phim..."
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" type="button" @click="handleSearch">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <button class="search-close-btn" type="button" @click="isSearchOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <button class="search-toggle" type="button" @click="openSearch">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
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
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  z-index: 1000;
}

.header-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.nav {
  display: flex;
  align-items: center;
}

.nav-list {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: block;
  padding: 0.625rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
}

.nav-link:hover {
  color: var(--text-color);
  background: var(--bg-elevated);
}

.nav-link.router-link-active {
  color: var(--primary-color);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  min-width: 200px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: 0.5rem;
  opacity: 0;
  visibility: hidden;
  transition: var(--transition);
  box-shadow: var(--shadow-lg);
}

.dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.dropdown-menu li a {
  display: block;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: var(--transition);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
}

.dropdown-menu li a:hover {
  background: var(--bg-elevated);
  color: var(--text-color);
}

.dropdown-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  min-width: 320px;
  gap: 0.25rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--bg-elevated);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-full);
  overflow: hidden;
  transition: var(--transition);
}

.search-box:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-glow);
}

.search-box input {
  width: 220px;
  padding: 0.75rem 1.25rem;
  background: transparent;
  border: none;
  color: var(--text-color);
  font-size: 0.875rem;
}

.search-box input::placeholder {
  color: var(--text-muted);
}

.search-box input:focus {
  outline: none;
}

.search-btn {
  padding: 0.75rem 1rem;
  background: transparent;
  color: var(--text-secondary);
  transition: var(--transition);
}

.search-btn:hover {
  color: var(--primary-color);
}

.search-close-btn {
  display: none;
  padding: 0.75rem;
  background: transparent;
  color: var(--text-secondary);
  transition: var(--transition);
}

.search-close-btn:hover {
  color: var(--primary-color);
}

.search-toggle {
  display: none;
  padding: 0.625rem;
  background: var(--bg-elevated);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  color: var(--text-color);
  transition: var(--transition);
}

.search-toggle:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 0.625rem;
  background: var(--bg-elevated);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  transition: var(--transition);
}

.menu-toggle:hover {
  border-color: var(--primary-color);
}

.menu-toggle span {
  width: 20px;
  height: 2px;
  background: var(--text-color);
  border-radius: var(--radius-full);
  transition: var(--transition);
}

@media (max-width: 1024px) {
  .header-container {
    position: relative;
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
    background: var(--bg-color);
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-lg);
    z-index: 1001;
  }

  .search-box.search-open input {
    width: 100%;
    flex: 1;
    font-size: 16px; /* Prevents iOS zoom on focus */
    -webkit-appearance: none;
    appearance: none;
  }

  .search-box.search-open .search-close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-box.search-open .search-btn {
    padding: 0.75rem 0.5rem;
  }

  .search-toggle {
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
    background: #0a0a0f;
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
    gap: 0.5rem;
    width: 100%;
  }

  .nav-item {
    width: 100%;
  }

  .nav-link {
    padding: 1rem;
    font-size: 1rem;
    color: var(--text-color);
  }

  .dropdown-menu {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    background: rgba(30, 30, 40, 0.6);
    backdrop-filter: none;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 0.75rem;
    margin-top: 0.5rem;
    margin-left: 0;
    box-shadow: none;
    min-width: 100%;
    width: 100%;
  }

  .dropdown-menu li a {
    color: var(--text-secondary);
    padding: 0.75rem 1rem;
  }

  .dropdown-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    min-width: auto;
    gap: 0.25rem;
  }

  .dropdown-grid li {
    flex: none;
  }

  .menu-toggle {
    display: flex;
  }
}
</style>
