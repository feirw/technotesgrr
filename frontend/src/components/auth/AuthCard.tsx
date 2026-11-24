import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

type AuthCardProps = {
  title: string;
  subtitle?: React.ReactNode;
  icon?: LucideIcon;
  iconTone?: 'brand' | 'success' | 'error';
  children?: React.ReactNode;
};

const TONES = {
  brand: 'bg-coral-wash text-[#e06d88] dark:bg-white/10 dark:text-coral-light',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300',
  error: 'bg-red-50 text-red-600 dark:bg-red-400/15 dark:text-red-300',
};

const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconTone = 'brand',
  children,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [title]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md rounded-3xl border border-[#f07f97]/35 dark:border-[#f07f97]/25 bg-white dark:bg-[#3a2658] p-6 sm:p-8 shadow-xl"
    >
      {Icon && (
        <span
          className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${TONES[iconTone]}`}
        >
          <Icon className="h-6 w-6" aria-hidden />
        </span>
      )}
      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-[#faf5ef]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
          {subtitle}
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </motion.section>
  );
};

export default AuthCard;
