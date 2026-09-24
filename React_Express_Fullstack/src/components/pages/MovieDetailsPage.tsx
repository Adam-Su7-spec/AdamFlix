import React, { useState } from 'react';
import { 
  Play, 
  Plus, 
  Check, 
  Star, 
  Calendar, 
  Clock, 
  Globe, 
  Film, 
  User as UserIcon, 
  Share2, 
  X,
  Volume2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MovieCard } from '../common/MovieCard';
import { CategorySection } from '../common/CategorySection';

export const MovieDetailsPage: React.FC = () => {
  const { movies, routeParams, navigateTo, isInWatchlist, addToWatchlist, showToast } = useApp();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Find target movie by slug or id
  const movie = movies.find(m => m.slug === routeParams.slug || m.id === routeParams.id) || movies[0];

  if (!movie) return null;

  const inWatchlist = isInWatchlist(movie.id);

  // Related movies based on shared genre
  const relatedMovies = movies
    .filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g)))
    .slice(0, 10);

  // More like this (other high rated movies)
  const moreLikeThis = movies
    .filter(m => m.id !== movie.id && !relatedMovies.some(r => r.id === m.id))
    .slice(0, 8);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    } else {
      showToast('AdamFlix.tv link ready to share!');
    }
  };

  return (
    <div className="w-full pb-20">
      
      {/* 1. Large Cinematic Backdrop Hero */}
      <div className="relative w-full h-[65vh] min-h-[480px] max-h-[680px] overflow-hidden bg-[#080B12]">
        <img
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/75 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080B12] via-[#080B12]/80 to-transparent max-w-4xl" />
      </div>

      {/* 2. Main Content Information Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 sm:-mt-64 relative z-20">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Poster Box */}
          <div className="w-48 sm:w-64 lg:w-72 shrink-0 rounded-2xl overflow-hidden bg-[#151B28] border-2 border-[#1E2638] shadow-2xl mx-auto md:mx-0">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover"
            />
          </div>

          {/* Core Info & Actions */}
          <div className="flex-1 text-left">
            
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#A7AFBF] mb-3">
              <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#101521] text-[#00D4FF] border border-[#00D4FF]/40 tracking-wider">
                {movie.quality} UHD
              </span>
              <div className="flex items-center gap-1 font-semibold text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-mono tabular-nums text-white text-sm">{movie.rating.toFixed(1)}</span>
                <span className="text-xs text-[#A7AFBF]">/ 10</span>
              </div>
              <span aria-hidden="true" className="text-[#A7AFBF]/50">·</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{movie.releaseYear}</span>
              </div>
              <span aria-hidden="true" className="text-[#A7AFBF]/50">·</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{movie.duration}</span>
              </div>
              <span aria-hidden="true" className="text-[#A7AFBF]/50">·</span>
              <div className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <span>{movie.country}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display mb-2">
              {movie.title}
            </h1>

            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <div className="text-xs sm:text-sm text-[#A7AFBF] italic mb-4">
                Original Title: {movie.originalTitle}
              </div>
            )}

            {/* Genre Tags (Zero-Pill: Clean unboxed text with subtle dividers) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#00D4FF] mb-5">
              {movie.genres.map((g, idx) => (
                <React.Fragment key={g}>
                  <button 
                    onClick={() => navigateTo(`/genre/${g}`, { genre: g })}
                    className="hover:underline cursor-pointer"
                  >
                    {g}
                  </button>
                  {idx < movie.genres.length - 1 && <span className="text-[#A7AFBF]/40">/</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Synopsis */}
            <p className="text-sm sm:text-base text-[#A7AFBF] leading-relaxed mb-8 max-w-3xl">
              {movie.description}
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
              <button
                onClick={() => navigateTo(`/watch/${movie.slug}`, { id: movie.id, title: movie.title })}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#3B2896] hover:brightness-110 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-[#7C5CFF]/30 transition-all active:scale-95 cursor-pointer glow-primary"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
                </div>
                <span>Watch Now</span>
              </button>

              <button
                onClick={() => addToWatchlist(movie)}
                className={`px-5 py-3.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  inWatchlist
                    ? 'bg-[#7C5CFF] border-[#7C5CFF] text-white'
                    : 'bg-[#151B28] border-[#1E2638] text-white hover:border-white/30'
                }`}
              >
                {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{inWatchlist ? 'In My List' : 'Add to My List'}</span>
              </button>

              <button
                onClick={() => setIsTrailerOpen(true)}
                className="px-5 py-3.5 rounded-xl bg-[#101521] border border-[#1E2638] hover:border-[#00D4FF] text-white text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Film className="w-4 h-4 text-[#00D4FF]" />
                <span>Watch Trailer</span>
              </button>

              <button
                onClick={handleShare}
                className="p-3.5 rounded-xl bg-[#101521] border border-[#1E2638] hover:border-white/30 text-[#A7AFBF] hover:text-white transition-all cursor-pointer"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Detailed Technical & Production Panels */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Cast Panel */}
          <div className="lg:col-span-2 bg-[#101521] rounded-2xl p-6 border border-[#1E2638]">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-[#7C5CFF]" />
              <span>Top Cast & Characters</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {movie.cast.map((actor, idx) => (
                <div 
                  key={actor}
                  onClick={() => navigateTo('/search', { q: actor })}
                  className="p-3 rounded-xl bg-[#151B28] border border-[#1E2638] hover:border-[#7C5CFF]/60 transition-all cursor-pointer group"
                >
                  <div className="text-xs font-bold text-white group-hover:text-[#00D4FF] truncate">
                    {actor}
                  </div>
                  <div className="text-[11px] text-[#A7AFBF] mt-0.5">
                    Lead Role {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications Panel */}
          <div className="bg-[#101521] rounded-2xl p-6 border border-[#1E2638]">
            <h3 className="text-base font-bold text-white mb-4">
              Movie Information
            </h3>
            <dl className="space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-[#151B28]">
                <dt className="text-[#A7AFBF]">Director</dt>
                <dd className="text-white font-medium">{movie.director}</dd>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#151B28]">
                <dt className="text-[#A7AFBF]">Country</dt>
                <dd className="text-white font-medium">{movie.country}</dd>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#151B28]">
                <dt className="text-[#A7AFBF]">Release Year</dt>
                <dd className="text-white font-medium">{movie.releaseYear}</dd>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#151B28]">
                <dt className="text-[#A7AFBF]">Duration</dt>
                <dd className="text-white font-medium">{movie.duration}</dd>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#151B28]">
                <dt className="text-[#A7AFBF]">Streaming Quality</dt>
                <dd className="text-[#00D4FF] font-bold">{movie.quality} Ultra HD</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#A7AFBF]">Total Views</dt>
                <dd className="text-white font-mono tabular-nums">{movie.views.toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* 4. Related Movies & More Like This */}
        <div className="mt-14 -mx-4 sm:-mx-6 lg:-mx-8">
          <CategorySection
            title="Related Movies"
            movies={relatedMovies}
            aspectRatio="poster"
          />

          <CategorySection
            title="More Like This"
            movies={moreLikeThis}
            aspectRatio="landscape"
          />
        </div>
      </div>

      {/* Trailer Modal */}
      {isTrailerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#101521] border border-[#1E2638] rounded-2xl max-w-4xl w-full p-4 overflow-hidden relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E2638]">
              <div className="text-sm font-bold text-white">
                Trailer: {movie.title}
              </div>
              <button
                onClick={() => setIsTrailerOpen(false)}
                className="text-[#A7AFBF] hover:text-white p-1 rounded-lg hover:bg-[#151B28] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Embedded Stream Demo */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
              <video
                src={movie.videoSources[0]?.url}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
