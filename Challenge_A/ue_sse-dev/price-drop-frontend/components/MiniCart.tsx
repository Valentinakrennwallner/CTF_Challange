"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function MiniCart() {
    const { cartItems, increaseQuantity, decreaseQuantity } = useCart();
    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    if (totalItems === 0) return null;

    const formatPrice = (cents: number) => (cents / 100).toFixed(2);

    return (
        <div className="fixed bottom-4 right-4 w-64 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-lg z-50">
            <h2 className="font-bold text-lg text-black dark:text-zinc-50 mb-2">Cart</h2>
            <ul className="max-h-48 overflow-y-auto">
                {cartItems.map(item => {
                    // Assuming item.price is already in cents, so we don't multiply by 100
                    const priceInCents = Number(item.price) || 0;
                    const quantity = Number(item.quantity) || 1;
                    const subtotalInCents = priceInCents * quantity;

                    return (
                        <li key={item.id} className="flex items-center justify-between mb-2 text-black dark:text-zinc-50">
                            <span>{item.name}</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => decreaseQuantity(item.id)}
                                    className="px-2 bg-zinc-200 dark:bg-zinc-700 rounded"
                                >
                                    -
                                </button>
                                <span>{quantity}</span>
                                <button
                                    onClick={() => increaseQuantity(item.id)}
                                    className="px-2 bg-zinc-200 dark:bg-zinc-700 rounded"
                                >
                                    +
                                </button>
                            </div>
                            <span>€{formatPrice(subtotalInCents)}</span>
                        </li>
                    );
                })}
            </ul>
            <Link href="/cart">
                <button className="mt-4 w-full bg-black text-white px-4 py-2 rounded hover:bg-zinc-800 transition">
                    Go to cart
                </button>
            </Link>
        </div>
    );
}
