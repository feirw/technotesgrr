import React from 'react';
import { Link } from 'react-router-dom';

export const authLinkClass =
  'rounded font-bold text-[#c2185b] dark:text-coral-light underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f07f97]';

const AuthFooterLink: React.FC<{ text?: string; linkText: string; to: string }> = ({
  text,
  linkText,
  to,
}) => (
  <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
    {text && <>{text} </>}
    <Link to={to} className={`inline-flex min-h-11 items-center px-1 ${authLinkClass}`}>
      {linkText}
    </Link>
  </p>
);

export default AuthFooterLink;
