"use client";

import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import MiniCart from "../../components/MiniCart";
import { apiUrl } from "@/lib/api";
import { Product } from "@/types"; // We can now use the single, canonical Product type.

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(apiUrl("api/products"));
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                const data: Product[] = await response.json();
                const formattedProducts: Product[] = data.map((p) => ({
                    ...p,
                    image_url: apiUrl(p.image_url),
                }));

                setProducts(formattedProducts);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
            <MiniCart />
            {/* The title is now in the Header component */}
            {loading && <p className="text-center">Loading products...</p>}
            {error && <p className="text-center text-red-500">Error: {error}</p>}
            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-12">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
