
import { CHANNELS } from '@/lib/data';
import ContentCard from '@/components/ContentCard';
import { Play } from 'lucide-react';

export default function LivePage() {
    const categories = ['All', ...Array.from(new Set(CHANNELS.map(c => c.category)))];

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-10 bg-primary rounded-full"></span>
                        Live TV Channels
                    </h1>
                    <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium text-white shadow-inner">
                        {CHANNELS.length} Channels Available
                    </span>
                </div>

                {/* Categories (Visual only for now, can be interactive later) */}
                <div className="flex gap-2 overflow-x-auto pb-6 mb-4 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className="px-6 py-2 bg-card border border-white/10 hover:border-primary rounded-full text-gray-300 hover:text-white whitespace-nowrap transition-all"
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grids by Category */}
                {categories.filter(c => c !== 'All').map((category) => {
                    const catChannels = CHANNELS.filter(c => c.category === category);
                    if (catChannels.length === 0) return null;

                    return (
                        <div key={category} className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-primary/50">
                                {category}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {catChannels.map((channel) => (
                                    <ContentCard
                                        key={channel.id}
                                        id={channel.id}
                                        title={channel.name}
                                        image={channel.poster}
                                        type="channel"
                                        isLocked={channel.isUltra}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
    );
}
