using System.Text.RegularExpressions;
using AdamFlix.Models;

namespace AdamFlix.Services
{
    public interface IVideoParserService
    {
        VideoSourceAnalysis ParseSource(string rawInput);
    }

    public class VideoParserService : IVideoParserService
    {
        public VideoSourceAnalysis ParseSource(string rawInput)
        {
            if (string.IsNullOrWhiteSpace(rawInput))
            {
                return new VideoSourceAnalysis { Type = "direct", ResolvedUrl = "", DetectedPlatform = "None" };
            }

            var trimmed = rawInput.Trim();

            // 1. Raw <iframe> tag
            if (trimmed.Contains("<iframe", StringComparison.OrdinalIgnoreCase) && 
                trimmed.Contains("src=", StringComparison.OrdinalIgnoreCase))
            {
                var match = Regex.Match(trimmed, @"src=[""']([^""']+)[""']", RegexOptions.IgnoreCase);
                return new VideoSourceAnalysis
                {
                    Type = "iframe",
                    ResolvedUrl = match.Success ? match.Groups[1].Value : trimmed,
                    IsIframe = true,
                    RawInput = trimmed,
                    DetectedPlatform = "Embedded Iframe Player"
                };
            }

            // 2. HLS stream (.m3u8)
            if (trimmed.Contains(".m3u8", StringComparison.OrdinalIgnoreCase))
            {
                return new VideoSourceAnalysis
                {
                    Type = "hls",
                    ResolvedUrl = trimmed,
                    IsIframe = false,
                    RawInput = trimmed,
                    DetectedPlatform = "HLS Stream Manifest (.m3u8)"
                };
            }

            // 3. YouTube
            if (trimmed.Contains("youtube.com") || trimmed.Contains("youtu.be"))
            {
                var videoId = "";
                if (trimmed.Contains("youtu.be/")) videoId = trimmed.Split("youtu.be/")[1].Split('?')[0];
                else if (trimmed.Contains("watch?v=")) videoId = trimmed.Split("watch?v=")[1].Split('&')[0];
                else if (trimmed.Contains("/embed/")) videoId = trimmed.Split("/embed/")[1].Split('?')[0];

                return new VideoSourceAnalysis
                {
                    Type = "youtube",
                    ResolvedUrl = !string.IsNullOrEmpty(videoId) ? $"https://www.youtube.com/embed/{videoId}?autoplay=1&rel=0" : trimmed,
                    IsIframe = true,
                    RawInput = trimmed,
                    DetectedPlatform = "YouTube Embed"
                };
            }

            // 4. Vimeo
            if (trimmed.Contains("vimeo.com"))
            {
                var match = Regex.Match(trimmed, @"vimeo\.com/(?:channels/(?:\w+/)?|groups/[^/]*/videos/|album/\d+/video/|video/|)(\d+)");
                var vimeoId = match.Success ? match.Groups[1].Value : "";
                return new VideoSourceAnalysis
                {
                    Type = "vimeo",
                    ResolvedUrl = !string.IsNullOrEmpty(vimeoId) ? $"https://player.vimeo.com/video/{vimeoId}?autoplay=1" : trimmed,
                    IsIframe = true,
                    RawInput = trimmed,
                    DetectedPlatform = "Vimeo Player"
                };
            }

            // 5. External streaming server (vidsrc, streamtape, 2embed, etc.)
            if (trimmed.Contains("vidsrc") || trimmed.Contains("streamtape") || 
                trimmed.Contains("2embed") || trimmed.Contains("player") || trimmed.Contains("embed"))
            {
                return new VideoSourceAnalysis
                {
                    Type = "stream_server",
                    ResolvedUrl = trimmed,
                    IsIframe = true,
                    RawInput = trimmed,
                    DetectedPlatform = "External Streaming Server (Iframe Mode)"
                };
            }

            // 6. Direct MP4 link
            return new VideoSourceAnalysis
            {
                Type = "direct",
                ResolvedUrl = trimmed,
                IsIframe = false,
                RawInput = trimmed,
                DetectedPlatform = "Direct Video CDN (.mp4)"
            };
        }
    }
}
