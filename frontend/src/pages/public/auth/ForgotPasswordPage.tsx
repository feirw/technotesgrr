import React, { useRef, useState } from 'react';
import { MailCheck } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import TextField from '@/components/auth/TextField';
import Button from '@/components/auth/Button';
import FormAlert from '@/components/auth/FormAlert';
import ResendButton from '@/components/auth/ResendButton';
import AuthFooterLink from '@/components/auth/AuthFooterLink';
import { AUTH_STRINGS } from '@/data/authStrings';
import { requestPasswordReset, resendCode, toAuthError } from '@/lib/auth/mockAuth';
import { useAuthForm, useCooldown } from '@/lib/auth/hooks';
import { validateEmail } from '@/lib/auth/validation';

const S = AUTH_STRINGS.forgot;
const C = AUTH_STRINGS.common;

const ForgotPasswordPage: React.FC = () => {
  const { values, errors, set, blur, validateAll } = useAuthForm(
    { email: '' },
    { email: validateEmail }
  );
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resending, setResending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const cooldown = useCooldown(30);
  const emailRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (validateAll()) {
      emailRef.current?.focus();
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset(values.email);
      setSent(true);
      cooldown.start();
    } catch (err) {
      setServerError(AUTH_STRINGS.errors[toAuthError(err).code]);
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setServerError(null);
    setNotice(null);
    setResending(true);
    try {
      await resendCode({ email: values.email, kind: 'reset' });
      setNotice(C.resent);
      cooldown.start();
    } catch (err) {
      setServerError(AUTH_STRINGS.errors[toAuthError(err).code]);
    } finally {
      setResending(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout>
        <AuthCard
          icon={MailCheck}
          title={S.successTitle}
          subtitle={S.successBody(values.email.trim())}
        >
          <FormAlert tone="error" message={serverError} />
          <FormAlert tone="success" message={notice} />
          <div className="flex justify-center">
            <ResendButton secondsLeft={cooldown.left} loading={resending} onResend={onResend} />
          </div>
          <AuthFooterLink linkText={C.backToLogin} to="/login" />
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard title={S.title} subtitle={S.subtitle}>
        <FormAlert tone="error" message={serverError} />
        <form noValidate onSubmit={onSubmit} className="space-y-5">
          <TextField
            ref={emailRef}
            label={AUTH_STRINGS.fields.email}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={AUTH_STRINGS.fields.emailPlaceholder}
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            onBlur={() => blur('email')}
            error={errors.email}
            disabled={loading}
            required
          />
          <Button type="submit" loading={loading}>
            {S.submit}
          </Button>
        </form>
        <AuthFooterLink linkText={C.backToLogin} to="/login" />
      </AuthCard>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
