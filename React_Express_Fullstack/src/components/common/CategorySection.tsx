import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Movie } from '../../types';
import { MovieCard, MovieCardSkeleton } from './MovieCard';

interface CategorySectionProps {
  title: string;
  movies?: Movie[];
  onViewAll?: () => void;
  viewAllLabel?: string;
  aspectRatio?: 'poster' | 'landscape';
  isLoading?: boolean;
  skeletonCount?: number;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  movies = [],
  onViewAll,
  viewAllLabel = 'View All',
  aspectRatio = 'poster',
  isLoading = false,
  skeletonCount = 6
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // If not loading and no movies, don't render empty section
  if (!isLoading && (!movies || movies.length === 0)) return null;

  const cardWidthClass =
    aspectRatio === 'poster'
      ? 'w-[145px] sm:w-[185px] md:w-[210px] lg:w-[225px]'
      : 'w-[260px] sm:w-[320px]';

  return (
    <section className="relative my-8 sm:my-12">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4 sm:mb-5 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-gradient-to-b from-[#7C5CFF] to-[#00D4FF] rounded-full" />
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white font-display">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Scroll Nav Buttons (Desktop) */}
          <div className="hidden sm:flex items-center gap-1.5 mr-2">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-lg bg-[#151B28] border border-[#1E2638] text-[#A7AFBF] hover:text-white hover:border-[#7C5CFF] transition-all cursor-pointer"
              aria-label={`Scroll ${title} left`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-lg bg-[#151B28] border border-[#1E2638] text-[#A7AFBF] hover:text-white hover:border-[#7C5CFF] transition-all cursor-pointer"
              aria-label={`Scroll ${title} right`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View All Action */}
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="flex items-center gap-1 text-xs font-semibold text-[#00D4FF] hover:text-white transition-colors cursor-pointer group"
            >
              <span>{viewAllLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* Responsive Horizontal Scroll Runway */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 pb-3 pt-1 scroll-smooth"
      >
        {isLoading ? (
          // Skeleton screens while content is fetching
          Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={`skeleton-${index}`} className={`shrink-0 ${cardWidthClass}`}>
              <MovieCardSkeleton aspectRatio={aspectRatio} />
            </div>
          ))
        ) : (
          // Real movie cards
          movies.map((movie) => (
            <div key={movie.id} className={`shrink-0 ${cardWidthClass}`}>
              <MovieCard movie={movie} aspectRatio={aspectRatio} />
            </div>
          ))
        )}
      </div>
    </section>
  );
};

