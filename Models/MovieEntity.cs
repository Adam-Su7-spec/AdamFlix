using System;

namespace AdamFlix.Models
{
    // A simple DB-friendly wrapper for storing the Movie model as JSON.
    public class MovieEntity
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string JsonData { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
