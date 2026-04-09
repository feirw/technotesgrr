import { apiFetch } from '@/utils/apiClient';
import { getBackendUrlCandidates } from '@/utils/backendUrl';

export interface BackendFlashcardsResponse {
  flashcards: Array<{
    id: number;
    category: string;
    question: string;
    answer: string;
  }>;
}

const FLASHCARDS_FETCH_TIMEOUT_MS = 60_000;

/** Κοινό fetch για Flashcards page + prefetch — ίδιο cacheKey στο apiClient. */
export async function fetchFlashcardsFromBackend() {
  let lastError: unknown = null;
  for (const base of getBackendUrlCandidates()) {
    try {
      const response = await apiFetch<BackendFlashcardsResponse>(
        `${base}/api/flashcards?limit=5000&offset=0`,
        {
          dedupeKey: `flashcards:all:${base}`,
          cacheTtlMs: 5 * 60 * 1000,
          cacheKey: `flashcards:all:${base}`,
          timeoutMs: FLASHCARDS_FETCH_TIMEOUT_MS,
          retries: 1,
        }
      );

      if (Array.isArray(response?.flashcards)) {
        return response;
      }
      lastError = new Error(`Malformed flashcards payload from ${base}`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error('Unable to load flashcards from all backend candidates.');
}
