'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeft, Play, Plus, Check, Star, Calendar, Clock, Globe, X } from 'lucide-react';
import { fetchMovieById, fetchSimilarMovies, Movie } from '@/lib/api';
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from '@/lib/watchlist';
import { useToast } from '@/lib/context';
import { MovieRow } from '@/components/movie-row';

const genreMap: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
};

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { showToast } = useToast();

  const { data: movie, isLoading, error } = useSWR(
    `movie-${id}`,
    () => fetchMovieById(Number(id))
  );

  const { data: similarData, isLoading: similarLoading } = useSWR(
    movie ? `similar-${id}` : null,
    () => fetchSimilarMovies(Number(id))
  );

  useEffect(() => {
    if (movie) {
      setInWatchlist(isInWatchlist(movie.id));
    }
  }, [movie]);

  const handleWatchlistToggle = () => {
    if (!movie) return;
    
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
      setInWatchlist(false);
      showToast('Removed from watchlist', 'info');
    } else {
      addToWatchlist(movie);
      setInWatchlist(true);
      showToast('Added to watchlist', 'success');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Movie Not Found</h1>
          <p className="text-muted-foreground mb-6">Sorry, we could not find the movie you are looking for.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !movie) {
    return <MovieDetailSkeleton />;
  }

  const backdropUrl = movie.backdrop_path && !imageError
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : '/placeholder-backdrop.jpg';

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie.jpg';

  const genres = movie.genre_ids?.map((id) => genreMap[id]).filter(Boolean) || 
                 movie.genres?.map((g) => g.name) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh]">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />

        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-24 left-4 sm:left-8 z-20 p-3 rounded-full glass hover:bg-secondary/50 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 -mt-64 sm:-mt-80 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Poster */}
            <div className="shrink-0 mx-auto lg:mx-0">
              <div className="relative w-48 sm:w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                {movie.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                {movie.vote_average > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 text-primary">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                  </div>
                )}
                {movie.release_date && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(movie.release_date).toLocaleDateString()}</span>
                  </div>
                )}
                {movie.runtime && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                  </div>
                )}
                {movie.original_language && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span className="uppercase">{movie.original_language}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {genres.length > 0 && (
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-6">
                  {genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 rounded-full bg-secondary text-sm text-foreground"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-3xl mx-auto lg:mx-0 text-pretty">
                {movie.overview}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Watch Trailer
                </button>
                <button
                  onClick={handleWatchlistToggle}
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-colors ${
                    inWatchlist
                      ? 'bg-primary/20 text-primary border border-primary'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {inWatchlist ? (
                    <>
                      <Check className="w-5 h-5" />
                      In My List
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add to List
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Movies */}
        {similarData?.results && similarData.results.length > 0 && (
          <div className="mt-16">
            <MovieRow
              title="Similar Movies"
              movies={similarData.results}
              isLoading={similarLoading}
            />
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {isTrailerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-card rounded-xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setIsTrailerOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
              aria-label="Close trailer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Play className="w-16 h-16 mx-auto mb-4 text-primary" />
                <p className="text-lg font-medium">Trailer Coming Soon</p>
                <p className="text-sm">{movie.title}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MovieDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] bg-card animate-shimmer" />
      <div className="relative z-10 -mt-64 sm:-mt-80 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="shrink-0 mx-auto lg:mx-0">
              <div className="w-48 sm:w-64 aspect-[2/3] rounded-xl bg-card animate-shimmer" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="h-12 bg-card animate-shimmer rounded w-3/4 mx-auto lg:mx-0" />
              <div className="flex gap-4 justify-center lg:justify-start">
                <div className="h-8 bg-card animate-shimmer rounded w-20" />
                <div className="h-8 bg-card animate-shimmer rounded w-24" />
                <div className="h-8 bg-card animate-shimmer rounded w-16" />
              </div>
              <div className="h-24 bg-card animate-shimmer rounded" />
              <div className="flex gap-4 justify-center lg:justify-start">
                <div className="h-14 bg-card animate-shimmer rounded w-40" />
                <div className="h-14 bg-card animate-shimmer rounded w-36" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
