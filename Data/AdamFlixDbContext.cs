using Microsoft.EntityFrameworkCore;
using AdamFlix.Models;

namespace AdamFlix.Data
{
    public class AdamFlixDbContext : DbContext
    {
        public AdamFlixDbContext(DbContextOptions<AdamFlixDbContext> options) : base(options) { }

        public DbSet<Movie> Movies { get; set; } = null!;
        public DbSet<MovieEntity> MovieEntities { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<WatchHistoryItem> WatchHistory { get; set; } = null!;
        public DbSet<WatchLaterItem> WatchLater { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User -> WatchHistory (one-to-many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.WatchHistory)
                .WithOne(h => h.User)
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User -> WatchLater (one-to-many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.WatchLater)
                .WithOne(l => l.User)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Movie -> WatchHistory (one-to-many)
            modelBuilder.Entity<Movie>()
                .HasMany(m => m.WatchedBy)
                .WithOne(h => h.Movie)
                .HasForeignKey(h => h.MovieId)
                .OnDelete(DeleteBehavior.Cascade);

            // Movie -> WatchLater (one-to-many)
            modelBuilder.Entity<Movie>()
                .HasMany(m => m.SavedBy)
                .WithOne(l => l.Movie)
                .HasForeignKey(l => l.MovieId)
                .OnDelete(DeleteBehavior.Cascade);

            // Prevent duplicate watch-later entries for the same user/movie
            modelBuilder.Entity<WatchLaterItem>()
                .HasIndex(w => new { w.UserId, w.MovieId })
                .IsUnique();

            // MovieEntity: store Movie model as JSON blob
            modelBuilder.Entity<MovieEntity>().HasKey(e => e.Id);
            modelBuilder.Entity<MovieEntity>().Property(e => e.JsonData).IsRequired();

            // Primary keys (string ids)
            modelBuilder.Entity<User>().HasKey(u => u.Id);
            modelBuilder.Entity<Movie>().HasKey(m => m.Id);
            modelBuilder.Entity<WatchHistoryItem>().HasKey(h => h.Id);
            modelBuilder.Entity<WatchLaterItem>().HasKey(l => l.Id);

            base.OnModelCreating(modelBuilder);
        }
    }
}
