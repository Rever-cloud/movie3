'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles } from 'lucide-react';

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

function GenreFilterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedGenre, setSelectedGenre] = useState<number | null>(
    searchParams.get('genre') ? Number(searchParams.get('genre')) : null
  );

  const handleGenreClick = (genreId: number) => {
    if (selectedGenre === genreId) {
      setSelectedGenre(null);
      router.push('/movies');
    } else {
      setSelectedGenre(genreId);
      router.push(`/movies?genre=${genreId}`);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => handleGenreClick(genre.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedGenre === genre.id
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
              : 'bg-secondary text-foreground hover:bg-secondary/80'
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}

export function GenreFilter() {
  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Browse by Genre</h2>
        </div>
        <Suspense fallback={
          <div className="flex flex-wrap gap-2">
            {genres.slice(0, 8).map((genre) => (
              <div key={genre.id} className="h-10 w-24 rounded-full bg-secondary animate-pulse" />
            ))}
          </div>
        }>
          <GenreFilterContent />
        </Suspense>
      </div>
    </section>
  );
}
