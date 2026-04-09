import { apiFetch } from '@/utils/apiClient';
import { getBackendUrlCandidates } from '@/utils/backendUrl';

/**
 * Interface representing a Category.
 * Adjust these fields (id, name, slug, etc.) to match your actual backend object.
 */
export interface Category {
  id: number | string;
  name: string;
  slug?: string;
  [key: string]: any; // Allows for other properties without breaking the type
}

/**
 * Interface for the API response payload
 */
interface ApiCategoriesResponse {
  quiz_categories?: Category[];
  flashcard_categories?: Category[];
  all_categories?: Category[];
}

/**
 * Interface for the function return value
 */
export interface FetchCategoriesResult {
  quizCategories: Category[];
  flashcardCategories: Category[];
  allCategories: Category[];
}

/**
 * Fetches categories from the backend API
 */
export const fetchCategories = async (): Promise<FetchCategoriesResult> => {
  let lastError: unknown = null;
  try {
    for (const base of getBackendUrlCandidates()) {
      try {
        const data = await apiFetch<ApiCategoriesResponse>(`${base}/api/categories`, {
          dedupeKey: `categories:${base}`,
          cacheKey: `categories:${base}`,
          cacheTtlMs: 10 * 60 * 1000,
          timeoutMs: 20_000,
          retries: 1,
        });

        return {
          quizCategories: data.quiz_categories || [],
          flashcardCategories: data.flashcard_categories || [],
          allCategories: data.all_categories || [],
        };
      } catch (error) {
        lastError = error;
      }
    }
  } catch (error) {
    lastError = error;
  }

  console.error('Error fetching categories:', lastError);
  return {
    quizCategories: [],
    flashcardCategories: [],
    allCategories: [],
  };
};
