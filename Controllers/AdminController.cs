using Microsoft.AspNetCore.Mvc;
using AdamFlix.Models;
using AdamFlix.Services;
using Microsoft.Extensions.Configuration;

namespace AdamFlix.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IMovieCatalogService _catalog;
        private readonly string _authorizedAdminEmail;

        public AdminController(IMovieCatalogService catalog, IConfiguration config)
        {
            _catalog = catalog;
            _authorizedAdminEmail = config["AdminSecurity:AuthorizedAdminEmail"] ?? string.Empty;
        }

        [HttpGet("stats")]
        public IActionResult GetAdminStats([FromHeader(Name = "X-Admin-Email")] string? adminEmail)
        {
            // Security gate
            if (string.IsNullOrWhiteSpace(adminEmail) || 
                string.IsNullOrWhiteSpace(_authorizedAdminEmail) ||
                !adminEmail.Equals(_authorizedAdminEmail, StringComparison.OrdinalIgnoreCase))
            {
                return StatusCode(StatusCodes.Status403Forbidden, new
                {
                    success = false,
                    error = "UNAUTHORIZED_ADMIN_ACCESS",
                    message = $"Security Violation: The AdamFlix Admin Dashboard is strictly restricted to {_authorizedAdminEmail}."
                });
            }

            var stats = new AdminStats
            {
                TotalMovies = _catalog.GetMovies().Count(m => m.Type == "movie"),
                TotalTvShows = _catalog.GetMovies().Count(m => m.Type == "tv"),
                TotalEpisodes = 142,
                ActiveStreamUsers = 1248,
                TotalStorageUsed = "18.4 TB",
                UptimePercentage = "99.98%"
            };

            return Ok(stats);
        }
    }
}
