import React, { useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import TextField from '@/components/auth/TextField';
import PasswordField from '@/components/auth/PasswordField';
import Checkbox from '@/components/auth/Checkbox';
import Button from '@/components/auth/Button';
import { SocialButtons } from '@/components/auth/SocialButton';
import Divider from '@/components/auth/Divider';
import FormAlert from '@/components/auth/FormAlert';
import AuthFooterLink, { authLinkClass } from '@/components/auth/AuthFooterLink';
import { AUTH_STRINGS } from '@/data/authStrings';
import { login, toAuthError } from '@/lib/auth/mockAuth';
import { useAuthForm } from '@/lib/auth/hooks';
import { safeRedirect, validateEmail, validateRequired } from '@/lib/auth/validation';

const S = AUTH_STRINGS.login;
const F = AUTH_STRINGS.fields;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = safeRedirect(params.get('redirect'));
  const withRedirect = (path: string) =>
    params.get('redirect') ? `${path}?redirect=${encodeURIComponent(redirect)}` : path;

  const { values, errors, set, blur, validateAll } = useAuthForm(
    { email: '', password: '', remember: true },
    { email: validateEmail, password: validateRequired }
  );
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setInfo(null);
    const firstInvalid = validateAll();
    if (firstInvalid) {
      (firstInvalid === 'email' ? emailRef : passwordRef).current?.focus();
      return;
    }
    setLoading(true);
    try {
      const res = await login(values);
      if (res.status === 'otp_required') {
        navigate(
          `/verify-otp?email=${encodeURIComponent(res.email)}&redirect=${encodeURIComponent(redirect)}`
        );
      } else {
        navigate(redirect, { replace: true });
      }
    } catch (err) {
      setServerError(AUTH_STRINGS.errors[toAuthError(err).code]);
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard title={S.title} subtitle={S.subtitle}>
        <FormAlert tone="error" message={serverError} />
        <FormAlert tone="info" message={info} />

        <SocialButtons
          disabled={loading}
          onUnavailable={() => setInfo(AUTH_STRINGS.common.socialUnavailable)}
        />
        <Divider />

        <form noValidate onSubmit={onSubmit} className="space-y-5">
          <TextField
            ref={emailRef}
            label={F.email}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={F.emailPlaceholder}
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            onBlur={() => blur('email')}
            error={errors.email}
            disabled={loading}
            required
          />
          <PasswordField
            ref={passwordRef}
            label={F.password}
            name="password"
            autoComplete="current-password"
            placeholder={F.passwordPlaceholder}
            value={values.password}
            onChange={(e) => set('password', e.target.value)}
            onBlur={() => blur('password')}
            error={errors.password}
            disabled={loading}
            required
            labelAside={
              <Link to="/forgot-password" className={`text-sm ${authLinkClass}`}>
                {S.forgot}
              </Link>
            }
          />
          <Checkbox name="remember" checked={values.remember} onChange={(v) => set('remember', v)}>
            {S.remember}
          </Checkbox>
          <Button type="submit" loading={loading}>
            {S.submit}
          </Button>
        </form>

        <AuthFooterLink text={S.footer} linkText={S.footerLink} to={withRedirect('/signup')} />
      </AuthCard>
    </AuthLayout>
  );
};

export default LoginPage;
