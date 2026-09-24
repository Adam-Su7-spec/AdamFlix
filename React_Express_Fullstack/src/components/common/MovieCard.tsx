import React from 'react';
import { Play, Plus, Check, Star } from 'lucide-react';
import { Movie } from '../../types';
import { useApp } from '../../context/AppContext';
import { MovieCardSkeleton } from './MovieCardSkeleton';

export { MovieCardSkeleton };

interface MovieCardProps {
  movie: Movie;
  className?: string;
  aspectRatio?: 'poster' | 'landscape';
}

export const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  className = '', 
  aspectRatio = 'poster' 
}) => {
  const { navigateTo, isInWatchlist, addToWatchlist } = useApp();
  const inWatchlist = isInWatchlist(movie.id);

  const handleCardClick = () => {
    if (movie.type === 'movie') {
      navigateTo(`/movie/${movie.slug}`, { id: movie.id, title: movie.title });
    } else {
      navigateTo(`/tv-show/${movie.slug}`, { id: movie.id, title: movie.title });
    }
  };

  const handleWatchNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateTo(`/watch/${movie.slug}`, { id: movie.id, title: movie.title });
  };

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToWatchlist(movie);
  };

  // Badges: NEW, TRENDING, TOP RATED
  const primaryBadge = movie.badges && movie.badges.length > 0 ? movie.badges[0] : null;

  return (
    <div 
      onClick={handleCardClick}
      className={`group relative rounded-xl overflow-hidden bg-[#151B28] border border-[#1E2638] transition-all duration-300 hover:border-[#7C5CFF]/60 hover:shadow-xl hover:shadow-[#7C5CFF]/15 cursor-pointer flex flex-col ${className}`}
    >
      {/* Poster Media Box */}
      <div className={`relative w-full overflow-hidden bg-[#101521] ${aspectRatio === 'poster' ? 'aspect-[2/3]' : 'aspect-video'}`}>
        <img
          src={aspectRatio === 'poster' ? movie.poster : movie.backdrop || movie.poster}
          alt={movie.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Top Badges (Quality + Tag) */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5">
            {/* Quality Tag */}
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-[#00D4FF] border border-[#00D4FF]/30 tracking-wider">
              {movie.quality}
            </span>

            {/* Content Type tag if TV */}
            {movie.type === 'tv' && (
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#7C5CFF]/80 backdrop-blur-md text-white tracking-wider">
                SERIES
              </span>
            )}
          </div>

          {/* Editorial Badge */}
          {primaryBadge && (
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider shadow-sm ${
              primaryBadge === 'NEW' 
                ? 'bg-emerald-500 text-white' 
                : primaryBadge === 'TRENDING'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
                : 'bg-[#7C5CFF] text-white'
            }`}>
              {primaryBadge}
            </span>
          )}
        </div>

        {/* Hover Overlay with Action Buttons */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 z-20">
          {/* Quick Play Trigger */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handleWatchNow}
              className="flex-1 py-2 px-3 bg-gradient-to-r from-[#7C5CFF] to-[#3B2896] hover:brightness-110 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#7C5CFF]/30 transition-transform active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Watch
            </button>
            <button
              onClick={handleWatchlistToggle}
              title={inWatchlist ? "Remove from List" : "Add to My List"}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                inWatchlist 
                  ? 'bg-[#7C5CFF] border-[#7C5CFF] text-white' 
                  : 'bg-black/60 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              {inWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Quick Synopsis Snippet */}
          <p className="text-[11px] text-[#A7AFBF] line-clamp-2 leading-relaxed">
            {movie.description}
          </p>
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="p-3 flex flex-col justify-between flex-1">
        <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-[#00D4FF] transition-colors">
          {movie.title}
        </h3>

        {/* Clean Unboxed Metadata with Typographic Separators */}
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#A7AFBF]">
          <div className="flex items-center gap-1.5">
            <span>{movie.releaseYear}</span>
            <span aria-hidden="true" className="text-[#A7AFBF]/50">·</span>
            <span className="truncate max-w-[85px]">{movie.genres[0]}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 font-semibold text-amber-400">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-mono tabular-nums">{movie.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
