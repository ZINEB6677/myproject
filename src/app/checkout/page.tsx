'use client';

// ============================================================
// Checkout Page — Stripe Payment + Order Creation
// ============================================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { useMutation } from '@apollo/client';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CREATE_ORDER } from '@/graphql/queries';
import Image from 'next/image';
import Link from 'next/link';

// Initialize Stripe
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// ---- Checkout Form (inner component with Stripe context) ----
function CheckoutForm({
    clientSecret,
    paymentIntentId,
    shippingData,
}: {
    clientSecret: string;
    paymentIntentId: string;
    shippingData: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
    };
}) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [createOrder] = useMutation(CREATE_ORDER);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage('');

        try {
            // Confirm payment with Stripe
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
            });

            if (error) {
                setErrorMessage(error.message ?? 'Payment failed. Please try again.');
                setIsProcessing(false);
                return;
            }

            if (paymentIntent?.status === 'succeeded') {
                // Create order in our database
                await createOrder({
                    variables: {
                        input: {
                            books: items.map((item) => ({
                                bookId: item.book._id,
                                quantity: item.quantity,
                            })),
                            totalAmount: totalPrice,
                            shippingAddress: shippingData,
                            paymentIntentId: paymentIntentId,
                        },
                    },
                });

                clearCart();
                router.push(`/order-success?id=${paymentIntent.id}`);
            }
        } catch (err) {
            setErrorMessage('An unexpected error occurred. Please try again.');
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-card p-6">
                <h3 className="font-semibold text-gray-200 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs text-white font-bold">3</span>
                    Payment Details
                </h3>
                <PaymentElement
                    options={{
                        layout: 'tabs',
                    }}
                />
            </div>

            {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="btn-primary w-full justify-center py-4 text-base"
                id="pay-now-button"
            >
                {isProcessing ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing Payment...
                    </span>
                ) : (
                    `Pay $${totalPrice.toFixed(2)}`
                )}
            </button>

            <p className="text-center text-gray-500 text-xs flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secured by Stripe. Your payment info is encrypted.
            </p>
        </form>
    );
}

