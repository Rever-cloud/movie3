'use client';

import useSWR from 'swr';
import { getPopularMovies, getTrendingMovies, Movie } from '@/lib/api';
import { HeroBanner, HeroBannerSkeleton } from '@/components/hero-banner';
import { MovieRow } from '@/components/movie-row';
import { ContinueWatching } from '@/components/continue-watching';
import { GenreFilter } from '@/components/genre-filter';

export default function HomePage() {
  const { data: trendingData, isLoading: trendingLoading } = useSWR('trending', getTrendingMovies);
  const { data: popularData, isLoading: popularLoading } = useSWR('popular', getPopularMovies);
  const { data: moviesData, isLoading: moviesLoading } = useSWR('movies', getPopularMovies);

  const trending: Movie[] = trendingData?.results || [];
  const popular: Movie[] = popularData?.results || [];
  const allMovies: Movie[] = moviesData?.results || [];

  // Create different categories
  const topRated = [...allMovies].sort((a, b) => b.vote_average - a.vote_average).slice(0, 20);
  const newReleases = [...allMovies]
    .filter((m) => m.release_date)
    .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
    .slice(0, 20);
  const actionMovies = allMovies.filter((m) => m.genre_ids?.includes(28)).slice(0, 20);
  const comedyMovies = allMovies.filter((m) => m.genre_ids?.includes(35)).slice(0, 20);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      {trendingLoading ? (
        <HeroBannerSkeleton />
      ) : (
        <HeroBanner movies={trending.slice(0, 5)} />
      )}

      {/* Main Content */}
      <div className="relative z-10 -mt-20 sm:-mt-32 lg:-mt-40 space-y-2">
        {/* Continue Watching */}
        <ContinueWatching />

        {/* Genre Filter */}
        <GenreFilter />

        {/* Trending Now */}
        <MovieRow
          title="Trending Now"
          movies={trending}
          isLoading={trendingLoading}
          variant="large"
        />

        {/* Popular on Reverse Movie Hub */}
        <MovieRow
          title="Popular on Reverse Movie Hub"
          movies={popular}
          isLoading={popularLoading}
        />

        {/* Top Rated */}
        <MovieRow
          title="Top Rated"
          movies={topRated}
          isLoading={moviesLoading}
        />

        {/* New Releases */}
        <MovieRow
          title="New Releases"
          movies={newReleases}
          isLoading={moviesLoading}
        />

        {/* Action Movies */}
        {actionMovies.length > 0 && (
          <MovieRow
            title="Action & Adventure"
            movies={actionMovies}
            isLoading={moviesLoading}
          />
        )}

        {/* Comedy Movies */}
        {comedyMovies.length > 0 && (
          <MovieRow
            title="Comedy"
            movies={comedyMovies}
            isLoading={moviesLoading}
          />
        )}
      </div>
    </div>
  );
}
