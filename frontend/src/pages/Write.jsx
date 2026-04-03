import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../hooks/useAuth';

const EMPTY = { title: '', excerpt: '', content: '', cover_url: '', category_id: '', status: 'draft', featured: false, tags: '' };

export default function Write() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    api.get('/categories').then(setCategories);
    if (id) {
      api.get(`/posts/${id}`).then(post => {
        setForm({
          title:       post.title,
          excerpt:     post.excerpt || '',
          content:     post.content,
          cover_url:   post.cover_url || '',
          category_id: post.category_id || '',
          status:      post.status,
          featured:    Boolean(post.featured),
          tags:        post.tags?.map(t => t.name).join(', ') || '',
        });
      });
    }
  }, [id]);

  if (!user) {
    return <div className="empty">Please <a href="/login">sign in</a> to write.</div>;
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const uploadCover = async (file) => {
    if (!file) return;
    setUploading(true); setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { url } = await api.upload('/uploads', formData);
      set('cover_url', url);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const save = async (status) => {
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        status,
        category_id: form.category_id ? Number(form.category_id) : null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      const result = id
        ? await api.put(`/posts/${id}`, payload)
        : await api.post('/posts', payload);
      navigate(`/posts/${result.slug}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main>
      <div className="write-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0 }}>{id ? 'Edit Post' : 'New Post'}</h1>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-outline" onClick={() => setPreview(p => !p)}>
              {preview ? 'Edit' : 'Preview'}
            </button>
            <button className="btn btn-outline" onClick={() => save('draft')} disabled={saving}>
              Save Draft
            </button>
            <button className="btn btn-primary" onClick={() => save('published')} disabled={saving}>
              {saving ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1rem' }}>{error}</div>}

        {preview ? (
          <div className="article-body" style={{ border: '1px solid var(--rule)', padding: '2rem', borderRadius: 'var(--radius)' }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', marginBottom: '1rem' }}>{form.title}</h1>
            {form.excerpt && <p style={{ color: 'var(--muted)', fontSize: '1.1rem', marginBottom: '2rem', fontStyle: 'italic' }}>{form.excerpt}</p>}
            <ReactMarkdownWrapper content={form.content} />
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>Title *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Your post title…" />
            </div>
            <div className="form-group">
              <label>Excerpt</label>
              <input value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="A short teaser sentence…" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                  <option value="">— None —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Cover Image URL</label>
                <input value={form.cover_url} onChange={e => set('cover_url', e.target.value)} placeholder="https://…" />
              </div>
              <div className="form-group">
                <label>Upload Cover Image</label>
                <input type="file" accept="image/*" onChange={e => uploadCover(e.target.files?.[0])} />
                {uploading && <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Uploading…</p>}
                {form.cover_url && <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Cover image set: <a href={form.cover_url} target="_blank" rel="noreferrer">preview</a></p>}
              </div>
            </div>
            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="react, javascript, tips" />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: 'auto' }} />
              <label htmlFor="featured" style={{ margin: 0, textTransform: 'none', fontSize: '0.9rem', letterSpacing: 0 }}>Feature this post on the homepage</label>
            </div>
            <div className="form-group">
              <label>Content (Markdown) *</label>
              <textarea value={form.content} onChange={e => set('content', e.target.value)} placeholder="Write your post in Markdown…" />
            </div>
          </>
        )}
      </div>
    </main>
  );
}

// Lazy-load ReactMarkdown only in preview mode to keep bundle lean
function ReactMarkdownWrapper({ content }) {
  const [MD, setMD] = useState(null);
  useEffect(() => { import('react-markdown').then(m => setMD(() => m.default)); }, []);
  if (!MD) return <p style={{ color: 'var(--muted)' }}>Loading preview…</p>;
  return <MD>{content}</MD>;
}
