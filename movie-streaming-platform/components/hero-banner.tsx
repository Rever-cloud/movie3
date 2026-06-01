'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Plus, Check, Info, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '@/lib/api';
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from '@/lib/watchlist';
import { useToast } from '@/lib/context';

interface HeroBannerProps {
  movies: Movie[];
}

export function HeroBanner({ movies }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { showToast } = useToast();

  const currentMovie = movies[currentIndex];

  useEffect(() => {
    if (currentMovie) {
      setInWatchlist(isInWatchlist(currentMovie.id));
      setImageError(false);
    }
  }, [currentMovie]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [movies.length]);

  if (!currentMovie) return null;

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(currentMovie.id);
      setInWatchlist(false);
      showToast('Removed from watchlist', 'info');
    } else {
      addToWatchlist(currentMovie);
      setInWatchlist(true);
      showToast('Added to watchlist', 'success');
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const backdropUrl = currentMovie.backdrop_path && !imageError
    ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
    : '/placeholder-backdrop.jpg';

  return (
    <div className="relative h-[70vh] sm:h-[80vh] lg:h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backdropUrl}
          alt={currentMovie.title}
          fill
          className="object-cover transition-opacity duration-700"
          priority
          onError={() => setImageError(true)}
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Text */}
          <p className="text-primary font-semibold text-sm sm:text-base mb-2 tracking-wider uppercase animate-fade-in-up">
            Welcome to Reverse Movie Hub
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground mb-4 max-w-3xl text-balance animate-fade-in-up">
            {currentMovie.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 animate-fade-in-up">
            {currentMovie.vote_average > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 text-primary">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-semibold">{currentMovie.vote_average.toFixed(1)}</span>
              </div>
            )}
            {currentMovie.release_date && (
              <span className="text-muted-foreground">
                {new Date(currentMovie.release_date).getFullYear()}
              </span>
            )}
            {currentMovie.genre_ids && currentMovie.genre_ids.length > 0 && (
              <span className="text-muted-foreground hidden sm:inline">
                {getGenreNames(currentMovie.genre_ids).slice(0, 2).join(' / ')}
              </span>
            )}
          </div>

          {/* Overview */}
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mb-6 line-clamp-3 text-pretty animate-fade-in-up">
            {currentMovie.overview}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 animate-fade-in-up">
            <Link
              href={`/movie/${currentMovie.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Watch Now</span>
            </Link>
            <button
              onClick={handleWatchlistToggle}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                inWatchlist
                  ? 'bg-primary/20 text-primary border border-primary'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {inWatchlist ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>In My List</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>My List</span>
                </>
              )}
            </button>
            <Link
              href={`/movie/${currentMovie.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary/50 text-foreground font-semibold hover:bg-secondary transition-colors"
            >
              <Info className="w-5 h-5" />
              <span className="hidden sm:inline">More Info</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass text-foreground hover:bg-secondary/50 transition-colors z-20"
        aria-label="Previous movie"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass text-foreground hover:bg-secondary/50 transition-colors z-20"
        aria-label="Next movie"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {movies.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-primary'
                : 'bg-foreground/30 hover:bg-foreground/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Genre mapping (TMDB genre IDs)
const genreMap: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

function getGenreNames(genreIds: number[]): string[] {
  return genreIds.map((id) => genreMap[id] || 'Unknown').filter(Boolean);
}

export function HeroBannerSkeleton() {
  return (
    <div className="relative h-[70vh] sm:h-[80vh] lg:h-[85vh] w-full bg-card animate-shimmer">
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
        <div className="max-w-7xl mx-auto">
          <div className="h-4 bg-secondary rounded w-48 mb-4" />
          <div className="h-12 bg-secondary rounded w-96 mb-4" />
          <div className="flex gap-4 mb-4">
            <div className="h-8 bg-secondary rounded w-20" />
            <div className="h-8 bg-secondary rounded w-16" />
          </div>
          <div className="h-16 bg-secondary rounded w-full max-w-2xl mb-6" />
          <div className="flex gap-3">
            <div className="h-12 bg-secondary rounded w-36" />
            <div className="h-12 bg-secondary rounded w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
