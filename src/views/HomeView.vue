<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { movieApi } from '@/api'
import MovieSection from '@/components/MovieSection.vue'
import MovieCard from '@/components/MovieCard.vue'
import type { Movie } from '@/types'

const recentMovies = ref<Movie[]>([])
const seriesMovies = ref<Movie[]>([])
const singleMovies = ref<Movie[]>([])
const cinemaMovies = ref<Movie[]>([])
const tvShowMovies = ref<Movie[]>([])
const animeMovies = ref<Movie[]>([])
const koreanMovies = ref<Movie[]>([])
const chineseMovies = ref<Movie[]>([])
const vietnamMovies = ref<Movie[]>([])
const hongKongMovies = ref<Movie[]>([])
const filteredMovies = ref<Movie[]>([])
const loading = ref(true)
const filterLoading = ref(false)

// Hero carousel
const heroMovies = ref<Movie[]>([])
const activeHeroIndex = ref(0)
let carouselTimer: ReturnType<typeof setInterval> | null = null

const startCarousel = () => {
  stopCarousel()
  carouselTimer = setInterval(() => {
    if (heroMovies.value.length > 1) {
      activeHeroIndex.value = (activeHeroIndex.value + 1) % heroMovies.value.length
    }
  }, 5000)
}

const stopCarousel = () => {
  if (carouselTimer) {
    clearInterval(carouselTimer)
    carouselTimer = null
  }
}

const goToSlide = (index: number) => {
  activeHeroIndex.value = index
  startCarousel()
}

onBeforeUnmount(() => {
  stopCarousel()
})

const countries = [
  { slug: 'viet-nam', name: 'Việt Nam' },
  { slug: 'han-quoc', name: 'Hàn Quốc' },
  { slug: 'nhat-ban', name: 'Nhật Bản' },
  { slug: 'trung-quoc', name: 'Trung Quốc' },
  { slug: 'thai-lan', name: 'Thái Lan' },
  { slug: 'au-my', name: 'Âu Mỹ' },
  { slug: 'dai-loan', name: 'Đài Loan' },
  { slug: 'hong-kong', name: 'Hồng Kông' },
  { slug: 'an-do', name: 'Ấn Độ' },
]

const activeCategory = ref('all')
const activeCountry = ref('')

const isFiltered = computed(() => activeCategory.value !== 'all' || activeCountry.value !== '')

const categories = [
  { key: 'all', label: 'T\u1EA5t c\u1EA3' },
  { key: 'hanh-dong', label: 'H\u00E0nh \u0111\u1ED9ng' },
  { key: 'tinh-cam', label: 'T\u00ECnh c\u1EA3m' },
  { key: 'hai-huoc', label: 'H\u00E0i h\u01B0\u1EDBc' },
  { key: 'kinh-di', label: 'Kinh d\u1ECB' },
  { key: 'vien-tuong', label: 'Vi\u1EC5n t\u01B0\u1EDFng' },
  { key: 'gay-can', label: 'Gay c\u1EA5n' },
  { key: 'tam-ly', label: 'T\u00E2m l\u00FD' },
  { key: 'tai-lieu', label: 'T\u00E0i li\u1EC7u' },
  { key: 'hoat-hinh', label: 'Ho\u1EA1t h\u00ECnh' },
]

const getImageUrl = (url: string | null) => movieApi.getImageUrl(url)

const fetchFilteredMovies = async () => {
  const cat = activeCategory.value
  const country = activeCountry.value

  if (cat === 'all' && !country) {
    filteredMovies.value = []
    return
  }

  filterLoading.value = true
  try {
    let data
    if (cat !== 'all' && country) {
      // Both category and country active - filter by genre with country param
      data = await movieApi.getMoviesByGenre(cat, { country, limit: 24 })
    } else if (cat !== 'all') {
      // Only category active
      data = await movieApi.getMoviesByGenre(cat, { limit: 24 })
    } else {
      // Only country active
      data = await movieApi.getMoviesByCountry(country, { limit: 24 })
    }
    filteredMovies.value = data.items || []
  } catch (error) {
    console.error('Failed to fetch filtered movies:', error)
    filteredMovies.value = []
  } finally {
    filterLoading.value = false
  }
}

// Watch filter changes and re-fetch
watch([activeCategory, activeCountry], () => {
  fetchFilteredMovies()
})

