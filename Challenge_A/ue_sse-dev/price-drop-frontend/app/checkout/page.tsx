"use client";

import React, { useState, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { apiUrl } from '@/lib/api';

// --- Types ---

interface CheckoutResponse {
    total_price: number;
    items: { id: string; name: string; price: number; quantity: number }[];
    ctf_flag?: string;
}

interface FormData {
    billingAddress: string;
    city: string;
    country: string;
    cardholderName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

interface FormErrors {
    [key: string]: string | null;
}

// --- Component ---

const CheckoutPage = () => {
    const { cartItems, cartId, resetCartSession } = useCart();
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [checkoutResponse, setCheckoutResponse] = useState<CheckoutResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        billingAddress: '', city: '', country: '', cardholderName: '',
        cardNumber: '', expiryDate: '', cvv: '',
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const totalPriceInCents = useMemo(() => cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0), [cartItems]);
    const formatPrice = (cents: number) => (cents / 100).toFixed(2);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const validateForm = (): boolean => {
        const errors: FormErrors = {};
        const textFields: (keyof FormData)[] = ['billingAddress', 'city', 'country', 'cardholderName'];
        for (const key of textFields) {
            if (!formData[key]) {
                errors[key] = 'This field is required.';
            }
        }
        
        const cardNumber = formData.cardNumber.replace(/\s/g, '');
        if (!/^\d{12,}$/.test(cardNumber)) {
            errors.cardNumber = 'Card number must be at least 12 digits.';
        }
        
        if (!/^\d{3,4}$/.test(formData.cvv)) {
            errors.cvv = 'Please enter a valid CVV.';
        }
        
        const expiryRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
        const match = formData.expiryDate.match(expiryRegex);
        if (!match) {
            errors.expiryDate = 'Please use MM/YY format.';
        } else {
            const [, month, year] = match;
            const expiry = new Date(2000 + parseInt(year), parseInt(month));
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            if (expiry < now) {
                errors.expiryDate = 'Card has expired.';
            }
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCheckout = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!agreedToTerms) {
            alert('Please accept the terms and conditions.');
            return;
        }
        if (!validateForm()) return;

        if (!cartId) {
            setError("Your cart session could not be found. Please try adding an item to your cart again.");
            return;
        }

        const checkoutPayload = {
            billingDetails: formData,
        };

        try {
            const response = await fetch(apiUrl(`api/cart/${cartId}/checkout`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(checkoutPayload),
            });
            if (!response.ok) throw new Error('Checkout failed. Please try again.');
            const data: CheckoutResponse = await response.json();
            setCheckoutResponse(data);
            setError(null);
            resetCartSession();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setCheckoutResponse(null);
        }
    };

    if (checkoutResponse) {
        return (
            <div className="container mx-auto p-4 pt-12 text-center">
                <h1 className="text-4xl font-bold mb-4 text-black dark:text-zinc-50">Checkout Successful!</h1>
                <div className="bg-white dark:bg-zinc-900 shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">Order Summary</h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 mt-4">
                        Total Price: <span className="font-bold text-black dark:text-zinc-50">€{formatPrice(checkoutResponse.total_price)}</span>
                    </p>
                    {checkoutResponse.ctf_flag && (
                        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                            <h3 className="font-bold">Congratulations!</h3>
                            <p>Here is your flag: <span className="font-mono">{checkoutResponse.ctf_flag}</span></p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 pt-12">
            <div className="bg-white dark:bg-zinc-900 shadow-md rounded-lg p-6 mb-4">
                <h2 className="text-xl font-semibold mb-2 text-black dark:text-zinc-50">Your Cart</h2>
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-2">
                            <div className="flex items-center">
                                <Image src={item.image_url} alt={item.name} width={50} height={50} className="mr-4" />
                                <div>
                                    <p className="font-semibold text-black dark:text-zinc-50">{item.name}</p>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Price: €{formatPrice(item.price)}</p>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Quantity: {item.quantity || 1}</p>
                                </div>
                            </div>
                            <p className="font-semibold text-black dark:text-zinc-50">€{formatPrice(item.price * (item.quantity || 1))}</p>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-xl font-bold text-black dark:text-zinc-50">Total:</p>
                    <p className="text-xl font-bold text-black dark:text-zinc-50">€{formatPrice(totalPriceInCents)}</p>
                </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 shadow-md rounded-lg p-6">
                <form onSubmit={handleCheckout} noValidate>
                    <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-black dark:text-zinc-50">Billing Address</h3>
                    <div className="mb-4">
                        <label htmlFor="billingAddress" className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-2">Address</label>
                        <input type="text" id="billingAddress" value={formData.billingAddress} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg bg-transparent text-black dark:text-white" />
                        {formErrors.billingAddress && <p className="text-red-500 text-sm mt-1">{formErrors.billingAddress}</p>}
                    </div>
                    <div className="flex space-x-4 mb-6">
                        <div className="w-1/2">
                            <label htmlFor="city" className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-2">City</label>
                            <input type="text" id="city" value={formData.city} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg bg-transparent text-black dark:text-white" />
                            {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="country" className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-2">Country</label>
                            <input type="text" id="country" value={formData.country} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg bg-transparent text-black dark:text-white" />
                            {formErrors.country && <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>}
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-black dark:text-zinc-50">Payment Details</h3>
                    <div className="mb-4">
                        <label htmlFor="cardholderName" className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-2">Cardholder Name</label>
                        <input type="text" id="cardholderName" value={formData.cardholderName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg bg-transparent text-black dark:text-white" />
                        {formErrors.cardholderName && <p className="text-red-500 text-sm mt-1">{formErrors.cardholderName}</p>}
                    </div>
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="cardNumber" className="block text-zinc-600 dark:text-zinc-400 font-semibold">Card Number</label>
                            <a href="https://www.browserstack.com/free-tools/credit-card-number-generator" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                                need a credit card?
                            </a>
                        </div>
                        <input type="text" id="cardNumber" value={formData.cardNumber} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg bg-transparent text-black dark:text-white" />
                        {formErrors.cardNumber && <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>}
                    </div>
                    <div className="flex space-x-4 mb-6">
                        <div className="w-1/2">
                            <label htmlFor="expiryDate" className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-2">Expiry Date</label>
                            <input type="text" id="expiryDate" value={formData.expiryDate} onChange={handleInputChange} placeholder="MM/YY" className="w-full px-3 py-2 border rounded-lg bg-transparent text-black dark:text-white" />
                            {formErrors.expiryDate && <p className="text-red-500 text-sm mt-1">{formErrors.expiryDate}</p>}
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="cvv" className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-2">CVV</label>
                            <input type="text" id="cvv" value={formData.cvv} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg bg-transparent text-black dark:text-white" />
                            {formErrors.cvv && <p className="text-red-500 text-sm mt-1">{formErrors.cvv}</p>}
                        </div>
                    </div>
                    <div className="mb-6 flex items-center">
                        <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mr-2" />
                        <label htmlFor="terms" className="text-zinc-600 dark:text-zinc-400">I accept the <a href="/terms" className="text-blue-500 hover:underline">Terms and Conditions</a></label>
                    </div>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <button type="submit" className={`w-full text-white font-bold py-2 px-4 rounded-lg ${agreedToTerms ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`} disabled={!agreedToTerms}>
                        Pay Now
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
