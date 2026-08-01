import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { apiFetch } from '@/utils/apiClient';
import { getBackendUrlCandidates } from '@/utils/backendUrl';

interface LeaderboardEntry {
  nickname: string;
  total_points: number;
}

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      let lastError: unknown = null;
      try {
        for (const base of getBackendUrlCandidates()) {
          try {
            const data = await apiFetch<{ leaderboard?: LeaderboardEntry[] }>(`${base}/api/leaderboard`, {
              dedupeKey: `leaderboard:${base}`,
              cacheKey: `leaderboard:${base}`,
              cacheTtlMs: 30_000,
              timeoutMs: 20_000,
              retries: 1,
            });
            setLeaderboard(Array.isArray(data?.leaderboard) ? data.leaderboard : []);
            return;
          } catch (error) {
            lastError = error;
          }
        }
      } catch (error) {
        lastError = error;
      } finally {
        if (lastError) {
          console.error('Error fetching leaderboard:', lastError);
        }
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 dark:bg-[#2d1c48] py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-[#2d1c48] py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-center text-gray-900 dark:text-[#faf5ef] mb-8">
          Leaderboard 🏆
        </h1>
        <div className="bg-white dark:bg-[#3a2658] rounded-xl shadow-lg p-6 sm:p-8 border border-pink-100 dark:border-white/15">
          <h2 className="text-lg sm:text-2xl font-semibold mb-6 text-center text-gray-700 dark:text-gray-200">
            Κορυφαίοι Παίκτες του Μήνα
          </h2>

          {leaderboard.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              Δεν υπάρχουν ακόμα συμμετοχές σε αυτό το leaderboard.
            </p>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => {
                let rankIcon = <span className="text-gray-600">#{index + 1}</span>;
                let rowClass = 'bg-white border-gray-100';

                // Styling for top 3
                if (index === 0) {
                  rankIcon = <Trophy className="w-6 h-6 text-yellow-500" />;
                  rowClass = 'bg-yellow-50 border-yellow-200 shadow-sm';
                } else if (index === 1) {
                  rankIcon = <Medal className="w-6 h-6 text-gray-400" />;
                  rowClass = 'bg-gray-50 border-gray-300 shadow-sm';
                } else if (index === 2) {
                  rankIcon = <Award className="w-6 h-6 text-orange-400" />;
                  rowClass = 'bg-orange-50 border-orange-200 shadow-sm';
                }

                return (
                  <div
                    key={`${entry.nickname}-${index}`}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-transform hover:scale-[1.01] ${rowClass}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="font-bold text-xl w-10 flex justify-center">{rankIcon}</div>
                      <span className="font-bold text-base sm:text-lg text-gray-800 dark:text-gray-100">
                        {entry.nickname}
                      </span>
                    </div>
                    <span className="text-base sm:text-lg font-black text-pink-600">
                      {entry.total_points} pts
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
