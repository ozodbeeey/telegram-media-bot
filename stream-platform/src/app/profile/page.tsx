
'use client';

import { useAuth } from '@/lib/auth';
import { User, CreditCard, Settings, LogOut, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            // router.push('/login'); // Optional: Redirect if not logged in
        }
    }, [user, router]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <p>Loading Profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 px-4 pb-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
                    <span className="w-1.5 h-10 bg-primary rounded-full"></span>
                    My Profile
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* User Card */}
                    <div className="col-span-1 bg-card border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl">
                        <div className="w-32 h-32 rounded-full border-4 border-primary p-1 mb-4 relative">
                            <img
                                src={user.avatar || "https://ui-avatars.com/api/?name=User&background=random"}
                                alt="Avatar"
                                className="w-full h-full rounded-full object-cover"
                            />
                            <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-black"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                        <p className="text-gray-400 mb-6">@{user.username}</p>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-all font-medium border border-white/5"
                        >
                            <LogOut className="w-5 h-5" /> Sign Out
                        </button>
                    </div>

                    {/* Details Section */}
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        {/* Subscription Status */}
                        <div className="bg-card border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Shield className="w-32 h-32 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" /> Subscription
                            </h3>
                            <div className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5">
                                <div>
                                    <p className="text-gray-400 text-sm">Current Plan</p>
                                    <p className="text-2xl font-bold text-white mt-1">Ultra 4K <span className="text-xs bg-primary px-2 py-0.5 rounded ml-2 align-middle">ACTIVE</span></p>
                                </div>
                                <button className="text-sm text-primary hover:text-white underline">Manage</button>
                            </div>
                            <p className="text-gray-500 text-sm mt-4">Next billing date: <span className="text-gray-300">March 5, 2026</span></p>
                        </div>

                        {/* Settings */}
                        <div className="bg-card border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-gray-400" /> Account Settings
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                                    <span className="text-gray-300">Email Address</span>
                                    <span className="text-gray-500">{user.username.toLowerCase().replace(/\s/g, '')}@example.com</span>
                                </div>
                                <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                                    <span className="text-gray-300">Phone Number</span>
                                    <span className="text-gray-500">+998 90 *** ** 67</span>
                                </div>
                                <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                                    <span className="text-gray-300">Parental Controls</span>
                                    <span className="text-green-400">Enabled</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
