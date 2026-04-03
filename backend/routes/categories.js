const router = require('express').Router();
const db = require('../db/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

// ── GET /api/categories
router.get('/', async (_req, res) => {
  const cats = await db.allAsync(`
    SELECT c.*, COUNT(p.id) AS post_count
    FROM categories c
    LEFT JOIN posts p ON p.category_id = c.id AND p.status = 'published'
    GROUP BY c.id ORDER BY c.name
  `);
  res.json(cats);
});

// ── POST /api/categories  (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { name, slug, description, color } = req.body;
  if (!name || !slug) return res.status(400).json({ error: 'name and slug required' });
  try {
    const info = await db.runAsync('INSERT INTO categories (name, slug, description, color) VALUES (?,?,?,?)', name, slug, description, color);
    res.status(201).json(await db.getAsync('SELECT * FROM categories WHERE id = ?', info.lastID));
  } catch (e) {
    res.status(409).json({ error: 'Category already exists' });
  }
});

// ── DELETE /api/categories/:id  (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  await db.runAsync('DELETE FROM categories WHERE id = ?', req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
