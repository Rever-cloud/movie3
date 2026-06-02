// An0nOtF
// StreamFlex movies
// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://streamflex-movies-api.up.railway.app';

// Types
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  original_language?: string;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  popularity?: number;
  adult?: boolean;
  video?: boolean;
}

export interface TvShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  origin_country: string[];
  original_language: string;
  genre_ids?: number[];
  genres?: Genre[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  tagline?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  rating?: number;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date: string;
}

export interface ApiResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await sleep(RETRY_DELAY);
      return fetchWithRetry<T>(url, options, retries - 1);
    }
    throw error;
  }
}

// ============ TRENDING ============

export async function getTrending(): Promise<ApiResponse<Movie | TvShow>> {
  return fetchWithRetry<ApiResponse<Movie | TvShow>>(`${API_BASE_URL}/api/trending`);
}

export async function getTrendingMovies(): Promise<ApiResponse<Movie>> {
  return fetchWithRetry<ApiResponse<Movie>>(`${API_BASE_URL}/api/trending/movies`);
}

export async function getTrendingTv(): Promise<ApiResponse<TvShow>> {
  return fetchWithRetry<ApiResponse<TvShow>>(`${API_BASE_URL}/api/trending/tv`);
}

// ============ SEARCH ============

export async function searchAll(query: string, page = 1): Promise<ApiResponse<Movie | TvShow>> {
  return fetchWithRetry<ApiResponse<Movie | TvShow>>(
    `${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}&page=${page}`
  );
}

export async function searchMovies(query: string, page = 1): Promise<ApiResponse<Movie>> {
  return fetchWithRetry<ApiResponse<Movie>>(
    `${API_BASE_URL}/api/search/movies?q=${encodeURIComponent(query)}&page=${page}`
  );
}

export async function searchTv(query: string, page = 1): Promise<ApiResponse<TvShow>> {
  return fetchWithRetry<ApiResponse<TvShow>>(
    `${API_BASE_URL}/api/search/tv?q=${encodeURIComponent(query)}&page=${page}`
  );
}

// ============ GENRES ============

export async function getMovieGenres(): Promise<Genre[]> {
  return fetchWithRetry<Genre[]>(`${API_BASE_URL}/api/genres/movies`);
}

export async function getTvGenres(): Promise<Genre[]> {
  return fetchWithRetry<Genre[]>(`${API_BASE_URL}/api/genres/tv`);
}

// ============ MOVIES ============

export async function getPopularMovies(page = 1): Promise<ApiResponse<Movie>> {
  return fetchWithRetry<ApiResponse<Movie>>(`${API_BASE_URL}/api/movies/popular?page=${page}`);
}

export async function getTopRatedMovies(): Promise<ApiResponse<Movie>> {
  return fetchWithRetry<ApiResponse<Movie>>(`${API_BASE_URL}/api/movies/top-rated`);
}

export async function getNowPlayingMovies(): Promise<ApiResponse<Movie>> {
  return fetchWithRetry<ApiResponse<Movie>>(`${API_BASE_URL}/api/movies/now-playing`);
}

export async function getUpcomingMovies(): Promise<ApiResponse<Movie>> {
  return fetchWithRetry<ApiResponse<Movie>>(`${API_BASE_URL}/api/movies/upcoming`);
}

export async function getMovieById(id: number): Promise<Movie> {
  return fetchWithRetry<Movie>(`${API_BASE_URL}/api/movies/${id}`);
}

export async function getMovieCast(id: number): Promise<{ cast: CastMember[]; crew: CrewMember[] }> {
  return fetchWithRetry<{ cast: CastMember[]; crew: CrewMember[] }>(`${API_BASE_URL}/api/movies/${id}/cast`);
}

export async function getMovieVideos(id: number): Promise<{ results: Video[] }> {
  return fetchWithRetry<{ results: Video[] }>(`${API_BASE_URL}/api/movies/${id}/videos`);
}

export async function getMovieReviews(id: number): Promise<ApiResponse<Review>> {
  return fetchWithRetry<ApiResponse<Review>>(`${API_BASE_URL}/api/movies/${id}/reviews`);
}

export async function getSimilarMovies(id: number): Promise<ApiResponse<Movie>> {
  return fetchWithRetry<ApiResponse<Movie>>(`${API_BASE_URL}/api/movies/${id}/similar`);
}

export async function getMovieRecommendations(id: number): Promise<ApiResponse<Movie>> {
  return fetchWithRetry<ApiResponse<Movie>>(`${API_BASE_URL}/api/movies/${id}/recommendations`);
}

