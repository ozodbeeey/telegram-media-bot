
/* eslint-disable @next/next/no-img-element */
import { CHANNELS, MOVIES } from '@/lib/data';
import ContentCard from '@/components/ContentCard';
import HeroSlider from '@/components/HeroSlider';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-background min-h-screen pb-20">

      {/* Hero Section with Slider */}
      <HeroSlider />

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mt-12">

        {/* Live Channels */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-primary rounded-full"></span>
              Live Channels
            </h2>
            <Link href="/live" className="text-gray-400 hover:text-white text-sm font-medium">View All Channels</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CHANNELS.slice(0, 8).map((channel) => (
              <ContentCard
                key={channel.id}
                id={channel.id}
                title={channel.name}
                image={channel.poster}
                type="channel"
                isLocked={channel.isUltra}
              // Channels don't have preview images in mock data yet
              />
            ))}
          </div>
        </div>

        {/* Popular Movies */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-primary rounded-full"></span>
              New Releases & Exclusives
            </h2>
            <Link href="/movies" className="text-gray-400 hover:text-white text-sm font-medium">View All Movies</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MOVIES.filter(m => m.isExclusive).map((movie) => (
              <ContentCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                image={movie.poster}
                previewImage={movie.previewImage} // Pass preview image
                type="movie"
                isLocked={movie.isExclusive}
              />
            ))}
          </div>
        </div>

        {/* Free Movies (Netflix style) */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-green-500 rounded-full"></span>
              Free to Watch
            </h2>
            <Link href="/movies" className="text-gray-400 hover:text-white text-sm font-medium">View All</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MOVIES.filter(m => !m.isExclusive).map((movie) => (
              <ContentCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                image={movie.poster}
                previewImage={movie.previewImage} // Pass preview image
                type="movie"
                isLocked={false}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
