namespace AdamFlix.Models
{
    public class VideoSource
    {
        public string Id { get; set; } = "srv-1";
        public string Name { get; set; } = "Server 1 (Primary Stream)";
        public string Quality { get; set; } = "4K";
        public string Url { get; set; } = string.Empty;
        public string RawInput { get; set; } = string.Empty;
        public string Type { get; set; } = "direct"; // direct, hls, iframe, youtube, vimeo, stream_server
    }

    public class VideoSourceAnalysis
    {
        public string Type { get; set; } = "direct";
        public string ResolvedUrl { get; set; } = string.Empty;
        public bool IsIframe { get; set; } = false;
        public string RawInput { get; set; } = string.Empty;
        public string DetectedPlatform { get; set; } = "Direct Video CDN";
    }

    public class StreamResolutionRequest
    {
        public string Input { get; set; } = string.Empty;
    }
}