onMounted(async () => {
  try {
    const [recent, series, single, cinema, tvShows, anime, korean, chinese, vietnam, hongKong] = await Promise.all([
      movieApi.getRecentMovies(1),
      movieApi.getMovieList('phim-bo', { limit: 12 }),
      movieApi.getMovieList('phim-le', { limit: 12 }),
      movieApi.getMovieList('phim-chieu-rap', { limit: 12 }),
      movieApi.getMovieList('tv-shows', { limit: 12 }),
      movieApi.getMovieList('hoat-hinh', { limit: 12 }),
      movieApi.getMoviesByCountry('han-quoc', { limit: 12 }),
      movieApi.getMoviesByCountry('trung-quoc', { limit: 12 }),
      movieApi.getMoviesByCountry('viet-nam', { limit: 12 }),
      movieApi.getMoviesByCountry('hong-kong', { limit: 12 })
    ])

    recentMovies.value = recent.items.slice(0, 12)
    seriesMovies.value = series.items
    singleMovies.value = single.items
    cinemaMovies.value = cinema.items
    tvShowMovies.value = tvShows.items
    animeMovies.value = anime.items
    koreanMovies.value = korean.items
    chineseMovies.value = chinese.items
    vietnamMovies.value = vietnam.items
    hongKongMovies.value = hongKong.items

    // Use the first 5 recent movies for hero carousel
    if (recent.items.length > 0) {
      heroMovies.value = recent.items.slice(0, 5)
      startCarousel()
    }
  } catch (error) {
    console.error('Failed to fetch movies:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="home-page">
    <!-- Hero Carousel -->
    <section v-if="heroMovies.length" class="hero-section">
      <div class="hero-slides">
        <div
          v-for="(slide, index) in heroMovies"
          :key="slide._id"
          :class="['hero-slide', { active: activeHeroIndex === index }]"
        >
          <div class="hero-bg" :style="{ backgroundImage: `url(${getImageUrl(slide.poster_url)})` }"></div>
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <h1 class="hero-title">{{ slide.name }}</h1>
            <div class="hero-meta">
              <span v-if="slide.year" class="hero-year">{{ slide.year }}</span>
              <span v-if="slide.time" class="hero-dot"></span>
              <span v-if="slide.time" class="hero-duration">{{ slide.time }}</span>
              <span v-if="slide.quality" class="hero-dot"></span>
              <span v-if="slide.quality" class="hero-rating">{{ slide.quality }}</span>
            </div>
            <p v-if="slide.origin_name" class="hero-desc">{{ slide.origin_name }}</p>
            <div class="hero-ctas">
              <router-link :to="`/xem-phim/${slide.slug}`" class="btn btn-primary hero-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Xem Phim
              </router-link>
              <router-link :to="`/phim/${slide.slug}`" class="btn btn-secondary hero-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
                Chi Ti&#7871;t
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <!-- Carousel Dots -->
      <div class="hero-dots">
        <button
          v-for="(_slide, index) in heroMovies"
          :key="index"
          :class="['hero-dot-btn', { active: activeHeroIndex === index }]"
          @click="goToSlide(index)"
        ></button>
      </div>
    </section>

    <!-- Filter Section -->
    <section class="filter-section">
      <!-- Country Filter -->
      <div class="filter-top">
        <div class="country-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
            <path d="M2 12h20"/>
          </svg>
          <span>Qu&#7889;c gia</span>
        </div>
        <div class="country-tabs">
          <button
            :class="['tab-btn', { active: activeCountry === '' }]"
            @click="activeCountry = ''"
          >T&#7845;t c&#7843;</button>
          <button
            v-for="country in countries"
            :key="country.slug"
            :class="['tab-btn', { active: activeCountry === country.slug }]"
            @click="activeCountry = country.slug"
          >{{ country.name }}</button>
        </div>
      </div>
      <!-- Category Tabs -->
      <div class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat.key"
          :class="['category-tab', { active: activeCategory === cat.key }]"
          @click="activeCategory = cat.key"
        >{{ cat.label }}</button>
      </div>
    </section>

    <!-- Content Area -->
    <div v-if="loading" class="loading-spinner" style="min-height: 400px;"></div>

    <div v-else class="content-area">
      <!-- Filtered Results -->
      <template v-if="isFiltered">
        <div v-if="filterLoading" class="loading-spinner" style="min-height: 300px;"></div>
        <div v-else-if="filteredMovies.length === 0" class="empty-state">
          <h3>Kh&#244;ng t&#236;m th&#7845;y phim</h3>
          <p>Kh&#244;ng c&#243; phim n&#224;o ph&#249; h&#7907;p v&#7899;i b&#7897; l&#7885;c hi&#7879;n t&#7841;i</p>
        </div>
        <section v-else class="filtered-section">
          <h2 class="filtered-title">K&#7871;t qu&#7843; l&#7885;c</h2>
          <div class="movie-grid">
            <MovieCard v-for="movie in filteredMovies" :key="movie._id" :movie="movie" />
          </div>
        </section>
      </template>

      <!-- Default Sections -->
      <template v-else>
        <MovieSection
          title="Phim Mới Cập Nhật"
          :movies="recentMovies"
        />

        <MovieSection
          title="Phim Bộ"
          :movies="seriesMovies"
          view-all-link="/phim-bo"
        />

        <MovieSection
          title="Phim Lẻ Hay"
          :movies="singleMovies"
          view-all-link="/phim-le"
        />

        <MovieSection
          v-if="cinemaMovies.length"
          title="Phim Chiếu Rạp"
          :movies="cinemaMovies"
          view-all-link="/phim-chieu-rap"
        />

        <MovieSection
          v-if="vietnamMovies.length"
          title="Phim Việt Nam"
          :movies="vietnamMovies"
          view-all-link="/quoc-gia/viet-nam"
        />

        <MovieSection
          v-if="hongKongMovies.length"
          title="Phim Hồng Kông"
          :movies="hongKongMovies"
          view-all-link="/quoc-gia/hong-kong"
        />

        <MovieSection
          v-if="koreanMovies.length"
          title="Phim Hàn Quốc"
          :movies="koreanMovies"
          view-all-link="/quoc-gia/han-quoc"
        />

        <MovieSection
          v-if="chineseMovies.length"
          title="Phim Trung Quốc"
          :movies="chineseMovies"
          view-all-link="/quoc-gia/trung-quoc"
        />

        <MovieSection
          v-if="tvShowMovies.length"
          title="TV Shows"
          :movies="tvShowMovies"
          view-all-link="/tv-shows"
        />

        <MovieSection
          v-if="animeMovies.length"
          title="Hoạt Hình"
          :movies="animeMovies"
          view-all-link="/hoat-hinh"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  background: #0A0A0A;
}

/* Hero Carousel */
.hero-section {
  position: relative;
  height: 600px;
  overflow: hidden;
}

.hero-slides {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.8s ease;
  pointer-events: none;
}

.hero-slide.active {
  opacity: 1;
  pointer-events: auto;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 10, 10, 0.93) 0%,
    rgba(10, 10, 10, 0.2) 50%,
    rgba(10, 10, 10, 0.87) 100%
  );
}

.hero-content {
  position: absolute;
  left: 80px;
  top: 140px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 600px;
  z-index: 1;
}

.hero-dots {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 2;
}

.hero-dot-btn {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.hero-dot-btn:hover {
  background: rgba(255, 255, 255, 0.6);
}

.hero-dot-btn.active {
  background: #E50914;
  width: 28px;
  border-radius: 5px;
}

.hero-badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 6px 16px;
  background: #E50914;
  border-radius: 4px;
}

.hero-badge-text {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  color: #FFFFFF;
  letter-spacing: 2px;
}

.hero-title {
  font-family: 'Sora', sans-serif;
  font-size: 56px;
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1.05;
  letter-spacing: -2px;
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hero-year,
.hero-duration {
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.hero-rating {
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  color: #FFD700;
}

.hero-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.27);
}

.hero-desc {
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.73);
  line-height: 1.6;
}

