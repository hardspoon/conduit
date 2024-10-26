import type { ArticleResponse, CreateArticleInput } from '../types/article';
import type { Tag } from '@prisma/client';

// Get the base URL for API requests
const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

type APIResponse<T> = {
  data?: T;
  error?: string;
};

type ArticlesResponse = {
  articles: ArticleResponse[];
  articlesCount: number;
};

type TagsResponse = {
  tags: string[];
};

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
  const defaultOptions: RequestInit = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
    next: { revalidate: 60 }, // Cache for 1 minute
    ...options,
  };

  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api${endpoint}`;
    const res = await fetch(url, defaultOptions);
    
    if (!res.ok) {
      console.error(`API error: ${res.status} - ${res.statusText}`);
      throw new Error(`API error: ${res.status}`);
    }
    
    const data = await res.json();
    return { data };
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export const api = {
  articles: {
    list: (params = ''): Promise<APIResponse<ArticlesResponse>> => 
      fetchAPI<ArticlesResponse>(`/articles${params}`),
    get: (slug: string): Promise<APIResponse<{ article: ArticleResponse }>> => 
      fetchAPI<{ article: ArticleResponse }>(`/articles/${slug}`),
    feed: (): Promise<APIResponse<ArticlesResponse>> => 
      fetchAPI<ArticlesResponse>('/articles/feed'),
  },
  tags: {
    list: (): Promise<APIResponse<TagsResponse>> => 
      fetchAPI<TagsResponse>('/tags'),
  },
  auth: {
    login: (credentials: { email: string; password: string }) =>
      fetchAPI('/users/login', {
        method: 'POST',
        body: JSON.stringify({ user: credentials }),
      }),
    register: (user: { username: string; email: string; password: string }) =>
      fetchAPI('/users', {
        method: 'POST',
        body: JSON.stringify({ user }),
      }),
  },
};
