import { createStore } from 'vuex'
import { movieApi } from '@/api'
import type { Movie, MovieDetail, GenreItem } from '@/types'

interface MiniPlayerState {
  isActive: boolean
  isMinimized: boolean
  videoUrl: string | null
  movieName: string | null
  movieSlug: string | null
  episodeName: string | null
}

interface State {
  recentMovies: Movie[]
  seriesMovies: Movie[]
  singleMovies: Movie[]
  searchResults: Movie[]
  currentMovie: MovieDetail | null
  genres: GenreItem[]
  countries: GenreItem[]
  loading: boolean
  error: string | null
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
  miniPlayer: MiniPlayerState
}

export default createStore<State>({
  state: {
    recentMovies: [],
    seriesMovies: [],
    singleMovies: [],
    searchResults: [],
    currentMovie: null,
    genres: [],
    countries: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0
    },
    miniPlayer: {
      isActive: false,
      isMinimized: false,
      videoUrl: null,
      movieName: null,
      movieSlug: null,
      episodeName: null
    }
  },

  mutations: {
    SET_LOADING(state, loading: boolean) {
      state.loading = loading
    },
    SET_ERROR(state, error: string | null) {
      state.error = error
    },
    SET_RECENT_MOVIES(state, movies: Movie[]) {
      state.recentMovies = movies
    },
    SET_SERIES_MOVIES(state, movies: Movie[]) {
      state.seriesMovies = movies
    },
    SET_SINGLE_MOVIES(state, movies: Movie[]) {
      state.singleMovies = movies
    },
    SET_SEARCH_RESULTS(state, movies: Movie[]) {
      state.searchResults = movies
    },
    SET_CURRENT_MOVIE(state, movie: MovieDetail | null) {
      state.currentMovie = movie
    },
    SET_GENRES(state, genres: GenreItem[]) {
      state.genres = genres
    },
    SET_COUNTRIES(state, countries: GenreItem[]) {
      state.countries = countries
    },
    SET_PAGINATION(state, pagination: { currentPage: number; totalPages: number; totalItems: number }) {
      state.pagination = pagination
    },
    SET_MINI_PLAYER(state, payload: Partial<MiniPlayerState>) {
      state.miniPlayer = { ...state.miniPlayer, ...payload }
    },
    CLOSE_MINI_PLAYER(state) {
      state.miniPlayer = {
        isActive: false,
        isMinimized: false,
        videoUrl: null,
        movieName: null,
        movieSlug: null,
        episodeName: null
      }
    },
    MINIMIZE_PLAYER(state) {
      state.miniPlayer.isMinimized = true
    },
    MAXIMIZE_PLAYER(state) {
      state.miniPlayer.isMinimized = false
    }
  },

  actions: {
    async fetchRecentMovies({ commit }, page = 1) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const data = await movieApi.getRecentMovies(page)
        commit('SET_RECENT_MOVIES', data.items)
        commit('SET_PAGINATION', {
          currentPage: data.pagination?.currentPage || page,
          totalPages: data.pagination?.totalPages || 1,
          totalItems: data.pagination?.totalItems || data.items.length
        })
      } catch (error) {
        commit('SET_ERROR', 'Failed to fetch movies')
        console.error(error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchMovieList({ commit }, { type, params }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const data = await movieApi.getMovieList(type, params)
        if (type === 'phim-bo') {
          commit('SET_SERIES_MOVIES', data.items)
        } else if (type === 'phim-le') {
          commit('SET_SINGLE_MOVIES', data.items)
        }
        commit('SET_PAGINATION', {
          currentPage: data.params.pagination.currentPage,
          totalPages: data.params.pagination.totalPages,
          totalItems: data.params.pagination.totalItems
        })
        return data
      } catch (error) {
        commit('SET_ERROR', 'Failed to fetch movies')
        console.error(error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchMovieDetail({ commit }, slug: string) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const movie = await movieApi.getMovieDetail(slug)
        commit('SET_CURRENT_MOVIE', movie)
        return movie
      } catch (error) {
        commit('SET_ERROR', 'Failed to fetch movie details')
        console.error(error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async searchMovies({ commit }, { keyword, params }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const data = await movieApi.searchMovies(keyword, params)
        commit('SET_SEARCH_RESULTS', data.items)
        commit('SET_PAGINATION', {
          currentPage: data.params.pagination.currentPage,
          totalPages: data.params.pagination.totalPages,
          totalItems: data.params.pagination.totalItems
        })
        return data
      } catch (error) {
        commit('SET_ERROR', 'Failed to search movies')
        console.error(error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchGenres({ commit }) {
      try {
        const genres = await movieApi.getGenres()
        commit('SET_GENRES', genres)
      } catch (error) {
        console.error('Failed to fetch genres:', error)
      }
    },

    async fetchCountries({ commit }) {
      try {
        const countries = await movieApi.getCountries()
        commit('SET_COUNTRIES', countries)
      } catch (error) {
        console.error('Failed to fetch countries:', error)
      }
    },

    async fetchMoviesByGenre({ commit }, { slug, params }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const data = await movieApi.getMoviesByGenre(slug, params)
        commit('SET_PAGINATION', {
          currentPage: data.params.pagination.currentPage,
          totalPages: data.params.pagination.totalPages,
          totalItems: data.params.pagination.totalItems
        })
        return data
      } catch (error) {
        commit('SET_ERROR', 'Failed to fetch movies')
        console.error(error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchMoviesByCountry({ commit }, { slug, params }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const data = await movieApi.getMoviesByCountry(slug, params)
        commit('SET_PAGINATION', {
          currentPage: data.params.pagination.currentPage,
          totalPages: data.params.pagination.totalPages,
          totalItems: data.params.pagination.totalItems
        })
        return data
      } catch (error) {
        commit('SET_ERROR', 'Failed to fetch movies')
        console.error(error)
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    errorMessage: (state) => state.error
  }
})
