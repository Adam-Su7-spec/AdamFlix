using System;

namespace AdamFlix.Models
{
    // Per-user watch-history record that points to a global Movie by MovieId.
    public class WatchHistoryItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        // The user who owns this history entry
        public string UserId { get; set; } = string.Empty;
        public User? User { get; set; }

        // The movie (global) this history entry refers to
        public string MovieId { get; set; } = string.Empty;
        public Movie? Movie { get; set; }

        // Metadata about the viewing
        public DateTime WatchedAt { get; set; } = DateTime.UtcNow;
        public double ProgressSeconds { get; set; } = 0; // how far into the video the user got
        public double DurationSeconds { get; set; } = 0;
    }
}
