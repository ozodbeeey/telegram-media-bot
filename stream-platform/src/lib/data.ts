
export interface Channel {
    id: string;
    name: string;
    category: 'Sports' | 'News' | 'Entertainment' | 'Kids' | 'Educational' | 'Music';
    isUltra: boolean; // Locked if true (Visual only now, logic unlocked)
    poster: string;
    streamUrl: string;
}

export interface Movie {
    id: string;
    title: string;
    year: number;
    isExclusive: boolean; // True = Ultra only
    poster: string;
    previewImage?: string;
    streamUrl: string;
    source?: 'direct' | 'youtube';
}

// REAL YouTube Live Streams
export const CHANNELS: Channel[] = [
    // News (Free)
    {
        id: 'ch_aljazeera',
        name: 'Al Jazeera English',
        category: 'News',
        isUltra: false,
        poster: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80',
        streamUrl: 'https://www.youtube.com/embed/gCNeDWCI0vo?autoplay=1'
    },
    {
        id: 'ch_euronews',
        name: 'Euronews Live',
        category: 'News',
        isUltra: false,
        poster: 'https://images.unsplash.com/photo-1555561026-6cbd66e138a2?auto=format&fit=crop&w=400&q=80',
        streamUrl: 'https://www.youtube.com/embed/py5qaO7fbSs?autoplay=1'
    },
    {
        id: 'ch_nasa',
        name: 'NASA TV',
        category: 'Educational',
        isUltra: false,
        poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
        streamUrl: 'https://www.youtube.com/embed/21X5lGlDOfg?autoplay=1'
    },
    {
        id: 'ch_dw',
        name: 'DW News',
        category: 'News',
        isUltra: false,
        poster: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=400&q=80',
        streamUrl: 'https://www.youtube.com/embed/GE_SFHV14zo?autoplay=1'
    },

    // Sports
    {
        id: 'ch_redbull',
        name: 'Red Bull TV',
        category: 'Sports',
        isUltra: false,
        poster: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=400&q=80',
        streamUrl: 'https://www.youtube.com/embed/wdbK6H90HJU?autoplay=1'
    },

    // Kids & Entertainment
    {
        id: 'ch_lofi',
        name: 'Lofi Girl Music',
        category: 'Music',
        isUltra: false,
        poster: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80',
        streamUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1'
    },
    {
        id: 'ch_cartoon',
        name: 'Cartoon Network',
        category: 'Kids',
        isUltra: false,
        poster: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80',
        streamUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4'
    },

    // Local / Regional Live Channels (Real Traffic - TAS-IX)
    {
        id: 'ch_yoshlar',
        name: 'Yoshlar TV',
        category: 'Entertainment',
        isUltra: false,
        poster: 'https://ui-avatars.com/api/?name=Yoshlar+TV&background=2196F3&color=fff&size=512',
        streamUrl: 'https://stream8.cinerama.uz/1001/tracks-v1a1/playlist.m3u8'
    },
    {
        id: 'ch_sport',
        name: 'Sport UZ',
        category: 'Sports',
        isUltra: false,
        poster: 'https://ui-avatars.com/api/?name=Sport+UZ&background=F44336&color=fff&size=512',
        streamUrl: 'https://stream8.cinerama.uz/1002/tracks-v1a1/playlist.m3u8'
    },
    {
        id: 'ch_toshkent',
        name: 'Toshkent TV',
        category: 'News',
        isUltra: false,
        poster: 'https://ui-avatars.com/api/?name=Toshkent+TV&background=607D8B&color=fff&size=512',
        streamUrl: 'https://stream8.cinerama.uz/1003/tracks-v1a1/playlist.m3u8'
    },
    {
        id: 'ch_milliy',
        name: 'Milliy TV',
        category: 'Entertainment',
        isUltra: false,
        poster: 'https://ui-avatars.com/api/?name=Milliy+TV&background=FFC107&color=fff&size=512',
        streamUrl: 'https://stream8.cinerama.uz/1004/tracks-v1a1/playlist.m3u8'
    },
    {
        id: 'ch_my5',
        name: 'My5 (Mening Yurtim)',
        category: 'Entertainment',
        isUltra: false,
        poster: 'https://ui-avatars.com/api/?name=My5&background=E91E63&color=fff&size=512',
        streamUrl: 'https://stream8.cinerama.uz/1005/tracks-v1a1/playlist.m3u8'
    },
    {
        id: 'ch_bolajon',
        name: 'Bolajon TV',
        category: 'Kids',
        isUltra: false,
        poster: 'https://ui-avatars.com/api/?name=Bolajon+TV&background=FF9800&color=fff&size=512',
        streamUrl: 'https://stream8.cinerama.uz/1006/tracks-v1a1/playlist.m3u8'
    },
    {
        id: 'ch_dunyo',
        name: 'Dunyo Bo\'ylab',
        category: 'Educational',
        isUltra: false,
        poster: 'https://ui-avatars.com/api/?name=Dunyo+Bo\'ylab&background=00BCD4&color=fff&size=512',
        streamUrl: 'https://stream8.cinerama.uz/1007/tracks-v1a1/playlist.m3u8'
    },
    {
        id: 'ch_kinoteatr',
        name: 'Kinoteatr',
        category: 'Entertainment',
        isUltra: false,
        poster: 'https://ui-avatars.com/api/?name=Kinoteatr&background=3F51B5&color=fff&size=512',
        streamUrl: 'https://stream8.cinerama.uz/1012/tracks-v1a1/playlist.m3u8'
    },
    {
        id: 'ch_uzreport',
        name: 'UzReport TV',
        category: 'News',
        isUltra: false,
        poster: 'https://ui-avatars.com/api/?name=UzReport+TV&background=0D8ABC&color=fff&size=512',
        streamUrl: 'https://stream8.cinerama.uz/1015/tracks-v1a1/playlist.m3u8'
    },
    {
        id: 'ch_zor',
        name: 'Zo\'r TV',
        category: 'Entertainment',
        isUltra: false,
        poster: 'https://ui-avatars.com/api/?name=Zo\'r+TV&background=FF5722&color=fff&size=512',
        streamUrl: 'https://stream8.cinerama.uz/1016/tracks-v1a1/mono.m3u8'
    },
    {
        id: 'ch_sevimli',
        name: 'Sevimli TV',
        category: 'Entertainment',
        isUltra: false,
        poster: 'https://ui-avatars.com/api/?name=Sevimli+TV&background=9C27B0&color=fff&size=512',
        streamUrl: 'https://stream8.cinerama.uz/1017/tracks-v1a1/playlist.m3u8'
    },
    {
        id: 'ch_uzb24',
        name: 'O\'zbekiston 24',
        category: 'News',
        isUltra: false,
        poster: 'https://ui-avatars.com/api/?name=O\'zbekiston+24&background=4CAF50&color=fff&size=512',
        streamUrl: 'https://stream8.cinerama.uz/1011/tracks-v1a1/playlist.m3u8'
    },
];

