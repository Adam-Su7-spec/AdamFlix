/**
 * AdamFlix Cinema Player Engine
 * Handles HLS (.m3u8), Native MP4, Fullscreen, and Iframe Sandbox Integration
 */
window.AdamFlixPlayer = {
  hlsInstances: {},

  init: function(videoElementId, sourceUrl) {
    const video = document.getElementById(videoElementId);
    if (!video) return;

    // Check for HLS (.m3u8)
    if (sourceUrl.includes('.m3u8')) {
      if (window.Hls && window.Hls.isSupported()) {
        if (this.hlsInstances[videoElementId]) {
          this.hlsInstances[videoElementId].destroy();
        }
        const hls = new window.Hls({
          capLevelToPlayerSize: true,
          autoStartLoad: true
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
        this.hlsInstances[videoElementId] = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
      }
    } else {
      video.src = sourceUrl;
    }
  },

  seek: function(videoElementId, seconds) {
    const video = document.getElementById(videoElementId);
    if (video) video.currentTime = seconds;
  },

  setPlaybackRate: function(videoElementId, rate) {
    const video = document.getElementById(videoElementId);
    if (video) video.playbackRate = rate;
  },

  toggleFullscreen: function(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(err => console.warn(err));
    } else {
      document.exitFullscreen();
    }
  }
};
