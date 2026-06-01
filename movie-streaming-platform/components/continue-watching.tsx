'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/lib/api';
import { getWatchlist } from '@/lib/watchlist';
import { MovieRow } from './movie-row';

export function ContinueWatching() {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setWatchlist(getWatchlist().slice(0, 10));

    const handleStorageChange = () => {
      setWatchlist(getWatchlist().slice(0, 10));
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('watchlistUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('watchlistUpdated', handleStorageChange);
    };
  }, []);

  if (!mounted || watchlist.length === 0) return null;

  return (
    <MovieRow
      title="Continue Watching"
      movies={watchlist}
      variant="default"
    />
  );
}
