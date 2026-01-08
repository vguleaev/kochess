import type { Recipe, RecipeListResponse, CreateRecipeInput } from '@/types/recipe';
import type {
  ProfileResponse,
  UpsertProfileRequest,
  UpsertProfileResponse,
} from '@kochess/shared/types';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

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
  list: async () => {
    return fetchWithAuth<RecipeListResponse>('/recipes');
  },

  create: async (input: CreateRecipeInput) => {
    return fetchWithAuth<Recipe>('/recipes', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  get: async (id: string) => {
    return fetchWithAuth<Recipe>(`/recipes/${id}`);
  },

  update: async (id: string, input: Partial<CreateRecipeInput>) => {
    return fetchWithAuth<Recipe>(`/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  delete: async (id: string) => {
    return fetchWithAuth<void>(`/recipes/${id}`, {
      method: 'DELETE',
    });
  },
};

export const profileApi = {
  get: async () => {
    return fetchWithAuth<ProfileResponse>('/profile');
  },

  upsert: async (input: UpsertProfileRequest) => {
    return fetchWithAuth<UpsertProfileResponse>('/profile', {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },
};

export { ApiError };