export const MOVIES: Movie[] = [
    // Blockbusters (Exclusive)
    { id: 'mv_1', title: 'Avengers: Endgame', year: 2019, isExclusive: true, poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', streamUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4', previewImage: 'https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg' },
    { id: 'mv_2', title: 'Interstellar', year: 2014, isExclusive: false, poster: 'https://image.tmdb.org/t/p/w500/gEU2QniL6C8ztDDlZ2txlGW3sBE.jpg', streamUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4', previewImage: 'https://image.tmdb.org/t/p/w1280/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg' },
    { id: 'mv_3', title: 'Spider-Man: NWH', year: 2021, isExclusive: true, poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', streamUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4', previewImage: 'https://image.tmdb.org/t/p/w1280/iQFcwSGbZXMkeyKrxbPnwnunLXF.jpg' },
    { id: 'mv_5', title: 'Red Notice', year: 2021, isExclusive: false, poster: 'https://image.tmdb.org/t/p/w500/wdE6ewaKZHr62bLqCn7A2DiGShm.jpg', streamUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4', previewImage: 'https://image.tmdb.org/t/p/w1280/dKQAprZ62bq1B65nUIS19wB305k.jpg' },

    // YouTube Free Movies (Working Full Movies)
    {
        id: 'mv_yt_1',
        title: 'Tears of Steel',
        year: 2012,
        isExclusive: false,
        poster: 'https://image.tmdb.org/t/p/w500/oh6FCj6jQfpP075t3nK0vW8gG83.jpg',
        streamUrl: 'https://www.youtube.com/embed/OHjf1apYg_g?autoplay=1',
        source: 'youtube',
        previewImage: 'https://c4.wallpaperflare.com/wallpaper/439/840/644/tears-of-steel-sci-fi-short-film-wallpaper-preview.jpg'
    },
    {
        id: 'mv_yt_2',
        title: 'Agent 327',
        year: 2017,
        isExclusive: false,
        poster: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Agent_327_Operation_Barbershop_Poster.jpg',
        streamUrl: 'https://www.youtube.com/embed/mN0zPOpADL4?autoplay=1',
        source: 'youtube',
        previewImage: 'https://i.ytimg.com/vi/mN0zPOpADL4/maxresdefault.jpg'
    },
    {
        id: 'mv_yt_3',
        title: 'Kung Fury',
        year: 2015,
        isExclusive: false,
        poster: 'https://image.tmdb.org/t/p/original/o2QbdC4x2u1Vd5N27w5c9jE8.jpg',
        streamUrl: 'https://www.youtube.com/embed/bS5P_LAqiVg?autoplay=1',
        source: 'youtube',
        previewImage: 'https://i.ytimg.com/vi/bS5P_LAqiVg/maxresdefault.jpg'
    },
    {
        id: 'mv_yt_4',
        title: 'Spring',
        year: 2019,
        isExclusive: false,
        poster: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Spring_2019_short_film_poster.jpg',
        streamUrl: 'https://www.youtube.com/embed/WhWc3b3KhnY?autoplay=1',
        source: 'youtube',
        previewImage: 'https://i.ytimg.com/vi/WhWc3b3KhnY/maxresdefault.jpg'
    }
];

export const HERO_SLIDES = [
    {
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1920&q=80',
        title: 'UEFA Champions League',
        subtitle: 'Man City vs Real Madrid - The Ultimate Showdown',
        isLive: true
    },
    {
        image: 'https://images.unsplash.com/photo-1434648957308-5e6a859697e8?auto=format&fit=crop&w=1920&q=80',
        title: 'Premier League',
        subtitle: 'Haaland vs Salah. Live Exclusive.',
        isLive: true
    },
    {
        image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=1920&q=80',
        title: 'Spider-Man: No Way Home',
        subtitle: 'The Multiverse is unleashed. Watch now on Ultra.',
        isLive: false
    },
    {
        image: 'https://images.unsplash.com/photo-1510563800743-aed236490d08?auto=format&fit=crop&w=1920&q=80',
        title: 'La Liga Highlights',
        subtitle: 'Vinicius Junior magic in 4K.',
        isLive: true
    }
];
