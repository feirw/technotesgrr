import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAuthToken } from '@/context/AuthContext';
import { apiFetch } from '@/utils/apiClient';
import { getBackendUrl } from '@/utils/backendUrl';

const BACKEND_URL = getBackendUrl();
const PUSH_DEBOUNCE_MS = 800;

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Drop-in replacement for `useState` backed by localStorage (πάντα, ώστε να δουλεύει
 * και χωρίς σύνδεση) που επιπλέον συγχρονίζεται με τον λογαριασμό του χρήστη όταν είναι
 * συνδεδεμένος: στο login φορτώνει το αντίγραφο του server (αν υπάρχει) και από κει και
 * πέρα σπρώχνει (debounced) κάθε αλλαγή στο `/api/progress/{key}`.
 */
export function useSyncedStorage<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const { user } = useAuth();
  const [value, setValue] = useState<T>(() => readLocal(key, defaultValue));

  const hydratedForUserRef = useRef<number | null>(null);
  const skipNextPushRef = useRef(false);

  // Στο login (ή στο πρώτο mount αν είναι ήδη συνδεδεμένος), φέρε το αντίγραφο του server μία φορά.
  useEffect(() => {
    if (!user || hydratedForUserRef.current === user.id) return;
    hydratedForUserRef.current = user.id;

    const token = getAuthToken();
    if (!token) return;

    apiFetch<{ data: T | null }>(`${BACKEND_URL}/api/progress/${key}`, {
      headers: { Authorization: `Bearer ${token}` },
      retries: 0,
    })
      .then((res) => {
        if (res.data !== null && res.data !== undefined) {
          skipNextPushRef.current = true;
          setValue(res.data);
        }
      })
      .catch(() => {
        // offline-first: αν αποτύχει η ανάκτηση, μένουμε στην τοπική τιμή.
      });
  }, [user, key]);

  // Πάντα γράφουμε τοπικά· αν είμαστε συνδεδεμένοι, σπρώχνουμε (debounced) και στον server.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage γεμάτο/μπλοκαρισμένο — δεν είναι κρίσιμο, συνεχίζουμε.
    }

    if (skipNextPushRef.current) {
      skipNextPushRef.current = false;
      return;
    }
    if (!user) return;
    const token = getAuthToken();
    if (!token) return;

    const timer = window.setTimeout(() => {
      void apiFetch(`${BACKEND_URL}/api/progress/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ data: value }),
        retries: 1,
      }).catch(() => {
        // best-effort: η τοπική αποθήκευση έχει ήδη γίνει, δεν χάνεται η πρόοδος.
      });
    }, PUSH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, user, key]);

  return [value, setValue];
}
