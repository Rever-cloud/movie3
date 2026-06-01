'use client';

import useSWR from 'swr';
import { TrendingUp, Loader2 } from 'lucide-react';
import { fetchTrending, Movie } from '@/lib/api';
import { MovieCard, MovieCardSkeleton } from '@/components/movie-card';

export default function TrendingPage() {
  const { data, isLoading, error } = useSWR('trending', fetchTrending);

  const movies: Movie[] = data?.results || [];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Trending Now</h1>
          </div>
          <p className="text-muted-foreground">
            The most popular movies this week on Reverse Movie Hub
          </p>
        </div>

        {/* Movies Grid */}
        {error ? (
          <div className="text-center py-16">
            <p className="text-destructive">Error loading trending movies. Please try again.</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie, index) => (
              <div key={movie.id} className="relative">
                {/* Rank Badge */}
                <div className="absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-lg">
                  {index + 1}
                </div>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No trending movies</h2>
            <p className="text-muted-foreground">Check back later for trending content.</p>
          </div>
        )}
      </div>
    </div>
  );
}
