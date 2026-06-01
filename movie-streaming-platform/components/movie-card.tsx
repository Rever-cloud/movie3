'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Plus, Check, Star, Info } from 'lucide-react';
import { Movie } from '@/lib/api';
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from '@/lib/watchlist';
import { useToast } from '@/lib/context';

interface MovieCardProps {
  movie: Movie;
  variant?: 'default' | 'large' | 'compact';
  priority?: boolean;
}

export function MovieCard({ movie, variant = 'default', priority = false }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setInWatchlist(isInWatchlist(movie.id));
  }, [movie.id]);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  const sizeClasses = {
    default: 'w-[160px] sm:w-[180px] md:w-[200px]',
    large: 'w-[200px] sm:w-[240px] md:w-[280px]',
    compact: 'w-[140px] sm:w-[160px]',
  };

  const aspectClasses = {
    default: 'aspect-[2/3]',
    large: 'aspect-[2/3]',
    compact: 'aspect-[2/3]',
  };

  const imageUrl = movie.poster_path && !imageError
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie.jpg';

  return (
    <Link
      href={`/movie/${movie.id}`}
      className={`${sizeClasses[variant]} shrink-0 group relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative ${aspectClasses[variant]} rounded-lg overflow-hidden bg-card transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary/20`}
      >
        <Image
          src={imageUrl}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, 200px"
          priority={priority}
          onError={() => setImageError(true)}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-medium">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        )}

        {/* Hover Actions */}
        <div
          className={`absolute inset-0 flex flex-col justify-end p-3 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <button
              className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              aria-label="Play movie"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={handleWatchlistToggle}
              className={`p-2 rounded-full transition-colors ${
                inWatchlist
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/80 text-foreground hover:bg-secondary'
              }`}
              aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {inWatchlist ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
            <Link
              href={`/movie/${movie.id}`}
              className="p-2 rounded-full bg-secondary/80 text-foreground hover:bg-secondary transition-colors"
              aria-label="More info"
            >
              <Info className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mt-2 px-1">
        <h3 className="font-medium text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
        </p>
      </div>
    </Link>
  );
}

export function MovieCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'large' | 'compact' }) {
  const sizeClasses = {
    default: 'w-[160px] sm:w-[180px] md:w-[200px]',
    large: 'w-[200px] sm:w-[240px] md:w-[280px]',
    compact: 'w-[140px] sm:w-[160px]',
  };

  return (
    <div className={`${sizeClasses[variant]} shrink-0`}>
      <div className="aspect-[2/3] rounded-lg bg-card animate-shimmer" />
      <div className="mt-2 px-1">
        <div className="h-4 bg-card animate-shimmer rounded w-3/4" />
        <div className="h-3 bg-card animate-shimmer rounded w-1/2 mt-1" />
      </div>
    </div>
  );
}
