import React from 'react';
import { useAppContext } from '../contexts/AppContext'; // 1. Εισάγουμε το custom hook μας

const LeaderboardPage = () => {
  // 2. Παίρνουμε τα δεδομένα απευθείας από το καθολικό context.
  // Δεν χρειαζόμαστε πλέον useState ή useEffect σε αυτό το αρχείο!
  const { leaderboard, loadingLeaderboard } = useAppContext();

  // 3. Προσθέτουμε μια κατάσταση φόρτωσης για καλύτερη εμπειρία χρήστη.
  if (loadingLeaderboard) {
    return (
      <div className="min-h-screen bg-pink-50 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // 4. Το JSX παραμένει το ίδιο, αλλά τώρα διαβάζει τα δεδομένα από το context.
  return (
    <div className="min-h-screen bg-pink-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
          Leaderboard
        </h1>
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-lg sm:text-2xl font-semibold mb-6 text-center">Κατάταξη</h2>

          {leaderboard.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              Δεν υπάρχουν ακόμα συμμετοχές σε αυτό το leaderboard.
            </p>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.nickname} // Χρησιμοποιούμε το nickname ως κλειδί
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    index === 0
                      ? 'bg-yellow-100 border border-yellow-300'
                      : index === 1
                        ? 'bg-gray-200'
                        : index === 2
                          ? 'bg-orange-100'
                          : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-xl sm:text-2xl font-bold text-pink-600 w-10 text-center">
                      {index === 0
                        ? '🥇'
                        : index === 1
                          ? '🥈'
                          : index === 2
                            ? '🥉'
                            : `#${index + 1}`}
                    </span>
                    <span className="font-semibold text-sm sm:text-base text-gray-800">
                      {entry.nickname}
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-gray-800">
                    {entry.total_points} πόντοι
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
