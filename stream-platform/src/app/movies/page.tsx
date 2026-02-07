
/* eslint-disable @next/next/no-img-element */
import { MOVIES } from '@/lib/data';
import ContentCard from '@/components/ContentCard';
import { Play } from 'lucide-react';

export default function MoviesPage() {
    const exclusiveMovies = MOVIES.filter(m => m.isExclusive);
    const freeMovies = MOVIES.filter(m => !m.isExclusive);

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8">Movies Library</h1>

                {/* Free Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Play className="w-6 h-6 text-green-500 fill-current" />
                        Free to Watch
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {freeMovies.map((movie) => (
                            <ContentCard
                                key={movie.id}
                                id={movie.id}
                                title={movie.title}
                                image={movie.poster}
                                type="movie"
                                isLocked={false}
                            />
                        ))}
                    </div>
                </div>

                {/* Exclusive Section */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Play className="w-6 h-6 text-primary fill-current" />
                        Premium Exclusives (Ultra)
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {exclusiveMovies.map((movie) => (
                            <ContentCard
                                key={movie.id}
                                id={movie.id}
                                title={movie.title}
                                image={movie.poster}
                                type="movie"
                                isLocked={true}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
