import { prisma } from "../../../lib/prisma"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from "../../../lib/auth"
import type { ArticleResponse, CreateArticleInput } from '../../../types/article'

type DbUser = {
  id: string;
  username: string;
  bio: string | null;
  image: string | null;
}

type ArticleWithIncludes = {
  id: string
  slug: string
  title: string
  description: string
  body: string
  createdAt: Date
  updatedAt: Date
  authorId: string
  favoritesCount: number
  author: {
    username: string
    bio: string | null
    image: string | null
    followers: DbUser[]
  }
  tagList: { name: string }[]
  favoritedBy: DbUser[]
  _count: {
    favoritedBy: number
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tag = searchParams.get('tag')
  const author = searchParams.get('author')
  const favorited = searchParams.get('favorited')
  const limit = parseInt(searchParams.get('limit') ?? '10')
  const offset = parseInt(searchParams.get('offset') ?? '0')

  const where = {
    ...(author ? {
      author: {
        username: author
      }
    } : {}),
    ...(favorited ? {
      favoritedBy: {
        some: {
          username: favorited
        }
      }
    } : {}),
    ...(tag ? {
      tagList: {
        some: {
          name: tag
        }
      }
    } : {})
  }

  try {
    const [articles, count] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              username: true,
              bio: true,
              image: true,
              followers: true
            }
          },
          tagList: true,
          favoritedBy: true,
          _count: {
            select: { favoritedBy: true }
          }
        },
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.article.count({ where })
    ])

    const session = await getServerSession(authOptions)
    const articlesWithFavorited = articles.map((article: ArticleWithIncludes) => ({
      ...article,
      favorited: article.favoritedBy.some((user: DbUser) => user.id === session?.user?.id),
      favoritesCount: article._count.favoritedBy,
      author: {
        ...article.author,
        following: article.author.followers.some((user: DbUser) => user.id === session?.user?.id)
      }
    })) as ArticleResponse[]

    return NextResponse.json({
      articles: articlesWithFavorited,
      articlesCount: count
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const json = await request.json() as CreateArticleInput
    const { title, description, body, tagList } = json.article

    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .concat('-', Math.random().toString(36).substring(2, 7))

    const article = await prisma.article.create({
      data: {
        title,
        description,
        body,
        slug,
        author: {
          connect: { id: session.user.id }
        },
        tagList: {
          connectOrCreate: tagList.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag }
          }))
        }
      },
      include: {
        author: {
          select: {
            username: true,
            bio: true,
            image: true,
            followers: true
          }
        },
        tagList: true,
        favoritedBy: true,
        _count: {
          select: { favoritedBy: true }
        }
      }
    })

    const articleResponse: ArticleResponse = {
      ...article,
      favorited: false,
      favoritesCount: 0,
      author: {
        ...article.author,
        following: false
      }
    }

    return NextResponse.json({
      article: articleResponse
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
