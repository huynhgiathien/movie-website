<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const searchQuery = ref('')
const isMenuOpen = ref(false)
const isSearchOpen = ref(false)

const genres = computed(() => store.state.genres.slice(0, 10))
const countries = computed(() => store.state.countries.slice(0, 10))

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'Search', query: { q: searchQuery.value.trim() } })
    searchQuery.value = ''
    isSearchOpen.value = false
  }
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <header class="header">
    <div class="container header-container">
      <router-link to="/" class="logo">
        <span class="logo-text">PhimHay</span>
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
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm phim..."
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
        <button class="search-toggle" @click="isSearchOpen = !isSearchOpen">
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
  height: 70px;
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
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
  font-weight: 700;
  color: var(--primary-color);
}

.nav-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: block;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary-color);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 180px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: var(--transition);
  box-shadow: var(--shadow);
}

.dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-menu li a {
  display: block;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  transition: var(--transition);
}

.dropdown-menu li a:hover {
  background: var(--bg-card);
  color: var(--primary-color);
}

.dropdown-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  min-width: 300px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 25px;
  overflow: hidden;
}

.search-box input {
  width: 200px;
  padding: 0.6rem 1rem;
  background: transparent;
  border: none;
  color: var(--text-color);
  font-size: 0.9rem;
}

.search-box input::placeholder {
  color: var(--text-muted);
}

.search-box input:focus {
  outline: none;
}

.search-btn {
  padding: 0.6rem 1rem;
  background: transparent;
  color: var(--text-secondary);
  transition: var(--transition);
}

.search-btn:hover {
  color: var(--primary-color);
}

.search-toggle {
  display: none;
  padding: 0.5rem;
  background: transparent;
  color: var(--text-color);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 0.5rem;
  background: transparent;
}

.menu-toggle span {
  width: 24px;
  height: 2px;
  background: var(--text-color);
  transition: var(--transition);
}

@media (max-width: 1024px) {
  .search-box {
    display: none;
  }

  .search-box.search-open {
    display: flex;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin: 0.5rem 1rem;
  }

  .search-box.search-open input {
    width: 100%;
  }

  .search-toggle {
    display: block;
  }
}

@media (max-width: 768px) {
  .nav {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg-color);
    padding: 1rem;
    transform: translateX(-100%);
    transition: var(--transition);
    overflow-y: auto;
  }

  .nav.nav-open {
    transform: translateX(0);
  }

  .nav-list {
    flex-direction: column;
    align-items: stretch;
  }

  .dropdown-menu {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    background: transparent;
    border: none;
    padding-left: 1rem;
  }

  .dropdown-grid {
    display: flex;
    flex-wrap: wrap;
    min-width: auto;
  }

  .menu-toggle {
    display: flex;
  }
}
</style>
