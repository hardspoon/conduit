import { Article, Tag } from '@/types';

// Mock data for fallback
const MOCK_DATA = {
  articles: [
    {
      slug: "how-to-train-your-dragon",
      title: "How to train your dragon",
      description: "Ever wonder how?",
      body: "Very carefully.",
      tagList: ["dragons", "training"],
      createdAt: "2023-11-24",
      updatedAt: "2023-11-24",
      favorited: false,
      favoritesCount: 0,
      author: {
        username: "jake",
        bio: "I work at statefarm",
        image: "https://i.stack.imgur.com/xHWG8.jpg",
        following: false
      }
    },
    {
      slug: "how-to-train-your-dragon-2",
      title: "How to train your dragon 2",
      description: "So toothless...",
      body: "It a dragon",
      tagList: ["dragons", "training"],
      createdAt: "2023-11-24",
      updatedAt: "2023-11-24",
      favorited: false,
      favoritesCount: 0,
      author: {
        username: "jake",
        bio: "I work at statefarm",
        image: "https://i.stack.imgur.com/xHWG8.jpg",
        following: false
      }
    }
  ],
  tags: ["dragons", "training", "coffee", "entertainment", "programming"]
};

const API_URL = 'https://demo.realworld.io/api';

type APIResponse<T> = {
  data?: T;
  error?: string;
};

type ArticlesResponse = {
  articles: Article[];
  articlesCount: number;
};

type TagsResponse = {
  tags: Tag[];
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
    const res = await fetch(`${API_URL}${endpoint}`, defaultOptions);
    
    if (!res.ok) {
      console.error(`API error: ${res.status} - ${res.statusText}`);
      // Return mock data if API fails
      if (endpoint.includes('/articles')) {
        return { data: { articles: MOCK_DATA.articles, articlesCount: MOCK_DATA.articles.length } as T };
      }
      if (endpoint.includes('/tags')) {
        return { data: { tags: MOCK_DATA.tags } as T };
      }
      throw new Error(`API error: ${res.status}`);
    }
    
    const data = await res.json();
    return { data };
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    // Return mock data if API fails
    if (endpoint.includes('/articles')) {
      return { data: { articles: MOCK_DATA.articles, articlesCount: MOCK_DATA.articles.length } as T };
    }
    if (endpoint.includes('/tags')) {
      return { data: { tags: MOCK_DATA.tags } as T };
    }
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export const api = {
  articles: {
    list: (params = ''): Promise<APIResponse<ArticlesResponse>> => 
      fetchAPI<ArticlesResponse>(`/articles${params}`),
    get: (slug: string): Promise<APIResponse<{ article: Article }>> => 
      fetchAPI<{ article: Article }>(`/articles/${slug}`),
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
