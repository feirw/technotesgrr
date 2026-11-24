import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, KeyRound, Link2Off, Loader2 } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import PasswordField from '@/components/auth/PasswordField';
import Button, { ButtonLink } from '@/components/auth/Button';
import FormAlert from '@/components/auth/FormAlert';
import AuthFooterLink from '@/components/auth/AuthFooterLink';
import { AUTH_STRINGS } from '@/data/authStrings';
import {
  checkResetToken,
  resetPassword,
  toAuthError,
  type AuthErrorCode,
} from '@/lib/auth/mockAuth';
import { useAuthForm } from '@/lib/auth/hooks';
import { validateConfirm, validateStrongPassword } from '@/lib/auth/validation';

const S = AUTH_STRINGS.reset;
const F = AUTH_STRINGS.fields;

type View = 'checking' | 'form' | 'success' | 'invalid' | 'expired';

const linkStateFor = (code: AuthErrorCode): View | null =>
  code === 'expired_token' ? 'expired' : code === 'invalid_token' ? 'invalid' : null;

const ResetPasswordPage: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [view, setView] = useState<View>('checking');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const { values, errors, set, blur, validateAll } = useAuthForm(
    { password: '', confirm: '' },
    { password: validateStrongPassword, confirm: (v, all) => validateConfirm(v, all.password) }
  );

  useEffect(() => {
    let cancelled = false;
    setView('checking');
    checkResetToken(token)
      .then(() => !cancelled && setView('form'))
      .catch((err) => {
        if (cancelled) return;
        setView(linkStateFor(toAuthError(err).code) ?? 'invalid');
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const firstInvalid = validateAll();
    if (firstInvalid) {
      (firstInvalid === 'password' ? passwordRef : confirmRef).current?.focus();
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ token: token ?? '', password: values.password });
      setView('success');
    } catch (err) {
      const code = toAuthError(err).code;
      const linkState = linkStateFor(code);
      if (linkState) setView(linkState);
      else setServerError(AUTH_STRINGS.errors[code]);
    } finally {
      setLoading(false);
    }
  };

  let content: React.ReactNode;
  if (view === 'checking') {
    content = (
      <div className="flex justify-center py-10" role="status" aria-live="polite">
        <Loader2 className="h-8 w-8 animate-spin text-[#e06d88]" aria-hidden />
        <span className="sr-only">{AUTH_STRINGS.common.loading}</span>
      </div>
    );
  } else if (view === 'success') {
    content = (
      <AuthCard
        icon={CheckCircle2}
        iconTone="success"
        title={S.successTitle}
        subtitle={S.successBody}
      >
        <ButtonLink to="/login">{S.successCta}</ButtonLink>
      </AuthCard>
    );
  } else if (view === 'invalid' || view === 'expired') {
    content = (
      <AuthCard
        icon={Link2Off}
        iconTone="error"
        title={view === 'expired' ? S.expiredTitle : S.invalidTitle}
        subtitle={S.invalidBody}
      >
        <ButtonLink to="/forgot-password">{S.invalidCta}</ButtonLink>
        <AuthFooterLink linkText={AUTH_STRINGS.common.backToLogin} to="/login" />
      </AuthCard>
    );
  } else {
    content = (
      <AuthCard icon={KeyRound} title={S.title} subtitle={S.subtitle}>
        <FormAlert tone="error" message={serverError} />
        <form noValidate onSubmit={onSubmit} className="space-y-5">
          <PasswordField
            ref={passwordRef}
            label={F.newPassword}
            name="new-password"
            autoComplete="new-password"
            value={values.password}
            onChange={(e) => set('password', e.target.value)}
            onBlur={() => blur('password')}
            error={errors.password}
            disabled={loading}
            showStrength
            required
          />
          <PasswordField
            ref={confirmRef}
            label={F.confirmPassword}
            name="confirm-password"
            autoComplete="new-password"
            value={values.confirm}
            onChange={(e) => set('confirm', e.target.value)}
            onBlur={() => blur('confirm')}
            error={errors.confirm}
            disabled={loading}
            required
          />
          <Button type="submit" loading={loading}>
            {S.submit}
          </Button>
        </form>
        <AuthFooterLink linkText={AUTH_STRINGS.common.backToLogin} to="/login" />
      </AuthCard>
    );
  }

  return <AuthLayout>{content}</AuthLayout>;
};

export default ResetPasswordPage;
