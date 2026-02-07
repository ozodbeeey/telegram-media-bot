
'use client';

import Link from 'next/link';
import { Play, User, Search, Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const translations = {
    en: {
        home: 'Home',
        live: 'Live TV',
        movies: 'Movies',
        pricing: 'Pricing',
        signin: 'Sign In',
        search_placeholder: 'Search channels, movies...',
        account_settings: 'Account Settings',
        current_plan: 'Current Plan',
        active: 'Active',
    },
    ru: {
        home: 'Главная',
        live: 'Прямой эфир',
        movies: 'Фильмы',
        pricing: 'Тарифы',
        signin: 'Войти',
        search_placeholder: 'Поиск каналов, фильмов...',
        account_settings: 'Настройки аккаунта',
        current_plan: 'Текущий план',
        active: 'Активен',
    },
    uz: {
        home: 'Bosh sahifa',
        live: 'Jonli Efir',
        movies: 'Kinolar',
        pricing: 'Tariflar',
        signin: 'Kirish',
        search_placeholder: 'Kanallar va kinolarni qidirish...',
        account_settings: 'Hisob sozlamalari',
        current_plan: 'Joriy Tarif',
        active: 'Faol',
    }
};

export default function Navbar() {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState<'en' | 'ru' | 'uz'>('en');
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log("Searching for:", searchQuery);
            // In a real app: router.push(`/search?q=${searchQuery}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-red-600/50">
                            <Play className="w-5 h-5 text-white fill-current" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
                            GoTV
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/" className="hover:text-primary transition-colors text-white px-3 py-2 rounded-md text-sm font-medium">
                                {translations[currentLang].home}
                            </Link>
                            <Link href="/live" className="hover:text-primary transition-colors text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                {translations[currentLang].live}
                            </Link>
                            <Link href="/movies" className="hover:text-primary transition-colors text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                {translations[currentLang].movies}
                            </Link>
                            <Link href="/pricing" className="text-primary hover:text-red-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                                {translations[currentLang].pricing}
                            </Link>
                        </div>
                    </div>

                    {/* Right Section (Search & Auth) */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Animated Search Bar */}
                        <div className={clsx(
                            "flex items-center bg-white/10 rounded-full transition-all duration-300 overflow-hidden",
                            isSearchOpen ? "w-64 px-2" : "w-10 bg-transparent"
                        )}>
                            <button
                                onClick={toggleSearch}
                                className="p-2 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                            <form onSubmit={handleSearch} className="flex-1 w-full">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={translations[currentLang].search_placeholder}
                                    className={clsx(
                                        "bg-transparent border-none focus:outline-none text-white text-sm w-full h-9",
                                        isSearchOpen ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </form>
                            {isSearchOpen && (
                                <button onClick={toggleSearch} className="p-1 text-gray-400 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Language Switcher */}
                        <div className="relative group/lang">
                            {/* ... existing language switcher code ... */}
                            <button className="flex items-center gap-1.5 text-gray-300 hover:text-white px-3 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-all font-medium text-xs">
                                <Globe className="w-3.5 h-3.5" />
                                <span className="uppercase">{currentLang}</span>
                                <ChevronDown className="w-3 h-3 opacity-50" />
                            </button>

                            <div className="absolute top-full right-0 mt-2 w-32 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all transform origin-top-right">
                                {['en', 'ru', 'uz'].map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => setCurrentLang(lang as any)}
                                        className={clsx(
                                            "w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors flex items-center justify-between",
                                            currentLang === lang ? "text-primary font-bold bg-primary/5" : "text-gray-400"
                                        )}
                                    >
                                        <span className="uppercase">{lang}</span>
                                        {currentLang === lang && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                    </button>
                                ))}
                            </div>
                        </div>


                        {user ? (
                            <div className="relative group/profile">
                                <button className="flex items-center gap-3 pl-3 pr-2 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all">
                                    <span className="text-sm font-medium text-white group-hover/profile:text-primary transition-colors">{user.name}</span>
                                    <img
                                        src={user.avatar || "https://ui-avatars.com/api/?name=User&background=random"}
                                        alt="User"
                                        className="w-8 h-8 rounded-full border border-white/20"
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full mt-2 w-72 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-xl overflow-hidden opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible hover:opacity-100 hover:visible transition-all transform origin-top-right z-50">
                                    <div className="p-5 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                                        <p className="text-white font-bold text-lg">{user.name}</p>
                                        <p className="text-gray-400 text-sm">{user.contact}</p>
                                    </div>

                                    <div className="p-2">
                                        <div className="px-3 py-2 bg-primary/10 rounded-lg mb-2">
                                            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">{translations[currentLang].current_plan}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-white font-bold">{user.plan || 'Free'} Plan</span>
                                                <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">{translations[currentLang].active}</span>
                                            </div>
                                        </div>

                                        <Link href="/profile" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-lg transition-colors">
                                            <User className="w-4 h-4" /> {translations[currentLang].account_settings}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-md shadow-red-900/20">
                                <User className="w-4 h-4" />
                                {translations[currentLang].signin}
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-black/95 border-b border-white/10 animate-fade-in-down">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="px-3 mb-4 relative">
                            <Search className="absolute left-6 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search channels, movies..."
                                className="w-full bg-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </form>

                        <Link href="/" className="text-white block px-3 py-2 rounded-md text-base font-medium">
                            {translations[currentLang].home}
                        </Link>
                        <Link href="/live" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                            {translations[currentLang].live}
                        </Link>
                        <Link href="/movies" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                            {translations[currentLang].movies}
                        </Link>
                        <Link href="/pricing" className="text-primary block px-3 py-2 rounded-md text-base font-medium">
                            {translations[currentLang].pricing}
                        </Link>
                        <Link href="/login" className="text-white block px-3 py-2 rounded-md text-base font-medium bg-white/10 mt-4">
                            {translations[currentLang].signin}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
