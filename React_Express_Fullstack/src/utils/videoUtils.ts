import { VideoSourceType } from '../types';

export interface ParsedVideoInfo {
  type: VideoSourceType;
  resolvedUrl: string;
  originalInput: string;
  isIframe: boolean;
  iframeAttributes?: {
    allowFullScreen?: boolean;
    sandbox?: string;
    allow?: string;
  };
  detectedPlatform?: string;
}

/**
 * Extracts src URL from an iframe string if present, or returns the trimmed URL
 */
export function extractIframeSrc(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (trimmed.includes('<iframe') || trimmed.includes('<IFRAME')) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }
  return null;
}

/**
 * Parses any video stream input: direct links, HLS (.m3u8), streaming platforms, or iframe embed code.
 */
export function parseVideoSource(input: string): ParsedVideoInfo {
  const raw = (input || '').trim();

  if (!raw) {
    return {
      type: 'direct',
      resolvedUrl: '',
      originalInput: '',
      isIframe: false,
      detectedPlatform: 'None'
    };
  }

  // 1. Raw iframe embed code detection
  const extractedSrc = extractIframeSrc(raw);
  if (extractedSrc) {
    return {
      type: 'iframe',
      resolvedUrl: extractedSrc,
      originalInput: raw,
      isIframe: true,
      detectedPlatform: detectHostPlatform(extractedSrc) || 'Custom Iframe Embed',
      iframeAttributes: {
        allowFullScreen: true,
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen'
      }
    };
  }

  // 2. YouTube
  const ytMatch = raw.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      resolvedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
      originalInput: raw,
      isIframe: true,
      detectedPlatform: 'YouTube Embed'
    };
  }

  // 3. Vimeo
  const vimeoMatch = raw.match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+))/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      resolvedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
      originalInput: raw,
      isIframe: true,
      detectedPlatform: 'Vimeo Player'
    };
  }

  // 4. Dailymotion
  const dmMatch = raw.match(/(?:dailymotion\.com\/(?:video|embed\/video)\/|dai\.ly\/)([a-zA-Z0-9]+)/i);
  if (dmMatch && dmMatch[1]) {
    const videoId = dmMatch[1];
    return {
      type: 'external_embed',
      resolvedUrl: `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1`,
      originalInput: raw,
      isIframe: true,
      detectedPlatform: 'Dailymotion'
    };
  }

  // 5. HLS streaming (.m3u8)
  if (/\.m3u8($|\?)/i.test(raw)) {
    return {
      type: 'hls',
      resolvedUrl: raw,
      originalInput: raw,
      isIframe: false,
      detectedPlatform: 'HLS Live/VOD Stream (.m3u8)'
    };
  }

  // 6. Known external movie/embed server hosts (Streamtape, VidSrc, Superembed, Mixdrop, etc.)
  const knownEmbedHosts = [
    'vidsrc', 'superembed', 'streamtape', 'vidcloud', 'mixdrop',
    'doodstream', 'filemoon', 'embed', 'player', 'vidlox', 'upstream'
  ];
  const isEmbedHost = knownEmbedHosts.some(host => raw.toLowerCase().includes(host));

  if (isEmbedHost || raw.includes('/embed/') || raw.includes('/e/')) {
    return {
      type: 'external_embed',
      resolvedUrl: raw,
      originalInput: raw,
      isIframe: true,
      detectedPlatform: detectHostPlatform(raw) || 'External Video Server'
    };
  }

  // 7. Direct video files or fallback
  let platform = 'Direct MP4/WebM Video';
  if (/\.mp4($|\?)/i.test(raw)) platform = 'MP4 Video Stream';
  else if (/\.webm($|\?)/i.test(raw)) platform = 'WebM Video Stream';

  return {
    type: 'direct',
    resolvedUrl: raw,
    originalInput: raw,
    isIframe: false,
    detectedPlatform: platform
  };
}

function detectHostPlatform(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace('www.', '');
    if (host.includes('youtube')) return 'YouTube';
    if (host.includes('vimeo')) return 'Vimeo';
    if (host.includes('dailymotion')) return 'Dailymotion';
    if (host.includes('vidsrc')) return 'VidSrc Movie Server';
    if (host.includes('superembed')) return 'SuperEmbed Player';
    if (host.includes('streamtape')) return 'Streamtape Server';
    if (host.includes('mixdrop')) return 'Mixdrop Server';
    if (host.includes('filemoon')) return 'Filemoon Server';
    return host;
  } catch {
    return null;
  }
}
