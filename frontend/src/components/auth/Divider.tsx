import React from 'react';
import { AUTH_STRINGS } from '@/data/authStrings';

const Divider: React.FC<{ label?: string }> = ({ label = AUTH_STRINGS.common.or }) => (
  <div className="my-6 flex items-center gap-3" role="separator">
    <span className="h-px flex-1 bg-gray-200 dark:bg-white/15" />
    <span className="text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300">
      {label}
    </span>
    <span className="h-px flex-1 bg-gray-200 dark:bg-white/15" />
  </div>
);

export default Divider;