.hero-ctas {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hero-btn {
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

/* Filter Section */
.filter-section {
  background: #0A0A0A;
  padding: 32px 56px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.filter-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.country-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
}

.country-label svg {
  color: rgba(255, 255, 255, 0.5);
}

.country-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-btn {
  font-family: 'Sora', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  padding: 6px 14px;
  border-radius: 16px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: var(--transition);
}

.tab-btn:hover {
  color: #FFFFFF;
  border-color: rgba(255, 255, 255, 0.3);
}

.tab-btn.active {
  background: #E50914;
  color: #FFFFFF;
  border-color: #E50914;
}

.category-tabs {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tab {
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: var(--transition);
}

.category-tab:hover {
  color: rgba(255, 255, 255, 0.8);
}

.category-tab.active {
  color: #FFFFFF;
  font-weight: 600;
  border-bottom-color: #E50914;
}

/* Content Area */
.content-area {
  padding: 40px 56px;
}

.filtered-section {
  margin-bottom: 48px;
}

.filtered-title {
  font-family: 'Sora', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 24px;
}

@media (max-width: 1024px) {
  .hero-content {
    left: 40px;
    top: 120px;
    max-width: 500px;
  }

  .hero-title {
    font-size: 40px;
  }

  .filter-section {
    padding: 24px;
  }

  .content-area {
    padding: 32px 24px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: 500px;
  }

  .hero-content {
    left: 24px;
    right: 24px;
    top: 100px;
    max-width: none;
  }

  .hero-title {
    font-size: 32px;
    letter-spacing: -1px;
  }

  .hero-desc {
    font-size: 14px;
  }

  .hero-ctas {
    flex-wrap: wrap;
  }

  .filter-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .country-tabs {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .hero-section {
    height: 450px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-btn {
    padding: 10px 20px;
    font-size: 13px;
  }

  .filter-section {
    padding: 16px;
  }

  .content-area {
    padding: 24px 16px;
  }
}
</style>
