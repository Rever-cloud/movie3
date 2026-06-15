'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWRInfinite from 'swr/infinite';
import { Loader2, Film, Filter } from 'lucide-react';
import { getPopularMovies, Movie } from '@/lib/api';
import { MovieCard, MovieCardSkeleton } from '@/components/movie-card';

const genres = [
  { id: null, name: 'All' },
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
];

function MoviesContent() {
  const searchParams = useSearchParams();
  const genreParam = searchParams.get('genre');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(
    genreParam ? Number(genreParam) : null
  );

  const getKey = (pageIndex: number, previousPageData: { results: Movie[] } | null) => {
    if (previousPageData && !previousPageData.results.length) return null;
    return `movies-page-${pageIndex + 1}-genre-${selectedGenre || 'all'}`;
  };

  const { data, error, size, setSize, isLoading, isValidating } = useSWRInfinite(
    getKey,
    (key) => {
      const pageMatch = key.match(/page-(\d+)/);
      const page = pageMatch ? Number(pageMatch[1]) : 1;
      return getPopularMovies(page);
    },
    { revalidateFirstPage: false }
  );

  const movies: Movie[] = data
    ? data.flatMap((page) => page?.results || [])
    : [];

  const filteredMovies = selectedGenre
    ? movies.filter((m) => m.genre_ids?.includes(selectedGenre))
    : movies;

  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.results?.length === 0;
  const hasMore = !isEmpty && data && data[data.length - 1]?.results?.length === 20;

  const handleLoadMore = useCallback(() => {
    setSize(size + 1);
  }, [setSize, size]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
        hasMore &&
        !isValidating
      ) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleLoadMore, hasMore, isValidating]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Film className="w-8 h-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">All Movies</h1>
          </div>
          <p className="text-muted-foreground">
            Browse our collection of amazing movies
          </p>
        </div>

        {/* Genre Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by genre:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre.id ?? 'all'}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedGenre === genre.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {error ? (
          <div className="text-center py-16">
            <p className="text-destructive">Error loading movies. Please try again.</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="mt-12 text-center">
                {isLoadingMore ? (
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                ) : (
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Load More
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Film className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No movies found</h2>
            <p className="text-muted-foreground">
              Try selecting a different genre or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <MoviesContent />
    </Suspense>
  );
}
