import { User, Tag } from '@prisma/client'

export interface ArticleAuthor {
  username: string
  bio: string | null
  image: string | null
  following: boolean
}

export interface ArticleResponse {
  id: string
  slug: string
  title: string
  description: string
  body: string
  tagList: Tag[]
  createdAt: Date
  updatedAt: Date
  favorited: boolean
  favoritesCount: number
  author: ArticleAuthor
}

export interface CreateArticleInput {
  article: {
    title: string
    description: string
    body: string
    tagList: string[]
  }
}
