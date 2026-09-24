import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  RotateCw, 
  Server, 
  Captions, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Share2,
  Check,
  Star,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CategorySection } from '../common/CategorySection';
import { Movie, Episode } from '../../types';
import { VideoPlayer } from '../player/VideoPlayer';

export const WatchPage: React.FC = () => {
  const { 
    movies, 
    routeParams, 
    navigateTo, 
    updateContinueWatching, 
    recordWatchHistory,
    userSettings,
    showToast
  } = useApp();

  // Find content
  const content = movies.find(m => m.slug === routeParams.slug || m.id === routeParams.id) || movies[0];

  const isTV = content.type === 'tv';
  const currentSeasonNum = parseInt(routeParams.season || '1', 10);
  const currentEpisodeNum = parseInt(routeParams.episode || '1', 10);

  // TV specific episode resolver
  const currentSeason = isTV && content.seasons 
    ? content.seasons.find(s => s.seasonNumber === currentSeasonNum) || content.seasons[0]
    : null;

  const currentEpisode: Episode | null = currentSeason && currentSeason.episodes
    ? currentSeason.episodes.find(e => e.episodeNumber === currentEpisodeNum) || currentSeason.episodes[0] || null
    : null;

  // Video element state
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedServer, setSelectedServer] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState(userSettings.preferredQuality || '4K');
  const [selectedSubtitle, setSelectedSubtitle] = useState('English');
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Select sources list and active source
  const sourcesList = (currentEpisode?.videoSources || content.videoSources || []);
  const selectedSource = sourcesList[selectedServer] || sourcesList[0];
  const currentSourceUrl = selectedSource?.rawInput || selectedSource?.url || content.videoSources?.[0]?.url || '';

  // Record history when user loads the stream
  useEffect(() => {
    recordWatchHistory(content, isTV ? currentSeasonNum : undefined, isTV ? currentEpisodeNum : undefined);
  }, [content.id, currentSeasonNum, currentEpisodeNum]);

  // Video time tracking & continue watching updater
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 100;
      setCurrentTime(current);
      setDuration(dur);

      // Periodically sync progress
      if (Math.floor(current) % 10 === 0 && current > 5) {
        updateContinueWatching({
          contentId: content.id,
          type: content.type,
          title: isTV && currentEpisode ? `${content.title}: ${currentEpisode.title}` : content.title,
          poster: content.poster,
          backdrop: content.backdrop,
          seasonNumber: isTV ? currentSeasonNum : undefined,
          episodeNumber: isTV ? currentEpisodeNum : undefined,
          episodeTitle: currentEpisode?.title,
          progressSeconds: Math.floor(current),
          durationSeconds: Math.floor(dur)
        });
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTo;
      setCurrentTime(seekTo);
    }
  };

  const skipSeconds = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
    showToast(`Speed set to ${speed}x`);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3500);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Episode Next / Previous handlers
  const handleNextEpisode = () => {
    if (!currentSeason) return;
    const nextEp = currentSeason.episodes.find(e => e.episodeNumber === currentEpisodeNum + 1);
    if (nextEp) {
      navigateTo(`/watch/${content.slug}`, {
        id: content.id,
        title: content.title,
        season: currentSeasonNum.toString(),
        episode: nextEp.episodeNumber.toString()
      });
    } else {
      showToast('You are on the latest episode of this season.');
    }
  };

  const handlePrevEpisode = () => {
    if (!currentSeason) return;
    const prevEp = currentSeason.episodes.find(e => e.episodeNumber === currentEpisodeNum - 1);
    if (prevEp) {
      navigateTo(`/watch/${content.slug}`, {
        id: content.id,
        title: content.title,
        season: currentSeasonNum.toString(),
        episode: prevEp.episodeNumber.toString()
      });
    }
  };

  const relatedTitles = movies.filter(m => m.id !== content.id).slice(0, 8);

  return (
    <div className="w-full pb-20">
      
      {/* Title Header Above Player */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2638]">
        <div>
          <button
            onClick={() => navigateTo(isTV ? `/tv-show/${content.slug}` : `/movie/${content.slug}`, { id: content.id, title: content.title })}
            className="text-xs text-[#00D4FF] hover:underline flex items-center gap-1 mb-1 cursor-pointer"
          >
            ← Back to Overview
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
              {content.title}
            </h1>
            {isTV && currentEpisode && (
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#7C5CFF]/30 text-[#7C5CFF] border border-[#7C5CFF]/40">
                S{currentSeasonNum} : E{currentEpisodeNum} – {currentEpisode.title}
              </span>
            )}
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-[#A7AFBF] bg-[#101521] px-3 py-1.5 rounded-xl border border-[#1E2638]">
            <Server className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span>Streaming: {content.videoSources[selectedServer]?.name.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      {/* Main Video Cinema Container - Universal VideoPlayer (Direct, HLS, Iframe, External Servers) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <VideoPlayer
          sourceUrl={currentSourceUrl}
          poster={content.backdrop || content.poster}
          title={isTV && currentEpisode ? `${content.title}: ${currentEpisode.title}` : content.title}
          selectedServerName={selectedSource?.name}
          onTimeUpdate={(current, dur) => {
            if (Math.floor(current) % 10 === 0 && current > 5) {
              updateContinueWatching({
                contentId: content.id,
                type: content.type,
                title: isTV && currentEpisode ? `${content.title}: ${currentEpisode.title}` : content.title,
                poster: content.poster,
                backdrop: content.backdrop,
                seasonNumber: isTV ? currentSeasonNum : undefined,
                episodeNumber: isTV ? currentEpisodeNum : undefined,
                episodeTitle: currentEpisode?.title,
                progressSeconds: Math.floor(current),
                durationSeconds: Math.floor(dur)
              });
            }
          }}
          onEnded={() => {
            if (isTV) {
              handleNextEpisode();
            }
          }}
        />

        {/* Server Selection Panel */}
        <div className="mt-4 p-4 rounded-xl bg-[#101521] border border-[#1E2638] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#7C5CFF]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Streaming Server:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {sourcesList.map((srv, idx) => (
              <button
                key={srv.id || idx}
                onClick={() => {
                  setSelectedServer(idx);
                  showToast(`Connected to ${srv.name}`);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedServer === idx
                    ? 'bg-[#7C5CFF] text-white shadow-md shadow-[#7C5CFF]/30'
                    : 'bg-[#151B28] text-[#A7AFBF] hover:text-white border border-[#1E2638]'
                }`}
              >
                <span>{srv.name}</span>
                {srv.type === 'iframe' && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-black/40 text-emerald-400 font-mono">
                    Embed
                  </span>
                )}
                {srv.type === 'hls' && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-black/40 text-[#00D4FF] font-mono">
                    HLS
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* TV Series Episode Drawer (If Content is TV Series) */}
        {isTV && currentSeason && (
          <div className="mt-6 p-5 rounded-2xl bg-[#101521] border border-[#1E2638]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00D4FF]" />
                <span>Season {currentSeasonNum} Episodes</span>
              </h3>
              <span className="text-xs text-[#A7AFBF]">
                Currently playing Episode {currentEpisodeNum}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {currentSeason.episodes.map((ep) => {
                const isCurrent = ep.episodeNumber === currentEpisodeNum;
                return (
                  <button
                    key={ep.id}
                    onClick={() => {
                      navigateTo(`/watch/${content.slug}`, {
                        id: content.id,
                        title: content.title,
                        season: currentSeasonNum.toString(),
                        episode: ep.episodeNumber.toString()
                      });
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex gap-3 ${
                      isCurrent
                        ? 'bg-[#151B28] border-[#7C5CFF] ring-1 ring-[#7C5CFF]'
                        : 'bg-[#151B28]/50 border-[#1E2638] hover:border-white/20'
                    }`}
                  >
                    <img 
                      src={ep.thumbnail || content.poster} 
                      alt={ep.title} 
                      className="w-16 h-11 object-cover rounded bg-black shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-mono text-[#00D4FF]">
                        Episode {ep.episodeNumber}
                      </div>
                      <div className="text-xs font-bold text-white truncate">
                        {ep.title}
                      </div>
                      <div className="text-[10px] text-[#A7AFBF] mt-0.5">
                        {ep.duration}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content Below Video: Information & Technical Details */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#101521] border border-[#1E2638]">
            <h3 className="text-base font-bold text-white mb-2">
              About {isTV && currentEpisode ? currentEpisode.title : content.title}
            </h3>
            <p className="text-sm text-[#A7AFBF] leading-relaxed mb-6">
              {isTV && currentEpisode ? currentEpisode.description : content.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs pt-4 border-t border-[#151B28]">
              <div>
                <span className="text-[#A7AFBF] block mb-1">Director</span>
                <span className="text-white font-medium">{content.director}</span>
              </div>
              <div>
                <span className="text-[#A7AFBF] block mb-1">Genres</span>
                <span className="text-white font-medium">{content.genres.join(', ')}</span>
              </div>
              <div>
                <span className="text-[#A7AFBF] block mb-1">Release</span>
                <span className="text-white font-medium">{content.releaseYear}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#101521] border border-[#1E2638]">
            <h3 className="text-base font-bold text-white mb-4">
              Stream Information
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between pb-2 border-b border-[#151B28]">
                <span className="text-[#A7AFBF]">Resolution</span>
                <span className="text-[#00D4FF] font-bold">{selectedQuality} UHD HDR</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#151B28]">
                <span className="text-[#A7AFBF]">Audio</span>
                <span className="text-white font-medium">Dolby Atmos / 5.1 Surround</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#151B28]">
                <span className="text-[#A7AFBF]">Subtitles</span>
                <span className="text-white font-medium">{selectedSubtitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A7AFBF]">Licensing</span>
                <span className="text-emerald-400 font-medium">Verified Commercial License</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Titles */}
        <div className="mt-12 -mx-4 sm:-mx-6 lg:-mx-8">
          <CategorySection
            title="More Like This"
            movies={relatedTitles}
            aspectRatio="poster"
          />
        </div>
      </div>
    </div>
  );
};
