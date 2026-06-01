'use client';

import { useState, useEffect } from 'react';
import { Heart, Trash2, Play } from 'lucide-react';
import { Movie } from '@/lib/api';
import { getWatchlist, removeFromWatchlist, clearWatchlist } from '@/lib/watchlist';
import { MovieCard, MovieCardSkeleton } from '@/components/movie-card';
import { useToast } from '@/lib/context';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
    setWatchlist(getWatchlist());

    const handleUpdate = () => {
      setWatchlist(getWatchlist());
    };

    window.addEventListener('watchlistUpdated', handleUpdate);
    return () => window.removeEventListener('watchlistUpdated', handleUpdate);
  }, []);

  const handleRemove = (movieId: number, movieTitle: string) => {
    removeFromWatchlist(movieId);
    setWatchlist(getWatchlist());
    showToast(`Removed "${movieTitle}" from watchlist`, 'info');
  };

  const handleClearAll = () => {
    clearWatchlist();
    setWatchlist([]);
    showToast('Watchlist cleared', 'info');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 bg-card animate-shimmer rounded w-48 mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-8 h-8 text-primary" />
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">My Watchlist</h1>
            </div>
            <p className="text-muted-foreground">
              {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''} saved
            </p>
          </div>

          {watchlist.length > 0 && (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Watchlist Grid */}
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlist.map((movie) => (
              <div key={movie.id} className="group relative">
                <MovieCard movie={movie} />
                <button
                  onClick={() => handleRemove(movie.id, movie.title)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                  aria-label={`Remove ${movie.title} from watchlist`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Your watchlist is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start adding movies to your watchlist by clicking the + button on any movie card.
            </p>
            <a
              href="/movies"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              <Play className="w-5 h-5" />
              Browse Movies
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
