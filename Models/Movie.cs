using System;
using System.Collections.Generic;

namespace AdamFlix.Models
{
    public class Movie
    {
        // Movies are global entities and are NOT tied to a specific user id.
        // Admins create/update/delete Movie records and those changes are
        // visible to all users.
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Title { get; set; } = string.Empty;
        public string OriginalTitle { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Poster { get; set; } = string.Empty;
        public string Backdrop { get; set; } = string.Empty;
        public int ReleaseYear { get; set; } = 2026;
        public double Rating { get; set; } = 8.5;
        public string Duration { get; set; } = "2h 15m";
        public string Country { get; set; } = "United States";
        public string Director { get; set; } = "AdamFlix Studios";
        public List<string> Genres { get; set; } = new();
        public List<string> Cast { get; set; } = new();
        public string Quality { get; set; } = "4K";
        public string Type { get; set; } = "movie"; // "movie" or "tv"
        public List<string> Badges { get; set; } = new() { "NEW", "4K ULTRA HD" };
        public List<VideoSource> VideoSources { get; set; } = new();
        public List<Season>? Seasons { get; set; }

        // Inverse navigation: which users have this movie in their history / watch-later.
        public List<WatchHistoryItem> WatchedBy { get; set; } = new();
        public List<WatchLaterItem> SavedBy { get; set; } = new();
    }

    public class Season
    {
        public int SeasonNumber { get; set; } = 1;
        public string Title { get; set; } = "Season 1";
        public List<Episode> Episodes { get; set; } = new();
    }

    public class Episode
    {
        public int EpisodeNumber { get; set; } = 1;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Thumbnail { get; set; } = string.Empty;
        public string Duration { get; set; } = "50m";
        public List<VideoSource> VideoSources { get; set; } = new();
    }

    public class CreateMovieDto
    {
        public string Title { get; set; } = string.Empty;
        public string OriginalTitle { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Poster { get; set; } = string.Empty;
        public string Backdrop { get; set; } = string.Empty;
        public int ReleaseYear { get; set; } = 2026;
        public double Rating { get; set; } = 8.5;
        public string Duration { get; set; } = "2h 10m";
        public string Country { get; set; } = "United States";
        public string Director { get; set; } = "AdamFlix Studios";
        public List<string> Genres { get; set; } = new();
        public string Quality { get; set; } = "4K";
        public string VideoSource { get; set; } = string.Empty;
        public string Type { get; set; } = "movie";
    }

    public class AdminStats
    {
        public int TotalMovies { get; set; }
        public int TotalTvShows { get; set; }
        public int TotalEpisodes { get; set; }
        public int ActiveStreamUsers { get; set; }
        public string TotalStorageUsed { get; set; } = "18.4 TB";
        public string UptimePercentage { get; set; } = "99.98%";
    }
}
