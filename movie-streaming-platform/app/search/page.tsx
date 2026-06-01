'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { Search, X, Loader2 } from 'lucide-react';
import { searchMovies, Movie } from '@/lib/api';
import { MovieCard, MovieCardSkeleton } from '@/components/movie-card';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  const { data, isLoading, error } = useSWR(
    debouncedQuery ? `search-${debouncedQuery}` : null,
    () => searchMovies(debouncedQuery)
  );

  const movies: Movie[] = data?.results || [];

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleClear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Search Movies</h1>
          
          {/* Search Input */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies..."
              className="w-full pl-12 pr-12 py-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-lg"
              autoFocus
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Search Suggestions */}
          {!debouncedQuery && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {['Action', 'Comedy', 'Horror', 'Sci-Fi', 'Drama', 'Adventure'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 rounded-full bg-secondary text-sm text-foreground hover:bg-secondary/80 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {debouncedQuery && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </span>
                ) : error ? (
                  'Error loading results'
                ) : (
                  `${movies.length} result${movies.length !== 1 ? 's' : ''} for "${debouncedQuery}"`
                )}
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <MovieCardSkeleton key={i} />
                ))}
              </div>
            ) : movies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h2 className="text-xl font-semibold text-foreground mb-2">No results found</h2>
                <p className="text-muted-foreground">
                  We could not find any movies matching your search.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!debouncedQuery && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Start searching</h2>
            <p className="text-muted-foreground">
              Enter a movie title to find what you are looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
