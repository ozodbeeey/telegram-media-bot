
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Lock } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';
import Hls from 'hls.js';

interface VideoPlayerProps {
    src: string;
    poster?: string;
    isLocked?: boolean;
}

export default function VideoPlayer({ src, poster, isLocked = false }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [showControls, setShowControls] = useState(true);
    const controlTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let hls: Hls | null = null;

        if (src.includes('.m3u8')) {
            if (Hls.isSupported()) {
                hls = new Hls({
                    debug: false,
                    enableWorker: true,
                });
                hls.loadSource(src);
                hls.attachMedia(video);
                hls.on(Hls.Events.ERROR, function (event, data) {
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                hls?.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                hls?.recoverMediaError();
                                break;
                            default:
                                hls?.destroy();
                                break;
                        }
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // Native HLS support (Safari)
                video.src = src;
            }
        } else if (!isYouTube) {
            video.src = src;
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [src, isYouTube]);

    const togglePlay = () => {
        if (isLocked || isYouTube) return; // YouTube handles its own play
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (newVolume: number) => {
        if (isYouTube) return; // Custom youtube volume needs iframe API, skipping for MVP
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    const toggleMute = () => {
        if (isYouTube) return;
        if (videoRef.current) {
            const newMuted = !isMuted;
            videoRef.current.muted = newMuted;
            setIsMuted(newMuted);
            if (newMuted) setVolume(0);
            else setVolume(1);
        }
    };

    const toggleFullscreen = () => {
        const container = videoRef.current?.parentElement || document.getElementById('player-container');
        if (container) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                container.requestFullscreen();
            }
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlTimeoutRef.current) clearTimeout(controlTimeoutRef.current);
        controlTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    // If locked, show overlay
    if (isLocked) {
        return (
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden flex flex-col items-center justify-center group shadow-2xl">
                <img src={poster} alt="Poster" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm scale-110" />
                <div className="absolute inset-0 bg-black/50" />

                <div className="z-10 text-center p-8 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 max-w-lg mx-4 flex flex-col items-center shadow-xl animate-fade-in-up">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                        <Lock className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3">Premium Content</h3>
                    <p className="text-gray-300 mb-8 text-lg">
                        This stream is available only for <strong>Pro</strong> or <strong>Ultra</strong> subscribers.
                        Upgrade now for unlimited access.
                    </p>
                    <div className="flex gap-4 w-full">
                        <Link href="/login" className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl font-bold transition-colors text-center border border-white/5">
                            Sign In
                        </Link>
                        <Link href="/pricing" className="flex-1 bg-primary hover:bg-red-700 text-white px-6 py-4 rounded-xl font-bold transition-colors text-center shadow-lg shadow-red-600/30">
                            Get Plan
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // YouTube Iframe Implementation
    if (isYouTube) {
        return (
            <div
                id="player-container"
                className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group shadow-2xl border border-white/5"
            >
                <iframe
                    src={src}
                    className="w-full h-full"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </div>
        );
    }

    // HTML5 Video Implementation
    return (
        <div
            id="player-container"
            className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group select-none shadow-2xl border border-white/5"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                poster={poster}
                className="w-full h-full object-contain"
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                playsInline
                autoPlay
            />

            {/* Play Overlay (Big Center Button) */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm animate-pulse">
                        <Play className="w-10 h-10 text-white fill-current ml-2" />
                    </div>
                </div>
            )}

            {/* Controls Overlay */}
            <div
                className={clsx(
                    "absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-6 transition-opacity duration-300",
                    showControls ? "opacity-100" : "opacity-0"
                )}
            >
                {/* Progress Bar (Mock) */}
                <div className="w-full h-1.5 bg-white/20 rounded-full mb-6 cursor-pointer group/progress relative">
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-8 opacity-0 cursor-pointer" />
                    <div className="w-1/3 h-full bg-primary rounded-full relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity transform scale-0 group-hover/progress:scale-100 shadow" />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={togglePlay} className="text-white hover:text-primary transition-colors focus:outline-none transform active:scale-90 transition-transform">
                            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                        </button>

                        <div className="flex items-center gap-4 group/vol">
                            <button onClick={toggleMute} className="text-white hover:text-gray-300">
                                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                                className="w-0 overflow-hidden group-hover/vol:w-24 transition-all duration-300 h-1.5 accent-primary bg-white/20 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <span className="text-gray-300 text-sm font-medium tracking-wide">Live</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="text-gray-300 hover:text-white flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                            <Settings className="w-4 h-4" /> 1080p
                        </button>
                        <button onClick={toggleFullscreen} className="text-white hover:text-primary transition-colors">
                            <Maximize className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
