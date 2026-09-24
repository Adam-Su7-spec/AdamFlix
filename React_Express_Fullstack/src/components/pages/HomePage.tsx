import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { HeroSection } from '../home/HeroSection';
import { CategorySection } from '../common/CategorySection';
import { Movie } from '../../types';

export const HomePage: React.FC = () => {
  const { movies, homepageConfig, navigateTo } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  // Smooth visual experience while initial content is fetching / hydrating
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  // Pick featured movies for the hero carousel
  const heroMovies = homepageConfig.featuredMovieIds
    .map(id => movies.find(m => m.id === id))
    .filter((m): m is Movie => m !== undefined);

  const fallbackHero = heroMovies.length > 0 ? heroMovies : [movies[0]];

  // Section data resolvers based on filterType and filterValue
  const getSectionMovies = (filterType: string, filterValue: string): Movie[] => {
    if (filterType === 'genre') {
      return movies.filter(m => m.genres.some(g => g.toLowerCase() === filterValue.toLowerCase()));
    }

    switch (filterValue) {
      case 'latest_movies':
        return movies.filter(m => m.type === 'movie').sort((a, b) => b.releaseYear - a.releaseYear);
      case 'latest_tv':
        return movies.filter(m => m.type === 'tv').sort((a, b) => b.releaseYear - a.releaseYear);
      case 'trending':
        return movies.filter(m => m.badges?.includes('TRENDING') || m.rating >= 8.8);
      case 'most_watched':
        return [...movies].sort((a, b) => b.views - a.views);
      case 'recommended':
        return [...movies].filter(m => m.rating >= 8.5).sort((a, b) => b.rating - a.rating);
      default:
        return movies;
    }
  };

  const handleSectionViewAll = (sectionTitle: string, filterType: string, filterValue: string) => {
    if (filterType === 'genre') {
      navigateTo(`/genre/${filterValue}`, { genre: filterValue });
    } else if (filterValue === 'latest_tv') {
      navigateTo('/tv-shows');
    } else {
      navigateTo('/movies', { filter: filterValue, title: sectionTitle });
    }
  };

  return (
    <div className="w-full pb-16">
      {/* 1. Large Cinematic Marquee Hero */}
      <HeroSection featuredMovies={fallbackHero} />

      {/* 2. Dynamic Configurable Homepage Sections with Skeleton Screens */}
      <div className="space-y-4 -mt-6 sm:-mt-10 relative z-30">
        {homepageConfig.sections.map((section) => {
          if (!section.enabled) return null;
          const sectionContent = getSectionMovies(section.filterType, section.filterValue);
          if (!isLoading && sectionContent.length === 0) return null;

          return (
            <CategorySection
              key={section.id}
              title={section.title}
              movies={sectionContent}
              isLoading={isLoading}
              skeletonCount={6}
              onViewAll={() => handleSectionViewAll(section.title, section.filterType, section.filterValue)}
              viewAllLabel="View All"
            />
          );
        })}
      </div>
    </div>
  );
};

