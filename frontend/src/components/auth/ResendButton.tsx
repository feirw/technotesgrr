import React from 'react';
import { RotateCw } from 'lucide-react';
import { AUTH_STRINGS } from '@/data/authStrings';
import { authLinkClass } from '@/components/auth/AuthFooterLink';

type ResendButtonProps = {
  secondsLeft: number;
  loading?: boolean;
  onResend: () => void;
};

const ResendButton: React.FC<ResendButtonProps> = ({ secondsLeft, loading, onResend }) => {
  const C = AUTH_STRINGS.common;
  const waiting = secondsLeft > 0;
  return (
    <button
      type="button"
      onClick={onResend}
      disabled={waiting || loading}
      className={`inline-flex min-h-11 items-center gap-2 px-2 text-sm disabled:cursor-not-allowed disabled:text-gray-600 disabled:no-underline dark:disabled:text-gray-300 ${authLinkClass}`}
    >
      <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden />
      {waiting ? C.resendIn(secondsLeft) : C.resend}
    </button>
  );
};

export default ResendButton;
