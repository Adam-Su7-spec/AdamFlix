import React, { useState } from 'react';
import { 
  Play, 
  Plus, 
  Check, 
  Star, 
  Calendar, 
  Clock, 
  Tv, 
  Share2, 
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Movie } from '../../types';
import { CategorySection } from '../common/CategorySection';

export const TVShowDetailsPage: React.FC = () => {
  const { movies, routeParams, navigateTo, isInWatchlist, addToWatchlist, showToast } = useApp();
  
  const show = movies.find(m => m.slug === routeParams.slug || m.id === routeParams.id) || movies.find(m => m.type === 'tv') || movies[0];

  const seasons = show.seasons || [
    {
      seasonNumber: 1,
      title: 'Season 1',
      episodes: []
    }
  ];

  const [activeSeasonNumber, setActiveSeasonNumber] = useState<number>(seasons[0]?.seasonNumber || 1);

  const activeSeason = seasons.find(s => s.seasonNumber === activeSeasonNumber) || seasons[0];
  const inWatchlist = isInWatchlist(show.id);

  const relatedShows = movies
    .filter(m => m.type === 'tv' && m.id !== show.id)
    .slice(0, 8);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  };

  const handleWatchEpisode = (seasonNum: number, episodeNum: number) => {
    navigateTo(`/watch/${show.slug}`, {
      id: show.id,
      title: show.title,
      season: seasonNum.toString(),
      episode: episodeNum.toString()
    });
  };

  return (
    <div className="w-full pb-20">
      
      {/* 1. Backdrop */}
      <div className="relative w-full h-[60vh] min-h-[460px] max-h-[640px] overflow-hidden bg-[#080B12]">
        <img
          src={show.backdrop || show.poster}
          alt={show.title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080B12] via-[#080B12]/80 to-transparent max-w-4xl" />
      </div>

      {/* 2. Series Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-44 sm:-mt-56 relative z-20">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Poster */}
          <div className="w-48 sm:w-64 lg:w-72 shrink-0 rounded-2xl overflow-hidden bg-[#151B28] border-2 border-[#1E2638] shadow-2xl mx-auto md:mx-0">
            <img
              src={show.poster}
              alt={show.title}
              className="w-full aspect-[2/3] object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 text-left">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#A7AFBF] mb-3">
              <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#7C5CFF]/30 text-[#7C5CFF] border border-[#7C5CFF]/40 tracking-wider">
                TV SERIES
              </span>
              <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#101521] text-[#00D4FF] border border-[#00D4FF]/40 tracking-wider">
                {show.quality} UHD
              </span>
              <div className="flex items-center gap-1 font-semibold text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-mono tabular-nums text-white text-sm">{show.rating.toFixed(1)}</span>
                <span className="text-xs text-[#A7AFBF]">/ 10</span>
              </div>
              <span aria-hidden="true" className="text-[#A7AFBF]/50">·</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{show.releaseYear}</span>
              </div>
              <span aria-hidden="true" className="text-[#A7AFBF]/50">·</span>
              <div className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>{seasons.length} {seasons.length === 1 ? 'Season' : 'Seasons'}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display mb-2">
              {show.title}
            </h1>

            {/* Genres */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#00D4FF] mb-5">
              {show.genres.map((g, idx) => (
                <React.Fragment key={g}>
                  <button 
                    onClick={() => navigateTo(`/genre/${g}`, { genre: g })}
                    className="hover:underline cursor-pointer"
                  >
                    {g}
                  </button>
                  {idx < show.genres.length - 1 && <span className="text-[#A7AFBF]/40">/</span>}
                </React.Fragment>
              ))}
            </div>

            <p className="text-sm sm:text-base text-[#A7AFBF] leading-relaxed mb-6 max-w-3xl">
              {show.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
              <button
                onClick={() => handleWatchEpisode(activeSeason.seasonNumber, 1)}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#3B2896] hover:brightness-110 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-[#7C5CFF]/30 transition-all active:scale-95 cursor-pointer glow-primary"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
                </div>
                <span>Watch S{activeSeason.seasonNumber}:E1</span>
              </button>

              <button
                onClick={() => addToWatchlist(show)}
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
                onClick={handleShare}
                className="p-3.5 rounded-xl bg-[#101521] border border-[#1E2638] hover:border-white/30 text-[#A7AFBF] hover:text-white transition-all cursor-pointer"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Season Tabs & Episode List */}
        <div className="mt-14 pt-8 border-t border-[#1E2638]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Episodes
              </h2>
              <p className="text-xs text-[#A7AFBF] mt-0.5">
                Select a season to view episodes and synopsis
              </p>
            </div>

            {/* Season Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {seasons.map((season) => (
                <button
                  key={season.seasonNumber}
                  onClick={() => setActiveSeasonNumber(season.seasonNumber)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeSeasonNumber === season.seasonNumber
                      ? 'bg-[#7C5CFF] text-white shadow-lg shadow-[#7C5CFF]/30'
                      : 'bg-[#101521] text-[#A7AFBF] hover:text-white border border-[#1E2638]'
                  }`}
                >
                  Season {season.seasonNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Episode Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSeason.episodes.map((episode) => (
              <div
                key={episode.id}
                className="group p-4 rounded-2xl bg-[#101521] border border-[#1E2638] hover:border-[#7C5CFF]/60 hover:shadow-xl transition-all flex flex-col sm:flex-row gap-4"
              >
                {/* Thumbnail */}
                <div className="relative w-full sm:w-44 aspect-video rounded-xl overflow-hidden bg-black shrink-0">
                  <img
                    src={episode.thumbnail || show.backdrop || show.poster}
                    alt={episode.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <button
                      onClick={() => handleWatchEpisode(activeSeason.seasonNumber, episode.episodeNumber)}
                      className="w-10 h-10 rounded-full bg-[#7C5CFF] text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white translate-x-0.5" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/75 text-[10px] font-mono text-white">
                    {episode.duration}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-mono font-bold text-[#00D4FF]">
                        Episode {episode.episodeNumber}
                      </span>
                      <span className="text-[10px] text-[#A7AFBF]">
                        {episode.airDate}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#00D4FF] transition-colors mb-1.5">
                      {episode.title}
                    </h3>
                    <p className="text-xs text-[#A7AFBF] line-clamp-2 leading-relaxed">
                      {episode.description}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-end">
                    <button
                      onClick={() => handleWatchEpisode(activeSeason.seasonNumber, episode.episodeNumber)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#151B28] hover:bg-[#7C5CFF] text-xs font-semibold text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Watch Episode</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Shows */}
        {relatedShows.length > 0 && (
          <div className="mt-14 -mx-4 sm:-mx-6 lg:-mx-8">
            <CategorySection
              title="Related Series"
              movies={relatedShows}
              aspectRatio="poster"
            />
          </div>
        )}
      </div>
    </div>
  );
};
