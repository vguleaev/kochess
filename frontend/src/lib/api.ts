import type { Recipe, RecipeListResponse, CreateRecipeInput } from '@/types/recipe';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ClerkWindow extends Window {
  Clerk?: {
    session?: {
      getToken: () => Promise<string | null>;
    };
  };
}

declare const window: ClerkWindow;

class ApiError extends Error {
  statusCode: number;
  response?: unknown;

  constructor(message: string, statusCode: number, response?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await window.Clerk?.session?.getToken();

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `Request failed with status ${response.status}`,
      response.status,
      errorData
    );
  }

  return response.json();
}

export const recipeApi = {
  list: async (): Promise<RecipeListResponse> => {
    return fetchWithAuth<RecipeListResponse>('/recipes');
  },

  create: async (input: CreateRecipeInput): Promise<Recipe> => {
    return fetchWithAuth<Recipe>('/recipes', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  get: async (id: string): Promise<Recipe> => {
    return fetchWithAuth<Recipe>(`/recipes/${id}`);
  },

  update: async (id: string, input: Partial<CreateRecipeInput>): Promise<Recipe> => {
    return fetchWithAuth<Recipe>(`/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  delete: async (id: string): Promise<void> => {
    return fetchWithAuth<void>(`/recipes/${id}`, {
      method: 'DELETE',
    });
  },
};

export { ApiError };
