import { Metadata } from 'next'
import { Article, Tag } from '@/types'
import { api } from '@/lib/api'

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
      return { articles: [] }
    }
    return response.data
  } catch (error) {
    console.error('Error fetching articles:', error)
    return { articles: [] }
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

export default async function HomePage() {
  const [articlesData, tagsData] = await Promise.all([
    getArticles(),
    getTags()
  ])

  return (
    <main>
      <div className="home-page">
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
                articlesData.articles.map((article: Article) => (
                  <div key={article.slug} className="article-preview">
                    <div className="article-meta">
                      <img 
                        src={article.author.image || 'https://api.realworld.io/images/smiley-cyrus.jpeg'} 
                        alt={article.author.username}
                      />
                      <div className="info">
                        <a className="author">{article.author.username}</a>
                        <span className="date">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button className="btn btn-outline-primary btn-sm pull-xs-right">
                        <i className="ion-heart"></i> {article.favoritesCount}
                      </button>
                    </div>
                    <a className="preview-link">
                      <h1>{article.title}</h1>
                      <p>{article.description}</p>
                      <span>Read more...</span>
                      <ul className="tag-list">
                        {article.tagList.map((tag: string) => (
                          <li key={tag} className="tag-default tag-pill tag-outline">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </a>
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
                    tagsData.tags.map((tag: Tag) => (
                      <a key={tag} className="tag-pill tag-default">
                        {tag}
                      </a>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
