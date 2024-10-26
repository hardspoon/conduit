import { Metadata } from 'next'
import type { ArticleResponse } from '../types/article'
import { api } from '../lib/api'
import Link from 'next/link'
import { Fragment } from 'react'

export const metadata: Metadata = {
  title: 'Home - Conduit',
  description: 'A place to share your knowledge.',
}

export const dynamic = 'force-dynamic'

async function getArticles() {
  try {
    const response = await api.articles.list('?limit=10')
    if (response.error || !response.data) {
      console.error('Error fetching articles:', response.error)
      return { articles: [], articlesCount: 0 }
    }
    return response.data
  } catch (error) {
    console.error('Error fetching articles:', error)
    return { articles: [], articlesCount: 0 }
  }
}

async function getTags() {
  try {
    const response = await api.tags.list()
    if (response.error || !response.data) {
      console.error('Error fetching tags:', response.error)
      return { tags: [] }
    }
    return response.data
  } catch (error) {
    console.error('Error fetching tags:', error)
    return { tags: [] }
  }
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export default async function HomePage() {
  const [articlesData, tagsData] = await Promise.all([
    getArticles(),
    getTags()
  ])

  return (
    <Fragment>
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <a className="nav-link active">Global Feed</a>
                </li>
              </ul>
            </div>

            {articlesData.articles.length === 0 ? (
              <div className="article-preview">No articles are here... yet.</div>
            ) : (
              articlesData.articles.map((article: ArticleResponse) => (
                <div key={article.slug} className="article-preview">
                  <div className="article-meta">
                    <Link href={`/profile/${article.author.username}`}>
                      <img 
                        src={article.author.image || 'https://api.realworld.io/images/smiley-cyrus.jpeg'} 
                        alt={article.author.username}
                      />
                    </Link>
                    <div className="info">
                      <Link href={`/profile/${article.author.username}`} className="author">
                        {article.author.username}
                      </Link>
                      <span className="date">
                        {formatDate(article.createdAt)}
                      </span>
                    </div>
                    <button className="btn btn-outline-primary btn-sm pull-xs-right">
                      <i className="ion-heart"></i> {article.favoritesCount}
                    </button>
                  </div>
                  <Link href={`/article/${article.slug}`} className="preview-link">
                    <h1>{article.title}</h1>
                    <p>{article.description}</p>
                    <span>Read more...</span>
                    <ul className="tag-list">
                      {article.tagList.map((tag) => (
                        <li key={tag.name} className="tag-default tag-pill tag-outline">
                          {tag.name}
                        </li>
                      ))}
                    </ul>
                  </Link>
                </div>
              ))
            )}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <div className="tag-list">
                {tagsData.tags.length === 0 ? (
                  <div>No tags are here... yet.</div>
                ) : (
                  tagsData.tags.map((tag: string) => (
                    <Link 
                      key={tag} 
                      href={`/?tag=${tag}`} 
                      className="tag-pill tag-default"
                    >
                      {tag}
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
