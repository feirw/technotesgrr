import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { AUTH_STRINGS } from '@/data/authStrings';

const S = AUTH_STRINGS.brand;

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[#ff97b2] dark:bg-[#2d1c48] text-gray-900 dark:text-gray-100 transition-colors duration-500">
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl lg:grid-cols-2 lg:gap-10 px-4 sm:px-6 pt-24 pb-12 lg:pt-28">
      <aside className="hidden lg:flex flex-col justify-center pr-6">
        <Link
          to="/"
          className="inline-flex items-center gap-3 self-start rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f07f97] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ff97b2]"
        >
          <img src="/images/logo-80.webp" alt="" width={48} height={48} className="h-12 w-12" />
          <span className="text-xl font-black text-gray-900 dark:text-[#faf5ef]">{S.name}</span>
        </Link>
        <h2 className="mt-8 text-4xl xl:text-5xl font-black tracking-tight leading-tight text-gray-900 dark:text-[#faf5ef]">
          {S.title}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-gray-800 dark:text-gray-300 max-w-md">
          {S.subtitle}
        </p>
        <ul className="mt-8 space-y-3">
          {S.bullets.map((b) => (
            <li
              key={b}
              className="flex items-center gap-3 font-semibold text-gray-900 dark:text-gray-100"
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/80 dark:bg-[#3a2658] text-[#e06d88] dark:text-coral-light shadow-sm">
                <Check className="h-4 w-4" aria-hidden />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex flex-col items-center justify-center">
        <Link to="/" className="lg:hidden mb-6 inline-flex items-center gap-2 rounded-xl">
          <img src="/images/logo-80.webp" alt="" width={40} height={40} className="h-10 w-10" />
          <span className="font-black text-gray-900 dark:text-[#faf5ef]">{S.name}</span>
        </Link>
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
