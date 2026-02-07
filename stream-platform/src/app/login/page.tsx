
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Mail, Phone, ArrowRight, Check, User } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

type Step = 'contact' | 'verify' | 'profile';
type Method = 'phone' | 'email';

import { useAuth } from '@/lib/auth'; // Import context

export default function LoginPage() {
    const [step, setStep] = useState<Step>('contact');
    const [method, setMethod] = useState<Method>('phone');
    const [contactValue, setContactValue] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Profile State
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);

    const router = useRouter();

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API to send code
        setTimeout(() => {
            setIsLoading(false);
            setStep('verify');
            alert(`Simulation: Your verification code is 123456 sent to ${contactValue}`);
        }, 1500);
    };

    const handleVerifySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate code check
        setTimeout(() => {
            setIsLoading(false);
            if (code === '123456') {
                setStep('profile');
            } else {
                alert('Invalid code (Try 123456)');
            }
        }, 1000);
    };

    const { login } = useAuth(); // Import useAuth hook

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate account creation
        setTimeout(() => {
            setIsLoading(false);
            login({
                name: fullName,
                username,
                avatar: avatar || `https://ui-avatars.com/api/?name=${fullName}&background=random`,
                contact: contactValue,
                plan: 'Pro' // Default plan for new users in this demo
            });
            router.push('/profile'); // Redirect to profile as requested
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/blt6d66e74b71158572/60dba540c7662c0fc44081c7/0f1118182b8344e450b33036fe4c3677332243d6.jpg?auto=webp&format=pjpg&width=1080&quality=60"
                    alt="Bg"
                    className="w-full h-full object-cover opacity-20 blur-sm scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            <div className="absolute top-8 left-8 flex items-center gap-2 z-10 transition-all hover:scale-105">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-red-600/50">
                    <Play className="w-6 h-6 text-white fill-current" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">GoTV</span>
            </div>

            <div className="max-w-md w-full bg-card/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl relative z-10 shadow-2xl animate-fade-in-up">

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mb-8">
                    <div className={clsx("h-1 rounded-full transition-all w-8", step === 'contact' ? "bg-primary" : "bg-primary/30")} />
                    <div className={clsx("h-1 rounded-full transition-all w-8", step === 'verify' ? "bg-primary" : "bg-primary/30")} />
                    <div className={clsx("h-1 rounded-full transition-all w-8", step === 'profile' ? "bg-primary" : "bg-primary/30")} />
                </div>

                {step === 'contact' && (
                    <>
                        <h2 className="text-3xl font-bold text-white mb-2">Get Started</h2>
                        <p className="text-gray-400 mb-8">Enter your details to watch the match.</p>

                        <div className="flex bg-black/40 p-1 rounded-lg mb-6 border border-white/5">
                            <button
                                onClick={() => setMethod('phone')}
                                className={clsx("flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2",
                                    method === 'phone' ? "bg-white/10 text-white shadow" : "text-gray-400 hover:text-white"
                                )}
                            >
                                <Phone className="w-4 h-4" /> Phone
                            </button>
                            <button
                                onClick={() => setMethod('email')}
                                className={clsx("flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2",
                                    method === 'email' ? "bg-white/10 text-white shadow" : "text-gray-400 hover:text-white"
                                )}
                            >
                                <Mail className="w-4 h-4" /> Email
                            </button>
                        </div>

                        <form onSubmit={handleContactSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    {method === 'phone' ? 'Phone Number' : 'Email Address'}
                                </label>
                                <div className="relative">
                                    {method === 'phone' && (
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium z-10 select-none">
                                            +998
                                        </span>
                                    )}
                                    <input
                                        type={method === 'phone' ? "tel" : "email"}
                                        required
                                        value={contactValue}
                                        onChange={(e) => setContactValue(e.target.value)}
                                        className={clsx(
                                            "block w-full py-4 rounded-xl border border-white/10 bg-black/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all",
                                            method === 'phone' ? "pl-16 pr-4" : "px-4"
                                        )}
                                        placeholder={method === 'phone' ? "90 123 45 67" : "name@example.com"}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/25 text-base font-bold text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50"
                            >
                                {isLoading ? 'Sending Code...' : 'Send Code'} <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </>
                )}

                {step === 'verify' && (
                    <>
                        <h2 className="text-3xl font-bold text-white mb-2">Verify Code</h2>
                        <p className="text-gray-400 mb-8">We sent a confirmed code to <span className="text-white">{contactValue}</span></p>

                        <form onSubmit={handleVerifySubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Enter 6-digit code
                                </label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    required
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="block w-full px-4 py-4 text-center text-2xl tracking-widest font-mono rounded-xl border border-white/10 bg-black/50 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="000000"
                                />
                                <p className="text-xs text-gray-500 mt-2 text-center">Didn't receive it? <button type="button" onClick={handleContactSubmit} className="text-primary underline">Resend</button></p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/25 text-base font-bold text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50"
                            >
                                {isLoading ? 'Verifying...' : 'Verify & Continue'} <Check className="w-5 h-5" />
                            </button>
                        </form>
                    </>
                )}

                {step === 'profile' && (
                    <>
                        <h2 className="text-3xl font-bold text-white mb-2">Create Profile</h2>
                        <p className="text-gray-400 mb-8">Setup your account to start watching.</p>

                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <input
                                    type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                                    className="block w-full px-4 py-3 rounded-xl border border-white/10 bg-black/50 text-white focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                                <input
                                    type="text" required value={username} onChange={e => setUsername(e.target.value)}
                                    className="block w-full px-4 py-3 rounded-xl border border-white/10 bg-black/50 text-white focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                <input
                                    type="password" required value={password} onChange={e => setPassword(e.target.value)}
                                    className="block w-full px-4 py-3 rounded-xl border border-white/10 bg-black/50 text-white focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Profile Picture (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setAvatar(reader.result as string);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="block w-full text-sm text-gray-400
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-primary/10 file:text-primary
                                      hover:file:bg-primary/20
                                    "
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/25 text-base font-bold text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 mt-4"
                            >
                                {isLoading ? 'Creating Account...' : 'Finish Setup'} <User className="w-5 h-5" />
                            </button>
                        </form>
                    </>
                )}

            </div>
        </div>
    );
}
