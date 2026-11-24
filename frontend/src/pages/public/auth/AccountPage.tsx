import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import Button from '@/components/auth/Button';
import { AUTH_STRINGS } from '@/data/authStrings';
import { logout } from '@/lib/auth/mockAuth';
import { useMockUser } from '@/lib/auth/hooks';

const S = AUTH_STRINGS.account;

const AccountPage: React.FC = () => {
  const user = useMockUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!user && !loading) return <Navigate to="/login?redirect=%2Faccount" replace />;

  const onLogout = async () => {
    setLoading(true);
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <AuthLayout>
      <AuthCard icon={UserRound} title={S.title} subtitle={S.subtitle}>
        <dl className="mb-6 divide-y divide-gray-200 dark:divide-white/10 rounded-2xl border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <dt className="text-sm font-bold text-gray-600 dark:text-gray-300">{S.nameLabel}</dt>
            <dd className="truncate font-semibold text-gray-900 dark:text-[#faf5ef]">
              {user?.name}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <dt className="text-sm font-bold text-gray-600 dark:text-gray-300">{S.emailLabel}</dt>
            <dd className="truncate font-semibold text-gray-900 dark:text-[#faf5ef]">
              {user?.email}
            </dd>
          </div>
        </dl>
        <Button type="button" variant="secondary" loading={loading} onClick={() => void onLogout()}>
          {S.logout}
        </Button>
      </AuthCard>
    </AuthLayout>
  );
};

export default AccountPage;
