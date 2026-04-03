import { Link } from 'react-router-dom';

export default function PostCard({ post, variant = 'list' }) {
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Draft';

  if (variant === 'grid') {
    return (
      <Link to={`/posts/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
        <article className="post-grid-card">
          <div className="cover">
            {post.cover_url
              ? <img src={post.cover_url} alt={post.title} />
              : <div style={{ background: post.category_color || 'var(--cream)', width: '100%', height: '100%' }} />}
          </div>
          <div className="body">
            {post.category_name && (
              <div className="post-card__cat" style={{ color: post.category_color }}>{post.category_name}</div>
            )}
            <h3 className="post-card__title" style={{ fontSize: '1.1rem' }}>{post.title}</h3>
            {post.excerpt && <p className="post-card__excerpt">{post.excerpt}</p>}
            <div className="post-card__meta">
              <span>{date}</span>
              {post.read_time && <span>{post.read_time} min read</span>}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/posts/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
      <article className="post-card">
        {post.category_name && (
          <div className="post-card__cat" style={{ color: post.category_color }}>{post.category_name}</div>
        )}
        <h2 className="post-card__title">{post.title}</h2>
        {post.excerpt && <p className="post-card__excerpt">{post.excerpt}</p>}
        <div className="post-card__meta">
          <span>{post.author_name}</span>
          <span>·</span><span>{date}</span>
          {post.read_time && <><span>·</span><span>{post.read_time} min read</span></>}
          {post.views > 0 && <><span>·</span><span>{post.views} views</span></>}
        </div>
      </article>
    </Link>
  );
}
