import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getSeoForPathname } from '@/seo/seoConfig';

const Breadcrumbs: React.FC = () => {
  const { pathname } = useLocation();
  const page = getSeoForPathname(pathname);
  const items = page.breadcrumbs;

  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Διαδρομή σελίδας"
      className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-1"
    >
      <ol className="flex flex-wrap items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="inline-flex items-center gap-1 min-w-0">
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" aria-hidden />
              )}
              {isLast ? (
                <span
                  className="font-semibold text-gray-900 dark:text-white truncate"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-coral-strong dark:hover:text-coral-light transition-colors truncate"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
