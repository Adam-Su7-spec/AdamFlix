using System.Text.Json;
using AdamFlix.Models;
using AdamFlix.Data;
using Microsoft.EntityFrameworkCore;

namespace AdamFlix.Services
{
    public interface IMovieCatalogService
    {
        List<Movie> GetMovies(string? genre = null, string? search = null);
        Movie? GetMovieById(string id);
        Movie AddMovie(CreateMovieDto dto);
        bool DeleteMovie(string id);
    }

    // EF-backed implementation that stores Movie as a JSON blob in MovieEntity.
    public class MovieCatalogService : IMovieCatalogService
    {
        private readonly AdamFlixDbContext _db;
        private readonly IVideoParserService _parser;

        public MovieCatalogService(AdamFlixDbContext db, IVideoParserService parser)
        {
            _db = db;
            _parser = parser;

            // Seed initial movies if DB is empty
            if (!_db.MovieEntities.Any())
            {
                SeedCatalog();
                _db.SaveChanges();
            }
        }

        private void SeedCatalog()
        {
            var seed = new List<Movie>
            {
                new Movie
                {
                    Id = "m-1",
                    Title = "The Quantum Horizon",
                    OriginalTitle = "The Quantum Horizon",
                    Slug = "the-quantum-horizon",
                    Description = "In 2088, an astronaut crew undertakes a desperate mission beyond the solar threshold into unknown quantum rifts.",
                    Poster = "/images/hero_scifi_voyage.jpg",
                    Backdrop = "/images/hero_scifi_voyage.jpg",
                    ReleaseYear = 2026,
                    Rating = 9.4,
                    Duration = "2h 38m",
                    Country = "United States",
                    Director = "Elena Vance",
                    Genres = new List<string> { "Sci-Fi", "Adventure", "Drama" },
                    Quality = "4K",
                    Type = "movie",
                    Badges = new List<string> { "EXCLUSIVE", "4K ULTRA HD" },
                    VideoSources = new List<VideoSource>
                    {
                        new VideoSource { Id = "srv-1", Name = "Server 1 (Alpha CDN)", Quality = "4K", Url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", Type = "direct" }
                    }
                },
                new Movie
                {
                    Id = "m-2",
                    Title = "Neon Shadows: Tokyo Drift",
                    OriginalTitle = "Tokyo Noir",
                    Slug = "neon-shadows-tokyo-drift",
                    Description = "An undercover agent gets embroiled in a high-stakes cybernetic syndicate war across rain-soaked futuristic Tokyo.",
                    Poster = "/images/backdrop_neon_noir.jpg",
                    Backdrop = "/images/backdrop_neon_noir.jpg",
                    ReleaseYear = 2025,
                    Rating = 8.9,
                    Duration = "2h 12m",
                    Country = "Japan",
                    Director = "Kenji Takahashi",
                    Genres = new List<string> { "Action", "Cyberpunk", "Thriller" },
                    Quality = "4K",
                    Type = "movie",
                    Badges = new List<string> { "TOP 10", "4K ULTRA HD" },
                    VideoSources = new List<VideoSource>
                    {
                        new VideoSource { Id = "srv-1", Name = "Server 1 (Alpha CDN)", Quality = "4K", Url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", Type = "direct" }
                    }
                }
            };

            foreach (var m in seed)
            {
                var json = JsonSerializer.Serialize(m);
                _db.MovieEntities.Add(new MovieEntity { Id = m.Id, JsonData = json });
            }
        }

        public List<Movie> GetMovies(string? genre = null, string? search = null)
        {
            var entities = _db.MovieEntities.AsNoTracking().ToList();
            var movies = entities.Select(e => JsonSerializer.Deserialize<Movie>(e.JsonData)!).ToList();

            var query = movies.AsEnumerable();
            if (!string.IsNullOrWhiteSpace(genre) && genre != "All")
                query = query.Where(m => m.Genres.Contains(genre, StringComparer.OrdinalIgnoreCase));
            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(m => m.Title.Contains(search, StringComparison.OrdinalIgnoreCase));
            return query.ToList();
        }

        public Movie? GetMovieById(string id)
        {
            var entity = _db.MovieEntities.AsNoTracking().FirstOrDefault(e => e.Id == id);
            if (entity == null) return null;
            return JsonSerializer.Deserialize<Movie>(entity.JsonData);
        }

        public Movie AddMovie(CreateMovieDto dto)
        {
            var parsed = _parser.ParseSource(dto.VideoSource);
            var movie = new Movie
            {
                Id = $"m-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
                Title = dto.Title,
                OriginalTitle = string.IsNullOrWhiteSpace(dto.OriginalTitle) ? dto.Title : dto.OriginalTitle,
                Slug = dto.Title.ToLowerInvariant().Replace(" ", "-").Replace(":" , ""),
                Description = dto.Description,
                Poster = dto.Poster,
                Backdrop = dto.Backdrop,
                ReleaseYear = dto.ReleaseYear,
                Rating = dto.Rating,
                Duration = dto.Duration,
                Country = dto.Country,
                Director = dto.Director,
                Genres = dto.Genres.Count > 0 ? dto.Genres : new List<string> { "Action" },
                Quality = dto.Quality,
                Type = dto.Type,
                Badges = new List<string> { "NEW", "4K ULTRA HD" },
                VideoSources = new List<VideoSource>
                {
                    new VideoSource
                    {
                        Id = "srv-1",
                        Name = $"Server 1 ({parsed.DetectedPlatform})",
                        Quality = dto.Quality,
                        Url = parsed.ResolvedUrl,
                        RawInput = dto.VideoSource,
                        Type = parsed.Type
                    }
                }
            };

            var json = JsonSerializer.Serialize(movie);
            var entity = new MovieEntity { Id = movie.Id, JsonData = json };
            _db.MovieEntities.Add(entity);
            _db.SaveChanges();

            return movie;
        }

        public bool DeleteMovie(string id)
        {
            var entity = _db.MovieEntities.FirstOrDefault(e => e.Id == id);
            if (entity == null) return false;
            _db.MovieEntities.Remove(entity);
            _db.SaveChanges();
            return true;
        }
    }
}
