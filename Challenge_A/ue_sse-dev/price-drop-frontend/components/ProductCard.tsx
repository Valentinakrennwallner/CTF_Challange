"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    const formatPrice = (cents: number) => (cents / 100).toFixed(2);

    return (
        <div className="flex flex-col items-center border p-4 rounded-lg shadow hover:shadow-lg transition">
            {product.image_url && <Image src={product.image_url} alt={product.name} width={150} height={150} />}
            <h2 className="mt-4 font-semibold">{product.name}</h2>
            <p className="text-zinc-600">{product.description}</p>
            <p className="mt-2 font-bold">€{formatPrice(product.price)}</p>
            <button
                onClick={() => addToCart(product)}
                className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-zinc-800"
            >
                Add to Cart
            </button>
        </div>
    );
}
