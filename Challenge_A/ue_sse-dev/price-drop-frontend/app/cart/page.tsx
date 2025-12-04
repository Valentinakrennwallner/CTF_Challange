"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
    const { cartItems, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();

    // Helper to format cents back to a euro string
    const formatPrice = (cents: number) => (cents / 100).toFixed(2);

    // Calculate total price from cents
    const totalInCents = cartItems.reduce((sum, item) => {
        const priceInCents = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        return sum + priceInCents * quantity;
    }, 0);

    return (
        <div className="min-h-screen p-8 bg-zinc-50 dark:bg-black">
            {cartItems.length === 0 ? (
                <div className="pt-12">
                    <p className="text-center text-zinc-600 dark:text-zinc-400">
                        Your cart is empty.
                    </p>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto flex flex-col gap-6 pt-12">
                    {cartItems.map(item => {
                        const priceInCents = Number(item.price) || 0;
                        const quantity = Number(item.quantity) || 1;
                        
                        return (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-lg shadow"
                            >
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={item.image_url}
                                        alt={item.name}
                                        width={80}
                                        height={80}
                                        className="rounded"
                                    />
                                    <div>
                                        <h2 className="font-semibold text-black dark:text-zinc-50">{item.name}</h2>
                                        <p className="text-zinc-600 dark:text-zinc-400">
                                            €{formatPrice(priceInCents)} x {quantity}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <button
                                                onClick={() => decreaseQuantity(item.id)}
                                                className="px-2 py-1 bg-zinc-200 dark:bg-zinc-700 rounded"
                                            >
                                                -
                                            </button>
                                            <span>{quantity}</span>
                                            <button
                                                onClick={() => increaseQuantity(item.id)}
                                                className="px-2 py-1 bg-zinc-200 dark:bg-zinc-700 rounded"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                >
                                    Remove
                                </button>
                            </div>
                        );
                    })}

                    <div className="flex justify-between items-center mt-6 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow">
                        <span className="font-bold text-lg text-black dark:text-zinc-50">
                            Total: €{formatPrice(totalInCents)}
                        </span>
                        <div className="flex gap-4">
                            <button
                                onClick={clearCart}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                            >
                                Empty Cart
                            </button>
                            <Link href="/checkout">
                                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                                    Checkout
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
