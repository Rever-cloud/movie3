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
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  production_companies?: ProductionCompany[];
  videos?: { results: Video[] };
  credits?: { cast: CastMember[]; crew: CrewMember[] };
  similar?: { results: Movie[] };
  recommendations?: { results: Movie[] };
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
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

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface ApiResponse<T> {
  results?: T[];
  page?: number;
  total_pages?: number;
  total_results?: number;
}

// Mock data for fallback
const mockMovies: Movie[] = [
  {
    id: 1,
    title: "The Last Horizon",
    overview: "In a world where humanity's last hope lies beyond the stars, a crew of brave explorers must journey to the edge of the known universe.",
    poster_path: null,
    backdrop_path: null,
    release_date: "2024-03-15",
    vote_average: 8.5,
    vote_count: 1250,
    genre_ids: [878, 12, 18],
  },
  {
    id: 2,
    title: "Midnight Echo",
    overview: "A detective with a troubled past must confront his demons when a series of mysterious disappearances rocks his quiet hometown.",
    poster_path: null,
    backdrop_path: null,
    release_date: "2024-02-28",
    vote_average: 7.8,
    vote_count: 890,
    genre_ids: [53, 9648, 80],
  },
  {
    id: 3,
    title: "The Quantum Protocol",
    overview: "When a brilliant scientist discovers a way to manipulate time, she must decide whether to save her family or protect the fabric of reality itself.",
    poster_path: null,
    backdrop_path: null,
    release_date: "2024-01-20",
    vote_average: 8.2,
    vote_count: 2100,
    genre_ids: [878, 53, 12],
  },
  {
    id: 4,
    title: "Crimson Dawn",
    overview: "In a post-apocalyptic world, a lone warrior must protect a group of survivors as they search for a mythical sanctuary.",
    poster_path: null,
    backdrop_path: null,
    release_date: "2024-04-05",
    vote_average: 7.5,
    vote_count: 650,
    genre_ids: [28, 878, 53],
  },
  {
    id: 5,
    title: "Whispers in the Wind",
    overview: "A heartwarming story of love and loss as two strangers find connection in the most unexpected circumstances.",
    poster_path: null,
    backdrop_path: null,
    release_date: "2024-02-14",
    vote_average: 8.0,
    vote_count: 1500,
    genre_ids: [10749, 18],
  },
  {
    id: 6,
    title: "Shadow Company",
    overview: "An elite team of operatives must infiltrate a criminal organization that threatens global security.",
    poster_path: null,
    backdrop_path: null,
    release_date: "2024-03-22",
    vote_average: 7.6,
    vote_count: 980,
    genre_ids: [28, 53, 80],
  },
  {
    id: 7,
    title: "The Forgotten Kingdom",
    overview: "A young archaeologist discovers an ancient civilization hidden beneath the desert sands, awakening forces long dormant.",
    poster_path: null,
    backdrop_path: null,
    release_date: "2024-01-10",
    vote_average: 7.9,
    vote_count: 1100,
    genre_ids: [12, 14, 28],
  },
  {
    id: 8,
    title: "Neon Nights",
    overview: "In a cyberpunk metropolis, a hacker uncovers a conspiracy that could change the course of human evolution.",
    poster_path: null,
    backdrop_path: null,
    release_date: "2024-04-18",
    vote_average: 8.3,
    vote_count: 1800,
    genre_ids: [878, 28, 53],
  },
  {
    id: 9,
    title: "The Garden of Dreams",
    overview: "A magical realist tale following a family across three generations as they navigate love, loss, and the supernatural.",
    poster_path: null,
    backdrop_path: null,
    release_date: "2024-02-01",
    vote_average: 8.7,
    vote_count: 2500,
    genre_ids: [14, 18, 10749],
  },
  {
    id: 10,
    title: "Steel Thunder",
    overview: "The ultimate racing championship pushes drivers to their limits in a high-octane competition for glory.",
    poster_path: null,
    backdrop_path: null,
    release_date: "2024-03-01",
    vote_average: 7.2,
    vote_count: 720,
    genre_ids: [28, 18],
  },
];

export const genres: Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Sleep utility for retry delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch wrapper with retry logic
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

// API Functions
// Alias functions for consistency
export const fetchMovies = getMovies;
export const fetchTrending = getTrendingMovies;
export const fetchPopular = getPopularMovies;
export const fetchMovieById = getMovieById;
export const fetchSimilarMovies = getSimilarMovies;

