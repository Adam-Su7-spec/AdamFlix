import React, { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  RotateCw, 
  Settings, 
  Captions, 
  Server,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { parseVideoSource, ParsedVideoInfo } from '../../utils/videoUtils';

interface VideoPlayerProps {
  sourceUrl: string;
  poster?: string;
  title?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  selectedServerName?: string;
  subtitles?: { label: string; lang: string; url: string }[];
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  sourceUrl,
  poster,
  title,
  onTimeUpdate,
  onEnded,
  selectedServerName,
  subtitles = [],
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [parsed, setParsed] = useState<ParsedVideoInfo>(() => parseVideoSource(sourceUrl));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('Auto');
  const [selectedSubtitle, setSelectedSubtitle] = useState('Off');
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [iframeKey, setIframeKey] = useState(0);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update parsed video source whenever sourceUrl changes
  useEffect(() => {
    const nextParsed = parseVideoSource(sourceUrl);
    setParsed(nextParsed);
    setHasError(false);
    setErrorMessage('');
    setIsPlaying(false);
    setCurrentTime(0);

    // Clean up existing HLS
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Initialize HLS if needed
    if (nextParsed.type === 'hls' && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsRef.current = hls;
        hls.loadSource(nextParsed.resolvedUrl);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                setHasError(true);
                setErrorMessage('Unable to stream HLS video source.');
                break;
            }
          }
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native Safari HLS
        videoRef.current.src = nextParsed.resolvedUrl;
      }
    } else if (!nextParsed.isIframe && videoRef.current && nextParsed.resolvedUrl) {
      videoRef.current.src = nextParsed.resolvedUrl;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [sourceUrl]);

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen().catch(err => console.error(err));
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 100;
      setCurrentTime(cur);
      setDuration(dur);
      if (onTimeUpdate) {
        onTimeUpdate(cur, dur);
      }
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
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Reload iframe stream
  const reloadIframe = () => {
    setIframeKey(prev => prev + 1);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-[#1E2638] group select-none ${className}`}
    >
      {/* CASE 1: IFRAME EMBED OR EXTERNAL STREAMING SERVER */}
      {parsed.isIframe ? (
        <div className="relative w-full h-full bg-black">
          <iframe
            key={iframeKey}
            src={parsed.resolvedUrl}
            title={title || 'AdamFlix Streaming Player'}
            className="w-full h-full border-0 absolute inset-0 z-10"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
          />

          {/* Floating Top Bar for Iframe Player */}
          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto bg-[#080B12]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-white shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold">{parsed.detectedPlatform || 'External Stream'}</span>
              {selectedServerName && (
                <span className="text-[#A7AFBF] hidden sm:inline">· {selectedServerName}</span>
              )}
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={reloadIframe}
                title="Reload Stream"
                className="p-2 rounded-full bg-[#080B12]/80 hover:bg-[#1E2638] text-white backdrop-blur-md border border-white/10 transition-colors shadow-lg cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={toggleFullscreen}
                title="Toggle Fullscreen"
                className="p-2 rounded-full bg-[#080B12]/80 hover:bg-[#1E2638] text-white backdrop-blur-md border border-white/10 transition-colors shadow-lg cursor-pointer"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* CASE 2: DIRECT VIDEO (MP4, WEBM, HLS .M3U8) */
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
            onEnded={() => {
              setIsPlaying(false);
              if (onEnded) onEnded();
            }}
            onError={() => {
              setHasError(true);
              setErrorMessage('Failed to load video stream from source.');
            }}
            poster={poster}
            className="w-full h-full object-contain cursor-pointer"
            playsInline
          />

          {/* Big Center Play Button when Paused */}
          {!isPlaying && !hasError && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-opacity z-20"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#3B2896] text-white flex items-center justify-center shadow-2xl shadow-[#7C5CFF]/50 hover:scale-110 active:scale-95 transition-transform">
                <Play className="w-8 h-8 fill-white translate-x-1" />
              </div>
            </div>
          )}

          {/* Subtitle simulation banner */}
          {selectedSubtitle !== 'Off' && isPlaying && (
            <div className="absolute bottom-20 left-0 right-0 text-center pointer-events-none z-30 px-6">
              <span className="inline-block bg-black/80 text-white text-xs sm:text-sm font-medium px-3 py-1 rounded backdrop-blur-sm">
                [Subtitles · {selectedSubtitle}]
              </span>
            </div>
          )}

          {/* Error Banner */}
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080B12]/90 z-25 p-6 text-center">
              <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
              <h3 className="text-white font-bold text-lg mb-1">Playback Encountered an Issue</h3>
              <p className="text-xs text-[#A7AFBF] max-w-sm mb-4">{errorMessage}</p>
              <button
                onClick={() => {
                  setHasError(false);
                  if (videoRef.current) {
                    videoRef.current.load();
                    videoRef.current.play().catch(() => {});
                  }
                }}
                className="px-4 py-2 rounded-xl bg-[#7C5CFF] text-white font-semibold text-xs hover:bg-[#6846f5] transition-colors cursor-pointer"
              >
                Retry Stream
              </button>
            </div>
          )}

          {/* Custom Overlay Controls */}
          <div
            className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-4 sm:p-6 transition-opacity duration-300 z-30 ${
              showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Scrubber Bar */}
            <div className="w-full flex items-center gap-3 mb-3 group/timeline">
              <span className="text-xs font-mono text-[#A7AFBF] w-12 text-right">
                {formatTime(currentTime)}
              </span>
              <div className="relative flex-1 flex items-center h-4 cursor-pointer">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-[#1F293D] rounded-lg appearance-none cursor-pointer accent-[#7C5CFF] focus:outline-none"
                />
              </div>
              <span className="text-xs font-mono text-[#A7AFBF] w-12">
                {formatTime(duration)}
              </span>
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-[#00D4FF] transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
                </button>

                <button
                  onClick={() => skipSeconds(-10)}
                  className="text-[#A7AFBF] hover:text-white transition-colors cursor-pointer"
                  title="Rewind 10s"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={() => skipSeconds(10)}
                  className="text-[#A7AFBF] hover:text-white transition-colors cursor-pointer"
                  title="Forward 10s"
                >
                  <RotateCw className="w-5 h-5" />
                </button>

                {/* Volume slider */}
                <div className="flex items-center gap-2 group/vol">
                  <button
                    onClick={toggleMute}
                    className="text-[#A7AFBF] hover:text-white transition-colors cursor-pointer"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 sm:w-20 h-1 bg-[#1F293D] rounded-lg appearance-none cursor-pointer accent-[#7C5CFF]"
                  />
                </div>

                {parsed.detectedPlatform && (
                  <span className="hidden lg:inline-flex items-center gap-1.5 text-[11px] font-mono text-[#7C5CFF] bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 px-2 py-0.5 rounded-full">
                    {parsed.detectedPlatform}
                  </span>
                )}
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-3">
                {/* Speed Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="text-xs font-mono font-semibold px-2 py-1 rounded bg-[#101521] hover:bg-[#1A2234] text-[#A7AFBF] hover:text-white transition-colors cursor-pointer"
                  >
                    {playbackSpeed}x
                  </button>
                  {showSpeedMenu && (
                    <div className="absolute bottom-full mb-2 right-0 bg-[#0E1424] border border-[#1E2638] rounded-xl p-1 shadow-2xl flex flex-col gap-1 min-w-[70px] z-50">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedSelect(speed)}
                          className={`text-xs px-2 py-1 rounded text-left cursor-pointer ${
                            playbackSpeed === speed ? 'bg-[#7C5CFF] text-white font-bold' : 'text-[#A7AFBF] hover:bg-[#1A2234]'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtitles Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      selectedSubtitle !== 'Off' ? 'text-[#00D4FF]' : 'text-[#A7AFBF] hover:text-white'
                    }`}
                    title="Subtitles / Audio"
                  >
                    <Captions className="w-5 h-5" />
                  </button>
                  {showSubtitleMenu && (
                    <div className="absolute bottom-full mb-2 right-0 bg-[#0E1424] border border-[#1E2638] rounded-xl p-2 shadow-2xl flex flex-col gap-1 min-w-[120px] z-50">
                      <span className="text-[10px] text-[#A7AFBF] font-semibold px-2 py-1 uppercase tracking-wider">
                        Subtitles
                      </span>
                      {['Off', 'English', 'Spanish', 'French', 'Arabic', 'German'].map(sub => (
                        <button
                          key={sub}
                          onClick={() => {
                            setSelectedSubtitle(sub);
                            setShowSubtitleMenu(false);
                          }}
                          className={`text-xs px-2 py-1.5 rounded text-left cursor-pointer ${
                            selectedSubtitle === sub ? 'bg-[#7C5CFF] text-white font-bold' : 'text-[#A7AFBF] hover:bg-[#1A2234]'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="text-[#A7AFBF] hover:text-white transition-colors cursor-pointer"
                  title="Fullscreen (f)"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
