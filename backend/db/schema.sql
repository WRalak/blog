-- =============================================
--  BLOG DATABASE SCHEMA
-- =============================================

-- Users / Authors
CREATE TABLE IF NOT EXISTS users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,          -- bcrypt hash
  avatar_url  TEXT,
  bio         TEXT,
  role        TEXT NOT NULL DEFAULT 'author',  -- 'admin' | 'author'
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  color       TEXT DEFAULT '#6366f1', -- accent color per category
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Posts
CREATE TABLE IF NOT EXISTS posts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  excerpt       TEXT,
  content       TEXT NOT NULL,          -- markdown
  cover_url     TEXT,
  author_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id   INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  status        TEXT NOT NULL DEFAULT 'draft',  -- 'draft' | 'published'
  featured      INTEGER NOT NULL DEFAULT 0,     -- 0 | 1
  views         INTEGER NOT NULL DEFAULT 0,
  read_time     INTEGER,                         -- estimated minutes
  published_at  DATETIME,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tags
CREATE TABLE IF NOT EXISTS tags (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL UNIQUE,
  slug  TEXT NOT NULL UNIQUE
);

-- Post <-> Tags  (many-to-many)
CREATE TABLE IF NOT EXISTS post_tags (
  post_id  INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id   INTEGER NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id     INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  body        TEXT NOT NULL,
  approved    INTEGER NOT NULL DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT NOT NULL UNIQUE,
  name       TEXT,
  active     INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ---- Seed categories ----
INSERT OR IGNORE INTO categories (name, slug, description, color) VALUES
  ('Personal & Lifestyle', 'personal-lifestyle', 'Life stories, reflections, and everyday moments', '#f59e0b'),
  ('Tech & Coding',        'tech-coding',        'Programming, tools, and the digital world',         '#3b82f6'),
  ('Business',             'business',           'Strategy, entrepreneurship, and professional growth','#10b981'),
  ('Creative Writing',     'creative-writing',   'Stories, poetry, and imaginative pieces',            '#ec4899');
