export interface User {
  email: string;
  username: string;
  bio: string | null;
  image: string;
  token: string;
}

export type Tag = string;

export interface Article {
  slug: string;
  body: string;
  createdAt: string;
  description: string;
  favorited: boolean;
  favoritesCount: number;
  tagList: Tag[];
  title: string;
  updatedAt: string;
  author: Author;
}

export interface Profile {
  email: string;
  username: string;
  bio: string | null;
  image: string;
  following: boolean;
}

export interface Author {
  bio: string;
  following: boolean;
  image: string;
  username: string;
}
