import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import PostCard from '../components/PostCard';

export default function PostList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({ posts: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || '';
  const search   = searchParams.get('search')   || '';
  const page     = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams({ page, limit: 12 });
    if (category) q.set('category', category);
    if (search) q.set('search', search);
    api.get(`/posts?${q}`).then(setData).finally(() => setLoading(false));
  }, [category, search, page]);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <main>
      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* Search bar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
          <input
            type="search"
            placeholder="Search posts…"
            defaultValue={search}
            style={{ flex: 1, padding: '0.65rem 1rem', border: '1px solid var(--rule)', borderRadius: 'var(--radius)', fontFamily: 'inherit', fontSize: '0.95rem' }}
            onKeyDown={e => e.key === 'Enter' && setParam('search', e.target.value)}
          />
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{data.total} posts</span>
        </div>

        {loading ? (
          <div className="loading">Loading…</div>
        ) : data.posts.length === 0 ? (
          <div className="empty">No posts found.</div>
        ) : (
          <div className="post-grid">
            {data.posts.map(p => <PostCard key={p.id} post={p} variant="grid" />)}
          </div>
        )}

        {/* Pagination */}
        {data.pages > 1 && (
          <div className="pagination">
            {Array.from({ length: data.pages }, (_, i) => i + 1).map(n => (
              <button key={n} className={page === n ? 'active' : ''}
                onClick={() => setSearchParams(p => { const np = new URLSearchParams(p); np.set('page', n); return np; })}>
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
