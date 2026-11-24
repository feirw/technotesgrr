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
import { signup, toAuthError } from '@/lib/auth/mockAuth';
import { useAuthForm } from '@/lib/auth/hooks';
import {
  safeRedirect,
  validateConfirm,
  validateEmail,
  validateName,
  validateStrongPassword,
} from '@/lib/auth/validation';

const S = AUTH_STRINGS.signup;
const F = AUTH_STRINGS.fields;

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const hasRedirect = Boolean(params.get('redirect'));
  const redirect = safeRedirect(params.get('redirect'));

  const { values, errors, set, blur, validateAll } = useAuthForm(
    { name: '', email: '', password: '', confirm: '', terms: false },
    {
      name: validateName,
      email: validateEmail,
      password: validateStrongPassword,
      confirm: (v, all) => validateConfirm(v, all.password),
      terms: (v) => (v ? undefined : AUTH_STRINGS.validation.termsRequired),
    }
  );
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    confirm: useRef<HTMLInputElement>(null),
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setInfo(null);
    const firstInvalid = validateAll();
    if (firstInvalid) {
      if (firstInvalid === 'terms')
        document.querySelector<HTMLInputElement>('input[name="terms"]')?.focus();
      else refs[firstInvalid].current?.focus();
      return;
    }
    setLoading(true);
    try {
      await signup(values);
      const qs = new URLSearchParams({ email: values.email.trim() });
      if (hasRedirect) qs.set('redirect', redirect);
      navigate(`/verify-email?${qs.toString()}`);
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
            ref={refs.name}
            label={F.name}
            name="name"
            autoComplete="name"
            autoCapitalize="words"
            placeholder={F.namePlaceholder}
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            onBlur={() => blur('name')}
            error={errors.name}
            disabled={loading}
            required
          />
          <TextField
            ref={refs.email}
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
            ref={refs.password}
            label={F.password}
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
            ref={refs.confirm}
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
          <Checkbox
            name="terms"
            checked={values.terms}
            onChange={(v) => {
              set('terms', v);
              blur('terms');
            }}
            error={errors.terms}
          >
            {S.termsPrefix}
            <Link to="/privacy-policy" target="_blank" className={authLinkClass}>
              {S.terms}
            </Link>
            {S.termsJoin}
            <Link to="/data" target="_blank" className={authLinkClass}>
              {S.privacy}
            </Link>
          </Checkbox>
          <Button type="submit" loading={loading}>
            {S.submit}
          </Button>
        </form>

        <AuthFooterLink
          text={S.footer}
          linkText={S.footerLink}
          to={hasRedirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
        />
      </AuthCard>
    </AuthLayout>
  );
};

export default SignupPage;
