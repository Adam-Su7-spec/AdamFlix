using AdamFlix.Services;
using AdamFlix.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddRazorComponents();
builder.Services.AddControllers();
builder.Services.AddHttpClient();

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
app.UseStaticFiles();
app.UseRouting();
app.UseAntiforgery();

app.MapControllers();
app.MapRazorComponents<AdamFlix.Components.AccountActivationModal>();

app.Run();
