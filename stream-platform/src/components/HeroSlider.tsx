
'use client';

import { useState, useEffect } from 'react';
import { HERO_SLIDES } from '@/lib/data';
import Link from 'next/link';
import { Play } from 'lucide-react';
import clsx from 'clsx';

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 6000);

        return () => clearInterval(timer);
    }, []);

    const slide = HERO_SLIDES[currentSlide];

    return (
        <div className="relative h-[80vh] w-full overflow-hidden bg-black">
            {/* Background Slides */}
            {HERO_SLIDES.map((item, index) => (
                <div
                    key={index}
                    className={clsx(
                        "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                        index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                    )}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-black/40 to-transparent" />
                </div>
            ))}

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 p-8 md:p-16 z-20 max-w-3xl">
                {slide.isLive && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded mb-4 animate-pulse">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        Live Now
                    </div>
                )}
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
                    {slide.title}
                </h1>
                <p className="text-gray-200 text-xl mb-8 line-clamp-2 drop-shadow-md">
                    {slide.subtitle}
                </p>
                <div className="flex gap-4">
                    <Link
                        href={`/live`}
                        className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-red-600/30"
                    >
                        <Play className="w-5 h-5 fill-current" />
                        {slide.isLive ? 'Watch Live' : 'Watch Now'}
                    </Link>
                    <Link
                        href="/pricing"
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-lg font-bold text-lg transition-all border border-white/20"
                    >
                        Get Ultra
                    </Link>
                </div>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-8 right-8 flex gap-3 z-20">
                {HERO_SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={clsx(
                            "h-1 rounded-full transition-all duration-300",
                            index === currentSlide ? "bg-primary w-8" : "bg-white/30 w-4 hover:bg-white/60"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
