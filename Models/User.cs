using System;
using System.Collections.Generic;

namespace AdamFlix.Models
{
    public class User
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public string Role { get; set; } = "user"; // "admin" or "user"
        public string JoinedDate { get; set; } = DateTime.UtcNow.ToString("MMMM yyyy");
        public bool IsVerified { get; set; } = false;
        public string AuthProvider { get; set; } = "google";

        // Navigation: per-user data. These collections store only user-scoped
        // records that reference global Movie entries by MovieId.
        // Movies themselves are global and not tied to a specific user.
        public List<WatchHistoryItem> WatchHistory { get; set; } = new();
        public List<WatchLaterItem> WatchLater { get; set; } = new();
    }
}
