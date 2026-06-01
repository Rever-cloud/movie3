'use client';

import type { Movie } from './api';

const WATCHLIST_KEY = 'streamflex_watchlist';
const CONTINUE_WATCHING_KEY = 'streamflex_continue_watching';

export interface WatchProgress {
  movieId: number;
  progress: number; // 0-100
  lastWatched: number; // timestamp
  movie: Movie;
}

// Watchlist functions
export function getWatchlist(): Movie[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToWatchlist(movie: Movie): boolean {
  try {
    const watchlist = getWatchlist();
    if (watchlist.some(m => m.id === movie.id)) {
      return false;
    }
    watchlist.push(movie);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    window.dispatchEvent(new CustomEvent('watchlistUpdated'));
    return true;
  } catch {
    return false;
  }
}

export function removeFromWatchlist(movieId: number): boolean {
  try {
    const watchlist = getWatchlist();
    const filtered = watchlist.filter(m => m.id !== movieId);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('watchlistUpdated'));
    return true;
  } catch {
    return false;
  }
}

export function isInWatchlist(movieId: number): boolean {
  const watchlist = getWatchlist();
  return watchlist.some(m => m.id === movieId);
}

export function clearWatchlist(): boolean {
  try {
    localStorage.removeItem(WATCHLIST_KEY);
    window.dispatchEvent(new CustomEvent('watchlistUpdated'));
    return true;
  } catch {
    return false;
  }
}

export function toggleWatchlist(movie: Movie): { added: boolean; success: boolean } {
  if (isInWatchlist(movie.id)) {
    const success = removeFromWatchlist(movie.id);
    return { added: false, success };
  } else {
    const success = addToWatchlist(movie);
    return { added: true, success };
  }
}

// Continue Watching functions
export function getContinueWatching(): WatchProgress[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CONTINUE_WATCHING_KEY);
    const items: WatchProgress[] = stored ? JSON.parse(stored) : [];
    // Sort by last watched, most recent first
    return items.sort((a, b) => b.lastWatched - a.lastWatched);
  } catch {
    return [];
  }
}

export function updateWatchProgress(movie: Movie, progress: number): void {
  try {
    const continueWatching = getContinueWatching();
    const existingIndex = continueWatching.findIndex(w => w.movieId === movie.id);
    
    const watchProgress: WatchProgress = {
      movieId: movie.id,
      progress,
      lastWatched: Date.now(),
      movie,
    };
    
    if (existingIndex >= 0) {
      continueWatching[existingIndex] = watchProgress;
    } else {
      continueWatching.push(watchProgress);
    }
    
    // Keep only last 10 items
    const trimmed = continueWatching
      .sort((a, b) => b.lastWatched - a.lastWatched)
      .slice(0, 10);
    
    localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(trimmed));
    window.dispatchEvent(new CustomEvent('continueWatchingUpdate'));
  } catch {
    // Silent fail
  }
}

export function removeFromContinueWatching(movieId: number): void {
  try {
    const continueWatching = getContinueWatching();
    const filtered = continueWatching.filter(w => w.movieId !== movieId);
    localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('continueWatchingUpdate'));
  } catch {
    // Silent fail
  }
}