export async function getMovies(page = 1): Promise<ApiResponse<Movie>> {
  try {
    const data = await fetchWithRetry<ApiResponse<Movie> | Movie[]>(
      `${API_BASE_URL}/movies?page=${page}`
    );
    
    // Handle both array and object responses
    if (Array.isArray(data)) {
      return { results: data, page: 1, total_pages: 1, total_results: data.length };
    }
    return data;
  } catch {
    console.warn('Using mock data for movies');
    return { results: mockMovies, page: 1, total_pages: 1, total_results: mockMovies.length };
  }
}

export async function getTrendingMovies(page = 1): Promise<ApiResponse<Movie>> {
  try {
    const data = await fetchWithRetry<ApiResponse<Movie> | Movie[]>(
      `${API_BASE_URL}/trending?page=${page}`
    );
    
    if (Array.isArray(data)) {
      return { results: data, page: 1, total_pages: 1, total_results: data.length };
    }
    return data;
  } catch {
    console.warn('Using mock data for trending');
    return { results: mockMovies.slice(0, 5), page: 1, total_pages: 1, total_results: 5 };
  }
}

export async function getPopularMovies(page = 1): Promise<ApiResponse<Movie>> {
  try {
    const data = await fetchWithRetry<ApiResponse<Movie> | Movie[]>(
      `${API_BASE_URL}/popular?page=${page}`
    );
    
    if (Array.isArray(data)) {
      return { results: data, page: 1, total_pages: 1, total_results: data.length };
    }
    return data;
  } catch {
    console.warn('Using mock data for popular');
    return { results: mockMovies.slice(5), page: 1, total_pages: 1, total_results: 5 };
  }
}

export async function searchMovies(query: string, page = 1): Promise<ApiResponse<Movie>> {
  try {
    const data = await fetchWithRetry<ApiResponse<Movie> | Movie[]>(
      `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}`
    );
    
    if (Array.isArray(data)) {
      return { results: data, page: 1, total_pages: 1, total_results: data.length };
    }
    return data;
  } catch {
    console.warn('Using mock search results');
    const filtered = mockMovies.filter(m => 
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.overview.toLowerCase().includes(query.toLowerCase())
    );
    return { results: filtered, page: 1, total_pages: 1, total_results: filtered.length };
  }
}

export async function getMovieById(id: number): Promise<Movie | null> {
  try {
    const data = await fetchWithRetry<Movie>(`${API_BASE_URL}/movie/${id}`);
    return data;
  } catch {
    console.warn('Using mock data for movie details');
    const movie = mockMovies.find(m => m.id === id);
    if (movie) {
      return {
        ...movie,
        runtime: 120,
        tagline: "An unforgettable cinematic experience",
        genres: movie.genre_ids?.map(id => genres.find(g => g.id === id)).filter(Boolean) as Genre[],
        videos: { results: [] },
        credits: { cast: [], crew: [] },
        similar: { results: mockMovies.filter(m => m.id !== id).slice(0, 6) },
      };
    }
    return mockMovies[0];
  }
}

export async function getMoviesByGenre(genreId: number, page = 1): Promise<ApiResponse<Movie>> {
  try {
    const data = await fetchWithRetry<ApiResponse<Movie> | Movie[]>(
      `${API_BASE_URL}/discover?genre=${genreId}&page=${page}`
    );
    
    if (Array.isArray(data)) {
      return { results: data, page: 1, total_pages: 1, total_results: data.length };
    }
    return data;
  } catch {
    console.warn('Using mock data for genre');
    const filtered = mockMovies.filter(m => m.genre_ids?.includes(genreId));
    return { results: filtered.length > 0 ? filtered : mockMovies, page: 1, total_pages: 1, total_results: filtered.length || mockMovies.length };
  }
}

// Image URL helper
export function getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) {
    return `https://placehold.co/${size === 'original' ? '1920x1080' : size.replace('w', '') + 'x' + Math.round(parseInt(size.replace('w', '')) * 1.5)}/1a1a2e/e94560?text=No+Image`;
  }
  
  // Check if path is already a full URL
  if (path.startsWith('http')) {
    return path;
  }
  
  // TMDB image URL
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// SWR Fetcher
export const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

// Get genre name by ID
export function getGenreName(id: number): string {
  return genres.find(g => g.id === id)?.name || 'Unknown';
}

// Get similar movies
export async function getSimilarMovies(movieId: number): Promise<ApiResponse<Movie>> {
  try {
    const data = await fetchWithRetry<ApiResponse<Movie> | Movie[]>(
      `${API_BASE_URL}/movie/${movieId}/similar`
    );
    
    if (Array.isArray(data)) {
      return { results: data, page: 1, total_pages: 1, total_results: data.length };
    }
    return data;
  } catch {
    console.warn('Using mock data for similar movies');
    return { results: mockMovies.filter(m => m.id !== movieId).slice(0, 6), page: 1, total_pages: 1, total_results: 6 };
  }
}
