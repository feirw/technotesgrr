import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BadgeCheck, Link2Off, Loader2, Mail } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import { ButtonLink } from '@/components/auth/Button';
import FormAlert from '@/components/auth/FormAlert';
import ResendButton from '@/components/auth/ResendButton';
import AuthFooterLink, { authLinkClass } from '@/components/auth/AuthFooterLink';
import { AUTH_STRINGS } from '@/data/authStrings';
import { resendCode, toAuthError, verifyEmail } from '@/lib/auth/mockAuth';
import { useCooldown } from '@/lib/auth/hooks';
import { safeRedirect } from '@/lib/auth/validation';

const S = AUTH_STRINGS.verifyEmail;

type View = 'pending' | 'verifying' | 'verified' | 'invalid';

const VerifyEmailPage: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const email = params.get('email') ?? '';
  const redirect = safeRedirect(params.get('redirect'));
  const [view, setView] = useState<View>(token ? 'verifying' : 'pending');
  const [linkError, setLinkError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const cooldown = useCooldown(30);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setView('verifying');
    verifyEmail(token)
      .then(() => !cancelled && setView('verified'))
      .catch((err) => {
        if (cancelled) return;
        setLinkError(AUTH_STRINGS.errors[toAuthError(err).code]);
        setView('invalid');
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const onResend = async () => {
    setServerError(null);
    setNotice(null);
    setResending(true);
    try {
      await resendCode({ email, kind: 'verify' });
      setNotice(AUTH_STRINGS.common.resent);
      cooldown.start();
      if (view === 'invalid') setView('pending');
    } catch (err) {
      setServerError(AUTH_STRINGS.errors[toAuthError(err).code]);
    } finally {
      setResending(false);
    }
  };

  const otpHref = `/verify-otp?${new URLSearchParams({ ...(email && { email }), redirect }).toString()}`;

  let content: React.ReactNode;
  if (view === 'verifying') {
    content = (
      <AuthCard icon={Mail} title={S.verifying}>
        <div className="flex justify-center py-4" role="status" aria-live="polite">
          <Loader2 className="h-8 w-8 animate-spin text-[#e06d88]" aria-hidden />
          <span className="sr-only">{S.verifying}</span>
        </div>
      </AuthCard>
    );
  } else if (view === 'verified') {
    content = (
      <AuthCard
        icon={BadgeCheck}
        iconTone="success"
        title={S.verifiedTitle}
        subtitle={S.verifiedBody}
      >
        <ButtonLink
          to={
            redirect === '/account' ? '/login' : `/login?redirect=${encodeURIComponent(redirect)}`
          }
        >
          {S.verifiedCta}
        </ButtonLink>
      </AuthCard>
    );
  } else if (view === 'invalid') {
    content = (
      <AuthCard
        icon={Link2Off}
        iconTone="error"
        title={linkError ?? AUTH_STRINGS.errors.invalid_token}
      >
        <FormAlert tone="error" message={serverError} />
        <div className="flex justify-center">
          <ResendButton secondsLeft={cooldown.left} loading={resending} onResend={onResend} />
        </div>
        <AuthFooterLink linkText={AUTH_STRINGS.common.backToLogin} to="/login" />
      </AuthCard>
    );
  } else {
    content = (
      <AuthCard icon={Mail} title={S.title} subtitle={S.body(email)}>
        <FormAlert tone="error" message={serverError} />
        <FormAlert tone="success" message={notice} />
        <div className="flex flex-col items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
          <ResendButton secondsLeft={cooldown.left} loading={resending} onResend={onResend} />
          <p>
            {S.useCode}{' '}
            <Link
              to={otpHref}
              className={`inline-flex min-h-11 items-center px-1 ${authLinkClass}`}
            >
              {S.useCodeLink}
            </Link>
          </p>
        </div>
        <AuthFooterLink linkText={AUTH_STRINGS.common.backToLogin} to="/login" />
      </AuthCard>
    );
  }

  return <AuthLayout>{content}</AuthLayout>;
};

export default VerifyEmailPage;
