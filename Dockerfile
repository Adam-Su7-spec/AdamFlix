# Multi-stage Dockerfile for AdamFlix (.NET 8)
# Production-ready image: build with the SDK, publish, then run on the smaller ASP.NET runtime image

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file separately to leverage Docker layer caching for dotnet restore
COPY ["AdamFlix.csproj", "./"]
RUN dotnet restore "AdamFlix.csproj"

# Copy the rest of the sources and publish
COPY . .
RUN dotnet publish "AdamFlix.csproj" -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
ENV DOTNET_RUNNING_IN_CONTAINER=true \
	ASPNETCORE_URLS=http://+:80 \
	ASPNETCORE_ENVIRONMENT=Production

WORKDIR /app

# Copy published output from build stage
COPY --from=build /app/publish ./

# Create non-root user for improved container security (skip if already exists)
RUN if ! id -u app >/dev/null 2>&1; then \
	  adduser --disabled-password --gecos "" app; \
	fi && chown -R app:app /app
USER app

EXPOSE 80

# Healthcheck: polls the root endpoint. Adjust path if needed.
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -f http://localhost/ || exit 1

ENTRYPOINT ["dotnet", "AdamFlix.dll"]
