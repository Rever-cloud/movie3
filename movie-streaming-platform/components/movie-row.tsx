'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '@/lib/api';
import { MovieCard, MovieCardSkeleton } from './movie-card';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  variant?: 'default' | 'large' | 'compact';
}

export function MovieRow({ title, movies, isLoading = false, variant = 'default' }: MovieRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-7 bg-card animate-shimmer rounded w-48 mb-4" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <MovieCardSkeleton key={i} variant={variant} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!movies.length) return null;

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full transition-all ${
                canScrollLeft
                  ? 'bg-secondary text-foreground hover:bg-secondary/80'
                  : 'bg-secondary/30 text-muted-foreground cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full transition-all ${
                canScrollRight
                  ? 'bg-secondary text-foreground hover:bg-secondary/80'
                  : 'bg-secondary/30 text-muted-foreground cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              variant={variant}
              priority={index < 4}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
