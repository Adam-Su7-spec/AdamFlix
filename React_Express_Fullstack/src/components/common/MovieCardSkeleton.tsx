import React from 'react';
import { Film } from 'lucide-react';

interface MovieCardSkeletonProps {
  className?: string;
  aspectRatio?: 'poster' | 'landscape';
}

export const MovieCardSkeleton: React.FC<MovieCardSkeletonProps> = ({
  className = '',
  aspectRatio = 'poster'
}) => {
  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-[#151B28] border border-[#1E2638] flex flex-col skeleton-shimmer select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Poster Media Placeholder */}
      <div
        className={`relative w-full overflow-hidden bg-[#101521] flex items-center justify-center ${
          aspectRatio === 'poster' ? 'aspect-[2/3]' : 'aspect-video'
        }`}
      >
        {/* Subtle center watermark */}
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/10">
          <Film className="w-5 h-5" />
        </div>

        {/* Top Badges Placeholder */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {/* 4K tag placeholder */}
            <div className="h-4 w-9 rounded bg-white/10 border border-white/5" />
            {/* Type badge placeholder */}
            <div className="h-4 w-11 rounded bg-white/10 border border-white/5" />
          </div>
          {/* Editorial badge placeholder */}
          <div className="h-4 w-12 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Card Info Footer Placeholder */}
      <div className="p-3 flex flex-col justify-between flex-1">
        {/* Title bar placeholder */}
        <div className="space-y-1.5 mb-2.5">
          <div className="h-3.5 w-4/5 rounded bg-white/10" />
          <div className="h-2.5 w-2/5 rounded bg-white/5" />
        </div>

        {/* Metadata Row Placeholder */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-7 rounded bg-white/5" />
            <div className="w-1 h-1 rounded-full bg-white/15" />
            <div className="h-3 w-12 rounded bg-white/5" />
          </div>

          {/* Star rating placeholder */}
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-400/20" />
            <div className="h-3 w-6 rounded bg-amber-400/10" />
          </div>
        </div>
      </div>
    </div>
  );
};
