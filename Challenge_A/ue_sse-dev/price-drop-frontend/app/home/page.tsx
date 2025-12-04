import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex min-h-screen items-start justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900 font-sans pt-20">
            <main className="flex flex-col items-center justify-center max-w-4xl w-full px-6">

                <Image
                    className="dark:invert mb-2"
                    src="/logo.webp"
                    alt="Price Drop Logo"
                    width={360}
                    height={120}
                    priority
                />

                <h1 className="text-4xl sm:text-5xl font-bold text-black dark:text-zinc-50 text-center mb-8">
                    Price Drop
                </h1>

                <Link href="/shop">
                    <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-4 rounded-full text-xl font-bold shadow-2xl hover:scale-105 hover:from-purple-700 hover:to-pink-600 transition-all duration-300">
                        Enter Shop
                    </button>
                </Link>
            </main>
        </div>
    );
}
