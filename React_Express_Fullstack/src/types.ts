export type QualityType = '4K' | 'FHD' | 'HD';

export type VideoSourceType = 'direct' | 'hls' | 'iframe' | 'youtube' | 'vimeo' | 'external_embed';

export interface VideoSource {
  id: string;
  name: string;
  quality: QualityType;
  url: string;
  type?: VideoSourceType;
  rawInput?: string;
}

export interface SubtitleTrack {
  id: string;
  label: string;
  lang: string;
  url: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  airDate: string;
  videoSources: VideoSource[];
  subtitles: SubtitleTrack[];
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface Movie {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  type: 'movie' | 'tv';
  description: string;
  poster: string;
  backdrop: string;
  releaseYear: number;
  genres: string[];
  rating: number; // e.g. 8.8
  duration: string; // e.g. "2h 15m" or "3 Seasons"
  country: string;
  director: string;
  cast: string[];
  trailerUrl?: string;
  videoSources: VideoSource[];
  subtitles: SubtitleTrack[];
  quality: QualityType;
  badges?: ('NEW' | 'TRENDING' | 'TOP RATED')[];
  views: number;
  featured?: boolean;
  addedAt: string;
  seasons?: Season[]; // present if type === 'tv'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user';
  joinedDate: string;
  isVerified?: boolean;
  authProvider?: 'google' | 'admin' | 'guest';
}

export interface OtpVerificationState {
  isPending: boolean;
  email: string;
  name?: string;
  maskedEmail: string;
  tempSessionId?: string;
  expiresAt?: number;
  lastDispatchedAt?: number;
  attemptsLeft?: number;
  devOtpCode?: string;
}

export interface EmailDispatchRecord {
  id: string;
  to: string;
  subject: string;
  code: string;
  sentAt: string;
  status: 'delivered' | 'simulated';
  htmlPreview: string;
}

export interface WatchlistItem {
  id: string;
  contentId: string;
  type: 'movie' | 'tv';
  title: string;
  poster: string;
  backdrop: string;
  rating: number;
  releaseYear: number;
  quality: QualityType;
  genres: string[];
  addedAt: string;
}

export interface ContinueWatchingItem {
  id: string;
  contentId: string;
  type: 'movie' | 'tv';
  title: string;
  poster: string;
  backdrop: string;
  seasonNumber?: number;
  episodeNumber?: number;
  episodeTitle?: string;
  progressSeconds: number;
  durationSeconds: number;
  percentage: number;
  updatedAt: string;
}

export interface WatchHistoryItem {
  id: string;
  contentId: string;
  type: 'movie' | 'tv';
  title: string;
  poster: string;
  seasonNumber?: number;
  episodeNumber?: number;
  watchedAt: string;
  percentage: number;
}

export interface HomepageSectionConfig {
  id: string;
  title: string;
  enabled: boolean;
  filterType: 'genre' | 'special';
  filterValue: string;
}

export interface HomepageConfig {
  heroMovieId: string;
  heroCustomBackdrop?: string;
  featuredMovieIds: string[];
  sections: HomepageSectionConfig[];
}

export interface UserSettings {
  preferredQuality: QualityType;
  autoPlayNext: boolean;
  defaultSubtitles: string;
  audioLanguage: string;
}