export async function getMoviesByGenre(genreId: number): Promise<ApiResponse<Movie>> {
  return fetchWithRetry<ApiResponse<Movie>>(`${API_BASE_URL}/api/movies/genre/${genreId}`);
}

export async function getComingSoonMovies(): Promise<ApiResponse<Movie>> {
  return fetchWithRetry<ApiResponse<Movie>>(`${API_BASE_URL}/api/movies/coming-soon`);
}

export async function getNewHotMovies(): Promise<ApiResponse<Movie>> {
  return fetchWithRetry<ApiResponse<Movie>>(`${API_BASE_URL}/api/movies/new-hot`);
}

export async function getAwardWinners(): Promise<ApiResponse<Movie>> {
  return fetchWithRetry<ApiResponse<Movie>>(`${API_BASE_URL}/api/movies/award-winners`);
}

export async function getDocumentaries(): Promise<ApiResponse<Movie>> {
  return fetchWithRetry<ApiResponse<Movie>>(`${API_BASE_URL}/api/movies/documentaries`);
}

export async function getFamilyMovies(): Promise<ApiResponse<Movie>> {
  return fetchWithRetry<ApiResponse<Movie>>(`${API_BASE_URL}/api/movies/family`);
}

// ============ TV SHOWS ============

export async function getPopularTv(page = 1): Promise<ApiResponse<TvShow>> {
  return fetchWithRetry<ApiResponse<TvShow>>(`${API_BASE_URL}/api/tv/popular?page=${page}`);
}

export async function getTopRatedTv(): Promise<ApiResponse<TvShow>> {
  return fetchWithRetry<ApiResponse<TvShow>>(`${API_BASE_URL}/api/tv/top-rated`);
}

export async function getOnAirTv(): Promise<ApiResponse<TvShow>> {
  return fetchWithRetry<ApiResponse<TvShow>>(`${API_BASE_URL}/api/tv/on-air`);
}

export async function getTvById(id: number): Promise<TvShow> {
  return fetchWithRetry<TvShow>(`${API_BASE_URL}/api/tv/${id}`);
}

export async function getTvCast(id: number): Promise<{ cast: CastMember[]; crew: CrewMember[] }> {
  return fetchWithRetry<{ cast: CastMember[]; crew: CrewMember[] }>(`${API_BASE_URL}/api/tv/${id}/cast`);
}

export async function getTvVideos(id: number): Promise<{ results: Video[] }> {
  return fetchWithRetry<{ results: Video[] }>(`${API_BASE_URL}/api/tv/${id}/videos`);
}

export async function getTvReviews(id: number): Promise<ApiResponse<Review>> {
  return fetchWithRetry<ApiResponse<Review>>(`${API_BASE_URL}/api/tv/${id}/reviews`);
}

export async function getSimilarTv(id: number): Promise<ApiResponse<TvShow>> {
  return fetchWithRetry<ApiResponse<TvShow>>(`${API_BASE_URL}/api/tv/${id}/similar`);
}

export async function getTvRecommendations(id: number): Promise<ApiResponse<TvShow>> {
  return fetchWithRetry<ApiResponse<TvShow>>(`${API_BASE_URL}/api/tv/${id}/recommendations`);
}

export async function getTvSeason(id: number, seasonNumber: number): Promise<Season> {
  return fetchWithRetry<Season>(`${API_BASE_URL}/api/tv/${id}/season/${seasonNumber}`);
}

export async function getTvByGenre(genreId: number): Promise<ApiResponse<TvShow>> {
  return fetchWithRetry<ApiResponse<TvShow>>(`${API_BASE_URL}/api/tv/genre/${genreId}`);
}

export async function getAnime(): Promise<ApiResponse<TvShow>> {
  return fetchWithRetry<ApiResponse<TvShow>>(`${API_BASE_URL}/api/tv/anime`);
}

export async function getKoreanDramas(): Promise<ApiResponse<TvShow>> {
  return fetchWithRetry<ApiResponse<TvShow>>(`${API_BASE_URL}/api/tv/korean`);
}

export async function getSpanishShows(): Promise<ApiResponse<TvShow>> {
  return fetchWithRetry<ApiResponse<TvShow>>(`${API_BASE_URL}/api/tv/spanish`);
}

// ============ IMAGE HELPER ============

export function getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) {
    return `https://placehold.co/${size === 'original' ? '1920x1080' : size.replace('w', '') + 'x' + Math.round(parseInt(size.replace('w', '')) * 1.5)}/1a1a2e/e94560?text=No+Image`;
  }
  
  if (path.startsWith('http')) {
    return path;
  }
  
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// ============ SWR FETCHER ============

export const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};  
