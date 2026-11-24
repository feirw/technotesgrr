import React, { useId, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import OTPInput from '@/components/auth/OTPInput';
import Button from '@/components/auth/Button';
import FormAlert from '@/components/auth/FormAlert';
import ResendButton from '@/components/auth/ResendButton';
import AuthFooterLink from '@/components/auth/AuthFooterLink';
import { AUTH_STRINGS } from '@/data/authStrings';
import { resendCode, toAuthError, verifyOtp } from '@/lib/auth/mockAuth';
import { useCooldown } from '@/lib/auth/hooks';
import { safeRedirect } from '@/lib/auth/validation';

const S = AUTH_STRINGS.otp;

const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get('email') ?? '';
  const redirect = safeRedirect(params.get('redirect'));
  const [code, setCode] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [done, setDone] = useState(false);
  const [focusSignal, setFocusSignal] = useState(0);
  const cooldown = useCooldown(30);
  const errorId = useId();

  const submit = async (value: string) => {
    setServerError(null);
    setNotice(null);
    if (value.length !== 6) {
      setFieldError(AUTH_STRINGS.validation.otpIncomplete);
      return;
    }
    setFieldError(null);
    setLoading(true);
    try {
      await verifyOtp({ email, code: value });
      setDone(true);
      window.setTimeout(() => navigate(redirect, { replace: true }), 900);
    } catch (err) {
      const errCode = toAuthError(err).code;
      if (errCode === 'invalid_code') {
        setFieldError(AUTH_STRINGS.errors.invalid_code);
        setCode('');
      } else {
        setServerError(AUTH_STRINGS.errors[errCode]);
      }
      setLoading(false);
      setFocusSignal((n) => n + 1);
    }
  };

  const onResend = async () => {
    setServerError(null);
    setNotice(null);
    setResending(true);
    try {
      await resendCode({ email, kind: 'otp' });
      setCode('');
      setFieldError(null);
      setNotice(AUTH_STRINGS.common.resent);
      cooldown.start();
    } catch (err) {
      setServerError(AUTH_STRINGS.errors[toAuthError(err).code]);
    } finally {
      setResending(false);
    }
  };

  if (done) {
    return (
      <AuthLayout>
        <AuthCard
          icon={CheckCircle2}
          iconTone="success"
          title={S.successTitle}
          subtitle={S.successBody}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard icon={ShieldCheck} title={S.title} subtitle={S.subtitle(email)}>
        <FormAlert tone="error" message={serverError} />
        <FormAlert tone="success" message={notice} />
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void submit(code);
          }}
          className="space-y-5"
        >
          <div className="space-y-2">
            <OTPInput
              value={code}
              onChange={(v) => {
                setCode(v);
                if (fieldError) setFieldError(null);
              }}
              onComplete={(v) => void submit(v)}
              error={fieldError ?? undefined}
              errorId={errorId}
              disabled={loading}
              focusSignal={focusSignal}
            />
            <div aria-live="assertive">
              {fieldError && (
                <p
                  id={errorId}
                  className="flex items-start gap-1.5 text-sm font-semibold text-red-600 dark:text-red-300"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {fieldError}
                </p>
              )}
            </div>
          </div>
          <Button type="submit" loading={loading}>
            {S.submit}
          </Button>
        </form>
        <div className="mt-4 flex justify-center">
          <ResendButton secondsLeft={cooldown.left} loading={resending} onResend={onResend} />
        </div>
        <AuthFooterLink linkText={AUTH_STRINGS.common.backToLogin} to="/login" />
      </AuthCard>
    </AuthLayout>
  );
};

export default VerifyOtpPage;
