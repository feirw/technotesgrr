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
  try {
    const response = await fetch('/api/categories');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiCategoriesResponse = await response.json();

    return {
      quizCategories: data.quiz_categories || [],
      flashcardCategories: data.flashcard_categories || [],
      allCategories: data.all_categories || [],
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      quizCategories: [],
      flashcardCategories: [],
      allCategories: [],
    };
  }
};
