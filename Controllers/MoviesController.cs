using Microsoft.AspNetCore.Mvc;
using AdamFlix.Models;
using AdamFlix.Services;

namespace AdamFlix.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly IMovieCatalogService _catalogService;
        private readonly IVideoParserService _videoParser;

        public MoviesController(IMovieCatalogService catalogService, IVideoParserService videoParser)
        {
            _catalogService = catalogService;
            _videoParser = videoParser;
        }

        [HttpGet]
        public IActionResult GetAllMovies([FromQuery] string? genre, [FromQuery] string? search)
        {
            var movies = _catalogService.GetMovies(genre, search);
            return Ok(movies);
        }

        [HttpGet("{id}")]
        public IActionResult GetMovieById(string id)
        {
            var movie = _catalogService.GetMovieById(id);
            if (movie == null) return NotFound(new { success = false, message = "Movie not found." });
            return Ok(movie);
        }

        [HttpPost("resolve-source")]
        public IActionResult ResolveVideoSource([FromBody] StreamResolutionRequest request)
        {
            var analysis = _videoParser.ParseSource(request?.Input ?? "");
            return Ok(new { success = true, data = analysis });
        }

        [HttpPost]
        public IActionResult CreateMovie([FromBody] CreateMovieDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto?.Title))
                return BadRequest(new { success = false, message = "Title is required." });

            var movie = _catalogService.AddMovie(dto);
            return CreatedAtAction(nameof(GetMovieById), new { id = movie.Id }, movie);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMovie(string id)
        {
            var deleted = _catalogService.DeleteMovie(id);
            if (!deleted) return NotFound();
            return Ok(new { success = true, message = "Movie deleted." });
        }
    }
}
