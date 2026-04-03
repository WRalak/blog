const router = require('express').Router();
const db = require('../db/db');
const { authenticate } = require('../middleware/auth');

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function calcReadTime(content) {
  return Math.max(1, Math.round(content.split(/\s+/).length / 200));
}

// ── GET /api/posts  (public, paginated)
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, category, tag, status = 'published', featured, search } = req.query;
  const offset = (page - 1) * limit;

  let where = ['p.status = ?'];
  let params = [status];

  if (category) { where.push('c.slug = ?'); params.push(category); }
  if (featured)  { where.push('p.featured = 1'); }
  if (search)    { where.push('(p.title LIKE ? OR p.excerpt LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
  if (tag) {
    where.push('EXISTS (SELECT 1 FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.post_id = p.id AND t.slug = ?)');
    params.push(tag);
  }

  const whereSQL = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const posts = await db.allAsync(`
    SELECT p.id, p.title, p.slug, p.excerpt, p.cover_url, p.views, p.read_time,
           p.featured, p.published_at, p.created_at,
           u.name AS author_name, u.avatar_url AS author_avatar,
           c.name AS category_name, c.slug AS category_slug, c.color AS category_color
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    ${whereSQL}
    ORDER BY p.published_at DESC, p.created_at DESC
    LIMIT ? OFFSET ?
  `, ...params, Number(limit), Number(offset));

  const { total } = await db.getAsync(`
    SELECT COUNT(*) AS total FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id ${whereSQL}
  `, ...params);

  res.json({ posts, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// ── GET /api/posts/:slug  (public)
router.get('/:slug', async (req, res) => {
  const post = await db.getAsync(`
    SELECT p.*, u.name AS author_name, u.bio AS author_bio, u.avatar_url AS author_avatar,
           c.name AS category_name, c.slug AS category_slug, c.color AS category_color
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ?
  `, req.params.slug);

  if (!post) return res.status(404).json({ error: 'Post not found' });

  // Tags
  post.tags = await db.allAsync(`
    SELECT t.name, t.slug FROM tags t
    JOIN post_tags pt ON pt.tag_id = t.id WHERE pt.post_id = ?
  `, post.id);

  // Increment views
  await db.runAsync('UPDATE posts SET views = views + 1 WHERE id = ?', post.id);

  res.json(post);
});

// ── POST /api/posts  (auth required)
router.post('/', authenticate, async (req, res) => {
  const { title, excerpt, content, cover_url, category_id, status, featured, tags } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'title and content are required' });

  const slug = slugify(title) + '-' + Date.now();
  const read_time = calcReadTime(content);
  const published_at = status === 'published' ? new Date().toISOString() : null;

  const info = await db.runAsync(`
    INSERT INTO posts (title, slug, excerpt, content, cover_url, author_id, category_id, status, featured, read_time, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, title, slug, excerpt || null, content, cover_url || null, req.user.id,
     category_id || null, status || 'draft', featured ? 1 : 0, read_time, published_at);

  if (tags?.length) await upsertTags(info.lastID, tags);

  const post = await db.getAsync('SELECT * FROM posts WHERE id = ?', info.lastID);
  res.status(201).json(post);
});

// ── PUT /api/posts/:id  (auth, own post or admin)
router.put('/:id', authenticate, async (req, res) => {
  const post = await db.getAsync('SELECT * FROM posts WHERE id = ?', req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.author_id !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Forbidden' });

  const { title, excerpt, content, cover_url, category_id, status, featured, tags } = req.body;
  const read_time = content ? calcReadTime(content) : post.read_time;
  const published_at = status === 'published' && !post.published_at
    ? new Date().toISOString() : post.published_at;

  await db.runAsync(`
    UPDATE posts SET title=?, excerpt=?, content=?, cover_url=?, category_id=?,
    status=?, featured=?, read_time=?, published_at=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `, title ?? post.title, excerpt ?? post.excerpt, content ?? post.content,
     cover_url ?? post.cover_url, category_id ?? post.category_id,
     status ?? post.status, featured !== undefined ? (featured ? 1 : 0) : post.featured,
     read_time, published_at, post.id);

  if (tags) await upsertTags(post.id, tags);

  res.json(await db.getAsync('SELECT * FROM posts WHERE id = ?', post.id));
});

// ── DELETE /api/posts/:id  (auth, own or admin)
router.delete('/:id', authenticate, async (req, res) => {
  const post = await db.getAsync('SELECT * FROM posts WHERE id = ?', req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.author_id !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Forbidden' });

  await db.runAsync('DELETE FROM posts WHERE id = ?', post.id);
  res.json({ message: 'Post deleted' });
});

// ── Helper: upsert tags and link to post
async function upsertTags(postId, tags) {
  await db.runAsync('DELETE FROM post_tags WHERE post_id = ?', postId);
  for (const name of tags) {
    const slug = slugify(name);
    await db.runAsync('INSERT OR IGNORE INTO tags (name, slug) VALUES (?, ?)', name, slug);
    const tag = await db.getAsync('SELECT id FROM tags WHERE slug = ?', slug);
    await db.runAsync('INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)', postId, tag.id);
  }
}

module.exports = router;
