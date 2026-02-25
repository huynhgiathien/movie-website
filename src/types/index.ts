export interface Movie {
  _id: string
  name: string
  slug: string
  origin_name: string
  poster_url: string
  thumb_url: string
  year: number
  type: string
  status: string
  time: string
  episode_current: string
  episode_total: string
  quality: string
  lang: string
  content: string
  category: Category[]
  country: Country[]
  actor: string[]
  director: string[]
  modified: {
    time: string
  }
}

export interface MovieDetail extends Movie {
  trailer_url: string
  episodes: Episode[]
}

export interface Episode {
  server_name: string
  server_data: EpisodeData[]
}

export interface EpisodeData {
  name: string
  slug: string
  filename: string
  link_embed: string
  link_m3u8: string
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface Country {
  id: string
  name: string
  slug: string
}

export interface ApiResponse<T> {
  status: string
  msg: string
  data: T
}

export interface MovieListResponse {
  seoOnPage: {
    titleHead: string
    descriptionHead: string
  }
  items: Movie[]
  params: {
    pagination: {
      totalItems: number
      totalItemsPerPage: number
      currentPage: number
      totalPages: number
    }
  }
}

export interface GenreItem {
  _id: string
  name: string
  slug: string
}
