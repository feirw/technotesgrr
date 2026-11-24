import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { buttonClass } from '@/components/auth/Button';
import { AUTH_STRINGS } from '@/data/authStrings';

type Provider = 'google' | 'apple';

const SocialButton: React.FC<{ provider: Provider; onClick: () => void; disabled?: boolean }> = ({
  provider,
  onClick,
  disabled,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={buttonClass('secondary', 'font-bold')}
  >
    {provider === 'google' ? (
      <FcGoogle className="h-5 w-5" aria-hidden />
    ) : (
      <FaApple className="h-5 w-5" aria-hidden />
    )}
    {AUTH_STRINGS.common[provider]}
  </button>
);

/** Google + Apple — μόνο UI. */
export const SocialButtons: React.FC<{ onUnavailable: () => void; disabled?: boolean }> = ({
  onUnavailable,
  disabled,
}) => (
  <div className="grid gap-3">
    {/* TODO: connect real API (OAuth) */}
    <SocialButton provider="google" onClick={onUnavailable} disabled={disabled} />
    <SocialButton provider="apple" onClick={onUnavailable} disabled={disabled} />
  </div>
);

export default SocialButton;
