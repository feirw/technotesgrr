import { useAuth } from '@/context/AuthContext';
import { FormEvent, useState } from 'react';

export default function AuthTestScreen() {
  const { user, isLoading, login, register, logout } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    resetMessages();
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password, rememberMe);
        setSuccess('Login successful.');
      } else {
        await register(name, email, password);
        setSuccess('Registration successful.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    resetMessages();
    setIsSubmitting(true);

    try {
      await logout();
      setSuccess('Logout successful.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Auth Test</h1>
          <p className="mt-2 text-muted-foreground">Checking session...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-start justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Auth Test</h1>
          <p className="mt-1 text-sm text-muted-foreground">Better Auth integration test</p>
        </div>

        {user ? (
          <section className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold">Authenticated</h2>
              <p className="text-sm text-muted-foreground">Current Better Auth session</p>
            </div>

            <div className="space-y-3 rounded-md bg-muted p-4">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">ID</p>
                <p className="font-mono text-sm">{user.id}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Email</p>
                <p className="text-sm">{user.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isSubmitting}
              className="w-full rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Logging out...' : 'Logout'}
            </button>
          </section>
        ) : (
          <section className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-6 flex rounded-md bg-muted p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  resetMessages();
                }}
                className={`flex-1 rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                  mode === 'login'
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  resetMessages();
                }}
                className={`flex-1 rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                  mode === 'register'
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              {mode === 'login' && (
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border"
                  />

                  <span className="text-sm">Remember me</span>
                </label>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
              </button>
            </form>
          </section>
        )}

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <span className="font-medium">Error:</span> {error}
          </div>
        )}

        {success && (
          <div className="rounded-md border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400">
            {success}
          </div>
        )}

        <section className="rounded-lg border bg-card p-6">
          <h2 className="mb-3 text-sm font-semibold">Session data</h2>

          <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
            {JSON.stringify(user, null, 2)}
          </pre>
        </section>
      </div>
    </main>
  );
}
