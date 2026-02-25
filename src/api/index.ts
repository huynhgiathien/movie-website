import axios from 'axios'
import type { Movie, MovieDetail, MovieListResponse, GenreItem, ApiResponse } from '@/types'

const API_BASE = 'https://phimapi.com'
const IMAGE_CDN = 'https://phimimg.com'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000
})

interface ListParams {
  page?: number
  sort_field?: string
  sort_type?: string
  category?: string
  country?: string
  year?: string
  limit?: number
}

export const movieApi = {
  async getRecentMovies(page = 1): Promise<{ items: Movie[], pagination: any }> {
    const response = await api.get(`/danh-sach/phim-moi-cap-nhat?page=${page}`)
    return response.data
  },

  async getMovieList(type: string, params: ListParams = {}): Promise<MovieListResponse> {
    const {
      page = 1,
      sort_field = 'modified.time',
      sort_type = 'desc',
      category = '',
      country = '',
      year = '',
      limit = 24
    } = params

    let url = `/v1/api/danh-sach/${type}?page=${page}&sort_field=${sort_field}&sort_type=${sort_type}&limit=${limit}`
    if (category) url += `&category=${category}`
    if (country) url += `&country=${country}`
    if (year) url += `&year=${year}`

    const response = await api.get<ApiResponse<MovieListResponse>>(url)
    return response.data.data
  },

  async getMovieDetail(slug: string): Promise<MovieDetail> {
    const response = await api.get(`/phim/${slug}`)
    // Episodes are at top level, not inside movie object
    return {
      ...response.data.movie,
      episodes: response.data.episodes
    }
  },

  async searchMovies(keyword: string, params: ListParams = {}): Promise<MovieListResponse> {
    const {
      page = 1,
      sort_field = 'modified.time',
      sort_type = 'desc',
      limit = 24
    } = params

    const response = await api.get<ApiResponse<MovieListResponse>>(
      `/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}&sort_field=${sort_field}&sort_type=${sort_type}&limit=${limit}`
    )
    return response.data.data
  },

  async getGenres(): Promise<GenreItem[]> {
    const response = await api.get('/the-loai')
    return response.data
  },

  async getMoviesByGenre(slug: string, params: ListParams = {}): Promise<MovieListResponse> {
    const {
      page = 1,
      sort_field = 'modified.time',
      sort_type = 'desc',
      limit = 24
    } = params

    const response = await api.get<ApiResponse<MovieListResponse>>(
      `/v1/api/the-loai/${slug}?page=${page}&sort_field=${sort_field}&sort_type=${sort_type}&limit=${limit}`
    )
    return response.data.data
  },

  async getCountries(): Promise<GenreItem[]> {
    const response = await api.get('/quoc-gia')
    return response.data
  },

  async getMoviesByCountry(slug: string, params: ListParams = {}): Promise<MovieListResponse> {
    const {
      page = 1,
      sort_field = 'modified.time',
      sort_type = 'desc',
      limit = 24
    } = params

    const response = await api.get<ApiResponse<MovieListResponse>>(
      `/v1/api/quoc-gia/${slug}?page=${page}&sort_field=${sort_field}&sort_type=${sort_type}&limit=${limit}`
    )
    return response.data.data
  },

  getImageUrl(url: string | null): string {
    if (!url) return '/placeholder.svg'
    if (url.startsWith('http')) return url
    // Relative paths need the image CDN domain
    return `${IMAGE_CDN}/${url}`
  }
}
