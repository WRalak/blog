import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import PostCard from '../components/PostCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/posts?featured=1&limit=4'),
      api.get('/posts?limit=6'),
    ]).then(([feat, rec]) => {
      setFeatured(feat.posts);
      setRecent(rec.posts);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading…</div>;

  const [hero, ...sidebar] = featured.length ? featured : recent;

  return (
    <main>
      <div className="container">
        {/* ── Hero ── */}
        {hero && (
          <div className="hero-grid">
            <Link to={`/posts/${hero.slug}`} className="hero-main" style={{ textDecoration: 'none' }}>
              <div className="cover">
                {hero.cover_url
                  ? <img src={hero.cover_url} alt={hero.title} />
                  : <div style={{ background: hero.category_color || 'var(--cream)', width: '100%', height: '100%' }} />}
              </div>
              {hero.category_name && (
                <div className="post-card__cat" style={{ color: hero.category_color }}>{hero.category_name}</div>
              )}
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', lineHeight: 1.15, marginBottom: '0.75rem' }}>{hero.title}</h1>
              {hero.excerpt && <p style={{ color: 'var(--muted)', marginBottom: '0.75rem' }}>{hero.excerpt}</p>}
              <div className="post-card__meta">
                <span>{hero.author_name}</span><span>·</span>
                <span>{hero.published_at ? new Date(hero.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</span>
                {hero.read_time && <><span>·</span><span>{hero.read_time} min read</span></>}
              </div>
            </Link>
            <aside className="hero-sidebar">
              {sidebar.slice(0, 3).map(p => <PostCard key={p.id} post={p} />)}
            </aside>
          </div>
        )}

        {/* ── Recent ── */}
        <hr className="section-rule" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <p className="section-label">Latest Stories</p>
          <Link to="/posts" style={{ fontSize: '0.8rem', color: 'var(--muted)', textDecoration: 'underline' }}>View all →</Link>
        </div>
        <div className="post-grid">
          {recent.map(p => <PostCard key={p.id} post={p} variant="grid" />)}
        </div>
        {recent.length === 0 && (
          <div className="empty">
            <p>No posts yet.</p>
            <Link to="/write" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Write the first one →</Link>
          </div>
        )}
      </div>
    </main>
  );
}
