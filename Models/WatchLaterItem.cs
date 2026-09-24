using System;

namespace AdamFlix.Models
{
    // Per-user watch-later record that points to a global Movie by MovieId.
    public class WatchLaterItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        // The user who saved the movie for later
        public string UserId { get; set; } = string.Empty;
        public User? User { get; set; }

        // The movie (global) this watch-later entry refers to
        public string MovieId { get; set; } = string.Empty;
        public Movie? Movie { get; set; }

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }
}
