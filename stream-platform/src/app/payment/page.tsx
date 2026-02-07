
'use client';


import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, Check, Lock, Calendar, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/lib/auth';

function PaymentForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const planName = searchParams.get('plan') || 'Pro';
    const price = searchParams.get('price') || '15,000';

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Auto-format card number
    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        val = val.substring(0, 16);
        val = val.replace(/(\d{4})/g, '$1 ').trim();
        setCardNumber(val);
    };

    // Auto-format expiry
    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        val = val.substring(0, 4);
        if (val.length >= 3) {
            val = val.substring(0, 2) + '/' + val.substring(2);
        }
        setExpiry(val);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate API Call
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            // Here we would actually update the user's plan in backend context
            setTimeout(() => {
                router.push('/profile');
            }, 2000);
        }, 2500);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="bg-card border border-green-500/50 rounded-2xl p-12 text-center max-w-md w-full shadow-2xl shadow-green-900/20 animate-fade-in-up">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <Check className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
                    <p className="text-gray-400 mb-6">Welcome to <span className="text-primary font-bold">{planName}</span>. Enjoy your unlimited streaming.</p>
                    <p className="text-sm text-gray-500 animate-pulse">Redirecting to profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                {/* Order Summary */}
                <div className="bg-card border border-white/10 rounded-2xl p-8 relative overflow-hidden order-2 lg:order-1">
                    <div className="absolute top-0 right-0 p-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />

                    <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

                    <div className="flex items-center justify-between py-4 border-b border-white/10">
                        <div>
                            <p className="text-lg font-medium text-white">{planName} Plan</p>
                            <p className="text-sm text-gray-400">Monthly subscription</p>
                        </div>
                        <p className="text-xl font-bold text-white">{price} <span className="text-xs font-normal text-gray-400">UZS</span></p>
                    </div>

                    <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-500" />
                            <span>Cancel anytime</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-500" />
                            <span>Instant activation</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            <span>Secure SSL payment</span>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                        <p className="text-gray-400">Total to pay</p>
                        <p className="text-3xl font-bold text-white">{price} UZS</p>
                    </div>
                </div>

                {/* Payment Form */}
                <div className="bg-white rounded-2xl p-8 text-gray-900 shadow-2xl order-1 lg:order-2">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-primary" /> Payment Details
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={cardNumber}
                                    onChange={handleCardChange}
                                    placeholder="0000 0000 0000 0000"
                                    className="block w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-0 transition-colors text-lg font-mono placeholder-gray-300"
                                />
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={expiry}
                                        onChange={handleExpiryChange}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        className="block w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-0 transition-colors font-mono placeholder-gray-300"
                                    />
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        required
                                        maxLength={3}
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                        placeholder="•••"
                                        className="block w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-0 transition-colors font-mono placeholder-gray-300"
                                    />
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                            <input
                                type="text"
                                required
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                                placeholder="JOHN DOE"
                                className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-0 transition-colors font-medium placeholder-gray-300 uppercase"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                `Pay ${price} UZS`
                            )}
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3" /> Encrypted 256-bit Connection
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
            <PaymentForm />
        </Suspense>
    );
}
