using AdamFlix.Services;
using AdamFlix.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddRazorComponents();
builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// AdamFlix Core Services
builder.Services.AddSingleton<IAuthService, AuthService>();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddSingleton<IVideoParserService, VideoParserService>();
// Movie catalog is EF-backed and depends on DbContext, register as scoped
builder.Services.AddScoped<IMovieCatalogService, MovieCatalogService>();

// Register EF Core DbContext using a relational provider. The default
// connection string should be provided in appsettings.json under
// "ConnectionStrings:DefaultConnection". The user selected PostgreSQL,
// so we use Npgsql here. Replace with UseSqlServer(...) for SQL Server.
var conn = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AdamFlixDbContext>(options =>
    options.UseNpgsql(conn));

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
// Serve default files (index.html) if present, then static files
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();
app.UseAntiforgery();

// Enable Swagger UI in all environments so the API is discoverable in Production
app.UseSwagger();
app.UseSwaggerUI();

// Map a root endpoint to redirect to Swagger UI for convenience
app.MapGet("/", () => Results.Redirect("/swagger"));

app.MapControllers();
app.MapRazorComponents<AdamFlix.Components.AccountActivationModal>();

// Log registered endpoints at startup to help diagnose routing/404 issues.
// Must run after MapControllers/MapRazorComponents so endpoints are populated.
try
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    var endpointSource = app.Services.GetService<EndpointDataSource>();
    if (endpointSource != null)
    {
        foreach (var ep in endpointSource.Endpoints)
        {
            // If it's a RouteEndpoint, extract route pattern and HTTP methods
            if (ep is RouteEndpoint routeEp)
            {
                var pattern = routeEp.RoutePattern?.RawText ?? routeEp.RoutePattern?.ToString() ?? "[unknown pattern]";
                logger.LogInformation("Registered route endpoint: DisplayName='{DisplayName}' Pattern='{Pattern}'", routeEp.DisplayName, pattern);
            }
            else
            {
                logger.LogInformation("Registered endpoint: {Endpoint}", ep.DisplayName ?? ep.ToString());
            }
        }
    }
    else
    {
        var loggerFallback = app.Services.GetRequiredService<ILogger<Program>>();
        loggerFallback.LogWarning("EndpointDataSource not available to enumerate endpoints.");
    }
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "Error while enumerating endpoints at startup.");
}

app.Run();
