import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/phim-bo',
    name: 'SeriesMovies',
    component: () => import('@/views/MovieListView.vue'),
    meta: { type: 'phim-bo', title: 'Phim Bộ' }
  },
  {
    path: '/phim-le',
    name: 'SingleMovies',
    component: () => import('@/views/MovieListView.vue'),
    meta: { type: 'phim-le', title: 'Phim Lẻ' }
  },
  {
    path: '/hoat-hinh',
    name: 'Anime',
    component: () => import('@/views/MovieListView.vue'),
    meta: { type: 'hoat-hinh', title: 'Hoạt Hình' }
  },
  {
    path: '/tv-shows',
    name: 'TVShows',
    component: () => import('@/views/MovieListView.vue'),
    meta: { type: 'tv-shows', title: 'TV Shows' }
  },
  {
    path: '/the-loai/:slug',
    name: 'Genre',
    component: () => import('@/views/GenreView.vue')
  },
  {
    path: '/quoc-gia/:slug',
    name: 'Country',
    component: () => import('@/views/CountryView.vue')
  },
  {
    path: '/tim-kiem',
    name: 'Search',
    component: () => import('@/views/SearchView.vue')
  },
  {
    path: '/phim/:slug',
    name: 'MovieDetail',
    component: () => import('@/views/MovieDetailView.vue')
  },
  {
    path: '/xem-phim/:slug',
    name: 'WatchMovie',
    component: () => import('@/views/WatchView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, _from, next) => {
  const title = to.meta.title as string || 'PhimHay - Xem Phim Online'
  document.title = title
  next()
})

export default router