// ---- Main Checkout Page ----
export default function CheckoutPage() {
    const { items, totalPrice } = useCart();
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    const [clientSecret, setClientSecret] = useState('');
    const [paymentIntentId, setPaymentIntentId] = useState('');
    const [step, setStep] = useState(1); // 1: shipping, 2: review, 3: payment
    const [shippingData, setShippingData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
    });
    const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login?redirect=/checkout');
        }
    }, [isAuthenticated, isLoading, router]);

    // Redirect if cart is empty
    useEffect(() => {
        if (!isLoading && items.length === 0) {
            router.push('/');
        }
    }, [items, isLoading, router]);

    // Create payment intent when moving to payment step
    const createPaymentIntent = async () => {
        try {
            const res = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalPrice }),
            });
            const data = await res.json();
            setClientSecret(data.clientSecret);
            setPaymentIntentId(data.paymentIntentId);
        } catch (err) {
            console.error('Failed to create payment intent:', err);
        }
    };

    const validateShipping = () => {
        const errors: Record<string, string> = {};
        if (!shippingData.fullName.trim()) errors.fullName = 'Full name is required';
        if (!shippingData.email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(shippingData.email)) errors.email = 'Invalid email';
        if (!shippingData.phone.trim()) errors.phone = 'Phone is required';
        if (!shippingData.address.trim()) errors.address = 'Address is required';
        setShippingErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNextStep = async () => {
        if (step === 1) {
            if (!validateShipping()) return;
            setStep(2);
        } else if (step === 2) {
            await createPaymentIntent();
            setStep(3);
        }
    };

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const shipping = 0; // Free shipping
    const tax = totalPrice * 0.08;
    const total = totalPrice + tax + shipping;

    return (
        <div className="min-h-screen pt-20 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-bold text-gray-100 mb-8">Checkout</h1>

                {/* Progress Steps */}
                <div className="flex items-center gap-2 mb-10">
                    {['Shipping', 'Review', 'Payment'].map((label, idx) => {
                        const stepNum = idx + 1;
                        const isActive = step === stepNum;
                        const isDone = step > stepNum;
                        return (
                            <div key={label} className="flex items-center gap-2">
                                <div className={`flex items-center gap-2 ${isActive ? 'text-indigo-400' : isDone ? 'text-green-400' : 'text-gray-500'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${isActive ? 'border-indigo-500 bg-indigo-500/20' :
                                            isDone ? 'border-green-500 bg-green-500/20' :
                                                'border-gray-700 bg-gray-800'
                                        }`}>
                                        {isDone ? '✓' : stepNum}
                                    </div>
                                    <span className="text-sm font-medium hidden sm:block">{label}</span>
                                </div>
                                {idx < 2 && <div className={`flex-1 h-0.5 w-8 sm:w-16 ${step > stepNum ? 'bg-green-500' : 'bg-gray-700'}`} />}
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Step 1: Shipping */}
                        {step === 1 && (
                            <div className="glass-card p-6 fade-in">
                                <h2 className="font-semibold text-gray-200 mb-6 flex items-center gap-2 text-lg">
                                    <span className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs text-white font-bold">1</span>
                                    Shipping Information
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="fullName">Full Name *</label>
                                        <input
                                            id="fullName"
                                            type="text"
                                            className={`form-input ${shippingErrors.fullName ? 'border-red-500' : ''}`}
                                            placeholder="John Doe"
                                            value={shippingData.fullName}
                                            onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                                        />
                                        {shippingErrors.fullName && <p className="text-red-400 text-xs mt-1">{shippingErrors.fullName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="email">Email *</label>
                                        <input
                                            id="email"
                                            type="email"
                                            className={`form-input ${shippingErrors.email ? 'border-red-500' : ''}`}
                                            placeholder="john@example.com"
                                            value={shippingData.email}
                                            onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                                        />
                                        {shippingErrors.email && <p className="text-red-400 text-xs mt-1">{shippingErrors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="phone">Phone *</label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            className={`form-input ${shippingErrors.phone ? 'border-red-500' : ''}`}
                                            placeholder="+1 (555) 000-0000"
                                            value={shippingData.phone}
                                            onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                                        />
                                        {shippingErrors.phone && <p className="text-red-400 text-xs mt-1">{shippingErrors.phone}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="address">Full Address *</label>
                                        <textarea
                                            id="address"
                                            rows={3}
                                            className={`form-input resize-none ${shippingErrors.address ? 'border-red-500' : ''}`}
                                            placeholder="123 Main St, City, State, ZIP, Country"
                                            value={shippingData.address}
                                            onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                                        />
                                        {shippingErrors.address && <p className="text-red-400 text-xs mt-1">{shippingErrors.address}</p>}
                                    </div>
                                </div>
                                <button onClick={handleNextStep} className="btn-primary mt-6 w-full justify-center">
                                    Continue to Review →
                                </button>
                            </div>
                        )}

                        {/* Step 2: Review */}
                        {step === 2 && (
                            <div className="glass-card p-6 fade-in">
                                <h2 className="font-semibold text-gray-200 mb-6 flex items-center gap-2 text-lg">
                                    <span className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs text-white font-bold">2</span>
                                    Review Your Order
                                </h2>
                                <div className="space-y-4 mb-6">
                                    {items.map((item) => (
                                        <div key={item.book._id} className="flex gap-4 p-3 bg-gray-800/50 rounded-xl">
                                            <div className="relative w-14 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image src={item.book.image} alt={item.book.title} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-200 text-sm truncate">{item.book.title}</p>
                                                <p className="text-gray-400 text-xs">{item.book.author}</p>
                                                <p className="text-gray-400 text-xs mt-1">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-indigo-400 font-semibold text-sm">
                                                ${(item.book.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Shipping Info Summary */}
                                <div className="bg-gray-800/50 rounded-xl p-4 mb-6 text-sm">
                                    <p className="text-gray-400 font-medium mb-2">Shipping to:</p>
                                    <p className="text-gray-300">{shippingData.fullName}</p>
                                    <p className="text-gray-400">{shippingData.email}</p>
                                    <p className="text-gray-400">{shippingData.address}</p>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center">← Back</button>
                                    <button onClick={handleNextStep} className="btn-primary flex-1 justify-center">Proceed to Payment →</button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment */}
                        {step === 3 && clientSecret && (
                            <div className="fade-in">
                                <Elements
                                    stripe={stripePromise}
                                    options={{
                                        clientSecret,
                                        appearance: {
                                            theme: 'night',
                                            variables: {
                                                colorPrimary: '#6366f1',
                                                colorBackground: '#111827',
                                                colorText: '#f9fafb',
                                                colorDanger: '#ef4444',
                                                borderRadius: '12px',
                                            },
                                        },
                                    }}
                                >
                                    <CheckoutForm
                                        clientSecret={clientSecret}
                                        paymentIntentId={paymentIntentId}
                                        shippingData={shippingData}
                                    />
                                </Elements>
                            </div>
                        )}

                        {step === 3 && !clientSecret && (
                            <div className="glass-card p-8 text-center">
                                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                <p className="text-gray-400 mt-4">Setting up payment...</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Order Summary */}
                    <div>
                        <div className="glass-card p-6 sticky top-24">
                            <h3 className="font-semibold text-gray-200 mb-4">Order Summary</h3>
                            <div className="space-y-3 mb-4">
                                {items.map((item) => (
                                    <div key={item.book._id} className="flex justify-between text-sm">
                                        <span className="text-gray-400 truncate flex-1 mr-2">
                                            {item.book.title} × {item.quantity}
                                        </span>
                                        <span className="text-gray-300 flex-shrink-0">
                                            ${(item.book.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-700 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-gray-300">${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Shipping</span>
                                    <span className="text-green-400">Free</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Tax (8%)</span>
                                    <span className="text-gray-300">${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-3 mt-3">
                                    <span className="text-gray-100">Total</span>
                                    <span className="gradient-text">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
