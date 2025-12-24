import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { supabase, isMockMode, isSupabaseConfigured } from '@/utils/supabaseClient';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  message: string;
  details?: Record<string, any>;
}

interface DiagnosticsResults {
  timestamp: string;
  tests: TestResult[];
}

const DiagnosticsPage: React.FC = () => {
  const [testResults, setTestResults] = useState<DiagnosticsResults | null>(null);
  const [testing, setTesting] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    const results: DiagnosticsResults = {
      timestamp: new Date().toISOString(),
      tests: [],
    };

    try {
      // Test 1: Environment Variables
      results.tests.push({
        name: 'Environment Variables',
        status: isSupabaseConfigured ? 'pass' : 'fail',
        message: isSupabaseConfigured
          ? 'Supabase URL and Key are configured'
          : 'Supabase credentials are missing or placeholder values',
        details: {
          url: import.meta.env.VITE_SUPABASE_URL || 'NOT SET',
          keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0,
          isMockMode,
        },
      });

      // Test 2: Supabase Connection
      if (!isMockMode) {
        try {
          const start = Date.now();
          const { data, error } = await Promise.race([
            supabase.auth.getSession(),
            new Promise<any>((_, reject) =>
              setTimeout(() => reject(new Error('Timeout')), 5000)
            ),
          ]);
          const duration = Date.now() - start;

          if (error) throw error;

          results.tests.push({
            name: 'Supabase Connection',
            status: 'pass',
            message: `Connected successfully in ${duration}ms`,
            details: { duration, hasSession: !!data.session },
          });
        } catch (e: any) {
          results.tests.push({
            name: 'Supabase Connection',
            status: 'fail',
            message: e.message || 'Connection failed',
            details: { error: String(e) },
          });
        }
      } else {
        results.tests.push({
          name: 'Supabase Connection',
          status: 'skip',
          message: 'Skipped - Running in mock mode',
        });
      }

      // Test 3: Backend API
      try {
        const response = await fetch('http://localhost:8001/api/health');
        const data = await response.json();

        results.tests.push({
          name: 'Backend API',
          status: response.ok ? 'pass' : 'fail',
          message: response.ok ? 'Backend is responding' : 'Backend returned error',
          details: { status: response.status, data },
        });
      } catch (e: any) {
        results.tests.push({
          name: 'Backend API',
          status: 'fail',
          message: 'Cannot connect to backend',
          details: { error: String(e) },
        });
      }

      // Test 4: Test Login (with mock credentials)
      if (!isMockMode) {
        try {
          const start = Date.now();
          const { error } = await Promise.race([
            supabase.auth.signInWithPassword({
              email: 'test@test.com',
              password: 'wrongpassword',
            }),
            new Promise<any>((_, reject) =>
              setTimeout(() => reject(new Error('Login timeout')), 10000)
            ),
          ]);
          const duration = Date.now() - start;

          results.tests.push({
            name: 'Login Endpoint',
            status: 'pass',
            message: `Login endpoint responding in ${duration}ms (expected to fail with wrong credentials)`,
            details: { duration, error: error?.message || 'None' },
          });
        } catch (e: any) {
          results.tests.push({
            name: 'Login Endpoint',
            status: 'fail',
            message: 'Login endpoint timeout or error',
            details: { error: String(e) },
          });
        }
      }
    } catch (error) {
      console.error('Diagnostics error:', error);
    } finally {
      setTestResults(results);
      setTesting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'text-green-600';
      case 'fail':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'fail':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            🔧 System Diagnostics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Test authentication and connection issues
          </p>

          <button
            onClick={runDiagnostics}
            disabled={testing}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-8"
          >
            {testing ? 'Running Tests...' : 'Run Diagnostics'}
          </button>

          {testResults && (
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Test Run:</strong> {new Date(testResults.timestamp).toLocaleString()}
                </p>
              </div>

              {testResults.tests.map((test, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-200 dark:border-gray-600 rounded-xl p-6"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {getStatusIcon(test.status)}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                        {test.name}
                      </h3>
                      <p className={`text-sm mt-1 ${getStatusColor(test.status)}`}>
                        {test.message}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor(
                        test.status
                      )}`}
                    >
                      {test.status.toUpperCase()}
                    </span>
                  </div>

                  {test.details && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-pink-600 transition-colors">
                        Show Details
                      </summary>
                      <pre className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs overflow-auto">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}

              {/* Summary */}
              <div className="mt-8 p-6 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                  Summary & Recommendations
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                  {isMockMode && (
                    <li className="flex items-start gap-2">
                      <span>⚠️</span>
                      <span>
                        <strong>Mock Mode Active:</strong> Create a <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">.env</code> file in the
                        frontend directory with your Supabase credentials to enable authentication.
                      </span>
                    </li>
                  )}
                  {testResults.tests.some(
                    (t) => t.name === 'Backend API' && t.status === 'fail'
                  ) && (
                    <li className="flex items-start gap-2">
                      <span>❌</span>
                      <span>
                        <strong>Backend Not Running:</strong> Start the backend with{' '}
                        <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">cd backend && python server.py</code>
                      </span>
                    </li>
                  )}
                  {testResults.tests.some(
                    (t) => t.name === 'Supabase Connection' && t.status === 'fail'
                  ) && (
                    <li className="flex items-start gap-2">
                      <span>❌</span>
                      <span>
                        <strong>Supabase Connection Failed:</strong> Check your credentials in the
                        .env file and verify your internet connection.
                      </span>
                    </li>
                  )}
                  {testResults.tests.every(
                    (t) => t.status === 'pass' || t.status === 'skip'
                  ) && (
                    <li className="flex items-start gap-2">
                      <span>✅</span>
                      <span>
                        <strong>All Systems Operational:</strong> You should be able to login
                        successfully now!
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsPage;