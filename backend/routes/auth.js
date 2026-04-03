const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/db');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, bio } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'name, email, and password are required' });

  const hash = await bcrypt.hash(password, 12);
  const isFirstUser = (await db.getAsync('SELECT COUNT(*) as count FROM users')).count === 0;
  const role = isFirstUser ? 'admin' : 'author';
  try {
    const info = await db.runAsync(
      'INSERT INTO users (name, email, password, bio, role) VALUES (?, ?, ?, ?, ?)',
      name, email, hash, bio || null, role
    );
    const user = await db.getAsync('SELECT id, name, email, role FROM users WHERE id = ?', info.lastID);
    const token = signToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Email already registered' });
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.getAsync('SELECT * FROM users WHERE email = ?', email);
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Invalid credentials' });

  const { password: _, ...safeUser } = user;
  const token = signToken(safeUser);
  res.json({ user: safeUser, token });
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  const user = await db.getAsync('SELECT id, name, email, bio, avatar_url, role, created_at FROM users WHERE id = ?', req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = router;
