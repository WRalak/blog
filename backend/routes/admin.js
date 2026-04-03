const router = require('express').Router();
const db = require('../db/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

// All routes require admin
router.use(authenticate, requireAdmin);

// ── GET /api/admin/users
router.get('/users', async (_req, res) => {
  const users = await db.allAsync('SELECT id, name, email, bio, avatar_url, role, created_at FROM users ORDER BY created_at DESC');
  res.json(users);
});

// ── PUT /api/admin/users/:id
router.put('/users/:id', async (req, res) => {
  const { role, bio, avatar_url } = req.body;
  const user = await db.getAsync('SELECT * FROM users WHERE id = ?', req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  await db.runAsync('UPDATE users SET role = ?, bio = ?, avatar_url = ? WHERE id = ?',
    role || user.role, bio !== undefined ? bio : user.bio, avatar_url !== undefined ? avatar_url : user.avatar_url, user.id);
  res.json(await db.getAsync('SELECT id, name, email, bio, avatar_url, role, created_at FROM users WHERE id = ?', user.id));
});

// ── DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  if (req.params.id == req.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });
  await db.runAsync('DELETE FROM users WHERE id = ?', req.params.id);
  res.json({ message: 'User deleted' });
});

// ── GET /api/admin/posts
router.get('/posts', async (req, res) => {
  const { status, author_id } = req.query;
  let where = [];
  let params = [];
  if (status) { where.push('status = ?'); params.push(status); }
  if (author_id) { where.push('author_id = ?'); params.push(author_id); }
  const whereSQL = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const posts = await db.allAsync(`
    SELECT p.*, u.name AS author_name, c.name AS category_name
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    ${whereSQL}
    ORDER BY p.created_at DESC
  `, ...params);
  res.json(posts);
});

// ── PUT /api/admin/posts/:id
router.put('/posts/:id', async (req, res) => {
  const post = await db.getAsync('SELECT * FROM posts WHERE id = ?', req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const { title, excerpt, content, cover_url, category_id, status, featured, tags } = req.body;
  const read_time = content ? Math.max(1, Math.round(content.split(/\s+/).length / 200)) : post.read_time;
  const published_at = status === 'published' && !post.published_at ? new Date().toISOString() : post.published_at;

  await db.runAsync(`
    UPDATE posts SET title=?, excerpt=?, content=?, cover_url=?, category_id=?,
    status=?, featured=?, read_time=?, published_at=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `, title ?? post.title, excerpt ?? post.excerpt, content ?? post.content,
     cover_url ?? post.cover_url, category_id ?? post.category_id,
     status ?? post.status, featured !== undefined ? (featured ? 1 : 0) : post.featured,
     read_time, published_at, post.id);

  if (tags) {
    // Upsert tags
    await db.runAsync('DELETE FROM post_tags WHERE post_id = ?', post.id);
    for (const name of tags) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await db.runAsync('INSERT OR IGNORE INTO tags (name, slug) VALUES (?, ?)', name, slug);
      const tag = await db.getAsync('SELECT id FROM tags WHERE slug = ?', slug);
      await db.runAsync('INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)', post.id, tag.id);
    }
  }

  res.json(await db.getAsync('SELECT * FROM posts WHERE id = ?', post.id));
});

// ── DELETE /api/admin/posts/:id
router.delete('/posts/:id', async (req, res) => {
  await db.runAsync('DELETE FROM posts WHERE id = ?', req.params.id);
  res.json({ message: 'Post deleted' });
});

// ── GET /api/admin/comments
router.get('/comments', async (req, res) => {
  const comments = await db.allAsync(`
    SELECT c.*, p.title AS post_title, p.slug AS post_slug
    FROM comments c
    JOIN posts p ON c.post_id = p.id
    ORDER BY c.created_at DESC
  `);
  res.json(comments);
});

// ── PUT /api/admin/comments/:id
router.put('/comments/:id', async (req, res) => {
  const { approved } = req.body;
  await db.runAsync('UPDATE comments SET approved = ? WHERE id = ?', approved ? 1 : 0, req.params.id);
  res.json({ message: 'Comment updated' });
});

// ── DELETE /api/admin/comments/:id
router.delete('/comments/:id', async (req, res) => {
  await db.runAsync('DELETE FROM comments WHERE id = ?', req.params.id);
  res.json({ message: 'Comment deleted' });
});

// ── GET /api/admin/subscribers
router.get('/subscribers', async (_req, res) => {
  const subs = await db.allAsync('SELECT * FROM subscribers ORDER BY created_at DESC');
  res.json(subs);
});

// ── DELETE /api/admin/subscribers/:id
router.delete('/subscribers/:id', async (req, res) => {
  await db.runAsync('DELETE FROM subscribers WHERE id = ?', req.params.id);
  res.json({ message: 'Subscriber deleted' });
});

module.exports = router;