
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Play, Lock } from 'lucide-react';

interface ContentCardProps {
    id: string;
    title: string;
    image: string;
    previewImage?: string; // New prop for hover preview
    type: 'channel' | 'movie';
    isLocked?: boolean;
}

export default function ContentCard({ id, title, image, previewImage, type, isLocked = false }: ContentCardProps) {
    const linkPath = type === 'channel' ? `/watch/channel/${id}` : `/watch/movie/${id}`;

    return (
        <Link href={linkPath} className="group relative block aspect-video bg-card rounded-lg overflow-hidden border border-white/5 hover:border-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/20">
            {/* Main Image */}
            <img
                src={image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
            />

            {/* Preview Image (Shows on Hover) */}
            {previewImage && (
                <img
                    src={previewImage}
                    alt={`${title} preview`}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110 group-hover:scale-100"
                />
            )}
            {/* Fallback if no preview image, keep main image visible? No, logic above hides main. 
                 If no preview, we should NOT hide main. 
                 Let's adjust logic: 
                 If preview exists: Main (Default) -> Preview (Hover)
                 If NO preview: Main (Default) -> Main (Hover)
             */}

            {!previewImage && (
                <img
                    src={image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            )}


            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            {/* Lock Icon if Premium */}
            {isLocked && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-black p-1 rounded-full z-10">
                    <Lock className="w-3 h-3" />
                </div>
            )}

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 layer-20">
                <div className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 backdrop-blur-sm">
                    <Play className="w-6 h-6 text-white ml-1 fill-current" />
                </div>
            </div>

            {/* Content Info */}
            <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
                <p className="text-white font-medium text-sm truncate drop-shadow-md">{title}</p>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-gray-400 text-xs capitalize">{type}</p>
                    {type === 'movie' && previewImage && <span className="text-[10px] bg-white/20 px-1.5 rounded text-white">Preview</span>}
                </div>
            </div>
        </Link>
    );
}
