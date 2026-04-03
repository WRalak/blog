import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { api } from '../api';
import { useAuth } from '../hooks/useAuth';

export default function PostDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/posts/${slug}`)
      .then(setPost)
      .catch(() => setError('Post not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post permanently?')) return;
    await api.delete(`/posts/${post.id}`);
    navigate('/posts');
  };

  if (loading) return <div className="loading">Loading…</div>;
  if (error)   return <div className="empty">{error} <Link to="/">← Home</Link></div>;

  const canEdit = user && (user.id === post.author_id || user.role === 'admin');

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Draft';

  return (
    <article>
      {/* Header */}
      <div className="article-header">
        {post.category_name && (
          <div className="article-header__cat" style={{ color: post.category_color }}>
            <Link to={`/posts?category=${post.category_slug}`}>{post.category_name}</Link>
          </div>
        )}
        <h1 className="article-header__title">{post.title}</h1>
        <div className="article-header__byline">
          <span>By <strong>{post.author_name}</strong></span>
          <span>·</span>
          <span>{date}</span>
          {post.read_time && <><span>·</span><span>{post.read_time} min read</span></>}
          {post.views > 0 && <><span>·</span><span>{post.views} views</span></>}
          {canEdit && (
            <>
              <span>·</span>
              <Link to={`/write/${post.id}`} style={{ color: 'var(--accent)' }}>Edit</Link>
              <span>·</span>
              <button onClick={handleDelete} className="btn btn-danger" style={{ padding: '0.15rem 0.6rem', fontSize: '0.78rem' }}>Delete</button>
            </>
          )}
        </div>
      </div>

      {/* Cover image */}
      {post.cover_url && (
        <div className="article-cover">
          <img src={post.cover_url} alt={post.title} />
        </div>
      )}

      {/* Body */}
      <div className="article-body">
        <ReactMarkdown>{post.content}</ReactMarkdown>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--rule)' }}>
            {post.tags.map(t => (
              <Link key={t.slug} to={`/posts?tag=${t.slug}`} className="tag">{t.name}</Link>
            ))}
          </div>
        )}

        {/* Author bio */}
        {post.author_bio && (
          <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius)', padding: '1.5rem', marginTop: '2.5rem' }}>
            <p style={{ fontWeight: 600, marginBottom: '0.4rem' }}>{post.author_name}</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{post.author_bio}</p>
          </div>
        )}
      </div>
    </article>
  );
}
