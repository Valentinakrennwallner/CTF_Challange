'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

// SVG Icons
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const titleMap: { [key: string]: string } = {
    '/shop': 'Shop',
    '/cart': 'Your Cart',
    '/checkout': 'Checkout',
  };

  const title = titleMap[pathname];

  return (
    <header className="sticky top-0 z-50 p-4 flex justify-between items-center bg-zinc-50 dark:bg-black text-black dark:text-zinc-50">
      <div className="flex-1">
        <button onClick={() => router.back()} title="Go back" className="bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 font-bold p-2 rounded-full">
          <BackArrowIcon />
        </button>
      </div>
      <div className="flex-1 text-center text-2xl font-bold">
        {title}
      </div>
      <div className="flex-1 flex justify-end items-center space-x-4">
        <Link href="/cart" title="Go to cart" className="bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 font-bold p-2 rounded-full">
          <CartIcon />
        </Link>
        <Link href="/" title="Go to home" className="bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 font-bold p-2 rounded-full">
          <HomeIcon />
        </Link>
      </div>
    </header>
  );
}
