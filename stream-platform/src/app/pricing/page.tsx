
import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Join thousands of football fans watching live matches without freezing.
                    Cancel anytime.
                </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Pro Plan */}
                <div className="bg-card border border-white/10 rounded-2xl p-8 flex flex-col hover:border-white/30 transition-colors">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">15,000</span>
                            <span className="text-gray-400">UZS / month</span>
                        </div>
                        <p className="text-gray-400 mt-4">Essential channels for casual viewing.</p>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-primary" />
                            <span>50+ TV Channels</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-primary" />
                            <span>Full HD (1080p) Quality</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-primary" />
                            <span>Mobile & Web Access</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-500">
                            <span className="w-5 h-5 block border border-gray-600 rounded-sm"></span>
                            <span className="line-through">Exclusive 4K Movies</span>
                        </li>
                    </ul>

                    <Link href="/payment?plan=Pro&price=15,000" className="w-full block text-center bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-bold transition-colors">
                        Select Pro
                    </Link>
                </div>

                {/* Ultra Plan */}
                <div className="relative bg-gradient-to-br from-card to-black border border-primary rounded-2xl p-8 flex flex-col shadow-2xl shadow-primary/20 transform md:-translate-y-4">
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                        BEST VALUE
                    </div>

                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2 text-primary">Ultra</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">25,000</span>
                            <span className="text-gray-400">UZS / month</span>
                        </div>
                        <p className="text-gray-400 mt-4">Maximum stability and quality for football fans.</p>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-white">
                            <div className="bg-primary/20 p-1 rounded-full"><Check className="w-4 h-4 text-primary" /></div>
                            <span className="font-medium">All 50+ Channels</span>
                        </li>
                        <li className="flex items-center gap-3 text-white">
                            <div className="bg-primary/20 p-1 rounded-full"><Check className="w-4 h-4 text-primary" /></div>
                            <span className="font-medium">4K Ultra HD Quality</span>
                        </li>
                        <li className="flex items-center gap-3 text-white">
                            <div className="bg-primary/20 p-1 rounded-full"><Check className="w-4 h-4 text-primary" /></div>
                            <span className="font-bold">Prioritized Bandwidth (No Freezing)</span>
                        </li>
                        <li className="flex items-center gap-3 text-white">
                            <div className="bg-primary/20 p-1 rounded-full"><Check className="w-4 h-4 text-primary" /></div>
                            <span>Exclusive Movies & Premieres</span>
                        </li>
                    </ul>

                    <Link href="/payment?plan=Ultra&price=25,000" className="w-full block text-center bg-primary hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-colors shadow-lg shadow-red-500/25">
                        Select Ultra
                    </Link>
                </div>

            </div>
        </div>
    );
}
