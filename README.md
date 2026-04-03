# 📝 TheInkwell — Full-Stack Blog

A modern, production-ready blog platform with role-based admin features, image uploads, and comprehensive DevOps infrastructure.

Built with **Node.js + Express** (backend), **React + Vite** (frontend), and **SQLite** (zero-config database).

---

## ✨ Features

### Core Blogging
- ✍️ **Write Posts** — Markdown editor with live preview
- 📚 **Organize** — Categories, tags, and featured posts
- 🖼️ **Image Uploads** — Drag-and-drop cover image uploads
- 📊 **Statistics** — View count tracking and read time estimation
- 🔍 **Search** — Full-text search across posts

### Admin Dashboard
- 👥 **User Management** — Create, edit, promote users to admin
- 📄 **Content Moderation** — Manage all posts and comments
- 💬 **Comment Approval** — Review and approve user comments
- 📧 **Subscriber Management** — Track newsletter subscribers
- 🔐 **Role-Based Access** — Secure admin panel (admin only)

### Authentication & Security
- 🔑 **JWT Authentication** — Secure token-based auth
- 🚀 **Role-Based Access Control** — Admin and author roles
- 🛡️ **Helmet.js** — Security headers on all responses
- 🔒 **bcryptjs** — Password hashing with salt

### DevOps & Deployment
- 🐳 **Docker** — Containerized backend and frontend
- 🐙 **Docker Compose** — Multi-container orchestration
- 🔄 **CI/CD** — GitHub Actions automated testing and builds
- 📊 **Health Checks** — Monitoring endpoints
- 📈 **Logging** — Log rotation and container stats

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (optional)
- npm or yarn

### Development (Local)

```bash
# Install dependencies
make install

# Start both servers
make dev

# Frontend:  http://localhost:5173
# Backend:   http://localhost:4000
```

### Development (Docker)

```bash
# Build images
make docker-build

# Start services
make docker-up

# View logs
make logs

# Stop services
make docker-down
```

### First Admin User
The first user to register automatically becomes an admin.

1. Go to http://localhost:5173
2. Click "Sign in" → "Don't have an account? Register"
3. Fill in your details and register
4. You're now an admin! Access the Admin panel via the "Admin" link in navigation

---

## 📁 Project Structure

```
blog/
├── backend/                    # Express API server
│   ├── routes/
│   │   ├── auth.js            # Authentication endpoints
│   │   ├── posts.js           # Post CRUD operations
│   │   ├── categories.js      # Category management
│   │   ├── admin.js           # Admin-only endpoints
│   │   └── upload.js          # File upload handling
│   ├── middleware/
│   │   └── auth.js            # JWT verification & role checks
│   ├── db/
│   │   ├── db.js              # SQLite connection & promisification
│   │   └── schema.sql         # Database schema
│   ├── Dockerfile             # Backend container config
│   └── server.js              # Express app entry point
│
├── frontend/                   # React/Vite app
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components (Navbar, Footer, etc.)
│   │   ├── hooks/             # useAuth context hook
│   │   ├── styles/            # Global CSS
│   │   ├── api.js             # API client wrapper
│   │   ├── App.jsx            # Router setup
│   │   └── main.jsx           # Entry point
│   ├── Dockerfile             # Frontend container config
│   └── vite.config.js         # Vite configuration
│
├── docker-compose.yml         # Development orchestration
├── docker-compose.prod.yml    # Production orchestration
├── .github/workflows/         # GitHub Actions CI/CD
├── scripts/                   # Utility scripts
├── Makefile                   # Development commands
└── DEPLOYMENT.md              # Complete deployment guide
```

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend** | Node.js + Express | REST API server |
| **Frontend** | React + Vite | UI framework & build tool |
| **Database** | SQLite | Zero-config relational DB |
| **Auth** | JWT + bcryptjs | Secure authentication |
| **File Upload** | Multer | Image upload handling |
| **Styling** | CSS Grid/Flexbox | Responsive layout |
| **Markdown** | React-Markdown | Post content rendering |
| **Containerization** | Docker | Application packaging |
| **Orchestration** | Docker Compose | Multi-container management |
| **CI/CD** | GitHub Actions | Automated testing & builds |

---

## 📚 API Documentation

### Authentication
```
POST   /api/auth/register    - Create new user
POST   /api/auth/login       - Login with credentials
GET    /api/auth/me          - Get current user
```

### Posts
```
GET    /api/posts            - List posts (paginated, public)
GET    /api/posts/:slug      - Get single post
POST   /api/posts            - Create post (authenticated)
PUT    /api/posts/:id        - Update post (own or admin)
DELETE /api/posts/:id        - Delete post (own or admin)
```

### Categories
```
GET    /api/categories       - List all categories
POST   /api/categories       - Create category (admin only)
DELETE /api/categories/:id   - Delete category (admin only)
```

### Admin
```
GET    /api/admin/users      - List all users
PUT    /api/admin/users/:id  - Update user
DELETE /api/admin/users/:id  - Delete user

GET    /api/admin/posts      - List all posts (admin)
PUT    /api/admin/posts/:id  - Update any post
DELETE /api/admin/posts/:id  - Delete any post

GET    /api/admin/comments   - List all comments
PUT    /api/admin/comments/:id - Approve/reject comment
DELETE /api/admin/comments/:id - Delete comment

GET    /api/admin/subscribers - List subscribers
DELETE /api/admin/subscribers/:id - Remove subscriber
```

### Uploads
```
POST   /api/uploads          - Upload image file
```

---

## 🔒 Database Schema

### Users
```sql
id, name, email, password, avatar_url, bio, role, created_at
```

### Posts
```sql
id, title, slug, excerpt, content, cover_url, author_id, category_id,
status (draft/published), featured, views, read_time, published_at, 
created_at, updated_at
```

### Categories
```sql
id, name, slug, description, color, created_at
```

### Tags & Post-Tags
```sql
tags: id, name, slug
post_tags: post_id, tag_id (many-to-many)
```

### Comments
```sql
id, post_id, author_name, author_email, body, approved, created_at
```

### Subscribers
```sql
id, email, name, active, created_at
```

---

## 🚢 Deployment

### Local Docker
```bash
docker-compose up -d
```

### Production Deployment
```bash
# Set up environment
cp .env.production .env
# Update JWT_SECRET and FRONTEND_URL

# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# Verify health
curl http://localhost:4000/api/health
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions including:
- Production environment setup
- Security best practices
- Database backups
- Monitoring and logging
- Troubleshooting guide

See [DEVOPS.md](DEVOPS.md) for DevOps infrastructure details:
- Docker configuration
- CI/CD pipeline setup
- Container orchestration
- Development automation

---

## 📋 Environment Variables

### Backend (`.env`)
```
NODE_ENV=production
PORT=4000
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
DATABASE_URL=./data/blog.db
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=TheInkwell
```

---

## ☁️ AWS Deploy (Quick)

### Prerequisites
- AWS account
- ECR repositories: `blog-api`, `blog-web`
- ECS cluster (Fargate)
- RDS PostgreSQL/MySQL (or a database of your choice)
- S3 bucket for uploads
- IAM roles for ECS tasks and GitHub deploy

### 1. GitHub Secrets
- `AWS_ROLE_ARN`
- `AWS_REGION` (e.g. us-east-1)
- `AWS_ACCOUNT_ID`
- `JWT_SECRET`
- `DATABASE_URL`
- `FRONTEND_URL`
- `AWS_S3_BUCKET`

### 2. Workflow trigger
Push to `main` runs `.github/workflows/aws-ecs-deploy.yml`:
- build/push backend to ECR
- build/push frontend to ECR
- force ECS update for services

### 3. Backend env for ECS task
- `NODE_ENV=production`
- `PORT=4000`
- `DATABASE_URL=${{ secrets.DATABASE_URL }}`
- `JWT_SECRET=${{ secrets.JWT_SECRET }}`
- `FRONTEND_URL=${{ secrets.FRONTEND_URL }}`
- `AWS_S3_BUCKET=${{ secrets.AWS_S3_BUCKET }}`

### 4. Frontend env for ECS task
- `NODE_ENV=production`
- `VITE_API_URL=https://<your-backend-url>`

### 5. Health Check
- Backend: `GET /api/health`

### 6. S3 upload logic
Backend route `/api/uploads` uses S3 when `AWS_S3_BUCKET` is set, else local storage.

## 🛠️ Available Commands

```bash
make install           # Install dependencies
make dev              # Start dev servers
make build            # Build frontend for production
make clean            # Remove node_modules and builds

make docker-build     # Build Docker images
make docker-up        # Start Docker services
make docker-down      # Stop Docker services
make logs             # View Docker logs
make docker-shell-backend  # SSH into backend container
```

---

## 🧪 Testing

### Backend Syntax Check
```bash
cd backend
node -c server.js
```

### Frontend Build Verification
```bash
cd frontend
npm run build
```

### Health Check
```bash
./scripts/healthcheck.sh
```

---

## 📦 Production Checklist

- [ ] Update `JWT_SECRET` to a secure random string
- [ ] Set `FRONTEND_URL` to your domain
- [ ] Configure `.env.production` with production values
- [ ] Build Docker images: `docker-compose build`
- [ ] Create database backup strategy
- [ ] Set up log aggregation
- [ ] Configure SSL/HTTPS (via reverse proxy like nginx)
- [ ] Set up monitoring and alerts
- [ ] Test health check endpoints
- [ ] Document deployment process

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Push to GitHub
4. Create a Pull Request
5. GitHub Actions will run automated tests

---

## 📖 Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) — Complete deployment & operations guide
- [DEVOPS.md](DEVOPS.md) — DevOps infrastructure & containerization
- [API Endpoints](#api-documentation) — REST API reference

---

## 📄 License

MIT License — feel free to use this project for personal or commercial purposes.

---

## 🙋 Support

For issues, questions, or suggestions:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Include steps to reproduce for bugs

---

## 🎯 Future Roadmap

- [ ] Email notifications for comments
- [ ] Social sharing buttons
- [ ] Dark mode toggle
- [ ] Advanced search with filters
- [ ] Author profiles & bio pages
- [ ] Related posts recommendations
- [ ] Reading time tracking per user
- [ ] Export posts as PDF
- [ ] Multi-language support
- [ ] Analytics dashboard

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Backend   | Node.js, Express, better-sqlite3                |
| Auth      | JWT (jsonwebtoken) + bcryptjs                   |
| Frontend  | React 18, React Router v6, Vite                 |
| Styling   | Vanilla CSS (editorial magazine aesthetic)      |
| Database  | SQLite via better-sqlite3                        |

---

## Project Structure

```
blog/
├── backend/
│   ├── db/
│   │   ├── db.js          # DB connection & init
│   │   └── schema.sql     # Tables + seed categories
│   ├── middleware/
│   │   └── auth.js        # JWT authenticate & requireAdmin
│   ├── routes/
│   │   ├── auth.js        # /api/auth  (register, login, me)
│   │   ├── posts.js       # /api/posts (full CRUD)
│   │   └── categories.js  # /api/categories
│   ├── server.js          # Express entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api.js              # Fetch wrapper
    │   ├── App.jsx             # Router + layout
    │   ├── hooks/
    │   │   └── useAuth.jsx     # Auth context
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── PostCard.jsx
    │   │   └── Footer.jsx
    │   ├── pages/
    │   │   ├── Home.jsx        # Hero + recent grid
    │   │   ├── PostList.jsx    # Filterable archive + pagination
    │   │   ├── PostDetail.jsx  # Full article view
    │   │   ├── Write.jsx       # Markdown editor + preview
    │   │   └── Login.jsx       # Sign in / register
    │   └── styles/
    │       └── global.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env          # Edit JWT_SECRET!
npm install
npm run dev                   # → http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                   # → http://localhost:5173
```

---

## API Reference

### Auth
| Method | Endpoint             | Auth | Description        |
|--------|----------------------|------|--------------------|
| POST   | /api/auth/register   | –    | Create account     |
| POST   | /api/auth/login      | –    | Get JWT token      |
| GET    | /api/auth/me         | ✅   | Current user       |

### Posts
| Method | Endpoint             | Auth     | Description            |
|--------|----------------------|----------|------------------------|
| GET    | /api/posts           | –        | List (paginated)       |
| GET    | /api/posts/:slug     | –        | Single post            |
| POST   | /api/posts           | ✅       | Create post            |
| PUT    | /api/posts/:id       | ✅ owner | Update post            |
| DELETE | /api/posts/:id       | ✅ owner | Delete post            |

**Query params for GET /api/posts:**
- `page`, `limit` — pagination
- `category` — filter by category slug
- `tag` — filter by tag slug
- `search` — full-text search on title/excerpt
- `featured=1` — only featured posts
- `status` — `published` (default) or `draft`

### Categories
| Method | Endpoint             | Auth    | Description       |
|--------|----------------------|---------|-------------------|
| GET    | /api/categories      | –       | List all          |
| POST   | /api/categories      | ✅ admin | Create            |
| DELETE | /api/categories/:id  | ✅ admin | Delete            |

---

## Database Schema

- **users** — authors with bcrypt passwords, roles (author/admin)
- **posts** — title, slug, content (Markdown), cover_url, status, featured, views, read_time
- **categories** — name, slug, description, accent color (4 pre-seeded)
- **tags** + **post_tags** — many-to-many tag system
- **comments** — threaded comments with moderation flag
- **subscribers** — newsletter email list

---

## Deploying

**Backend:** Deploy to Railway, Render, or any Node host. Set `JWT_SECRET` and `FRONTEND_URL` env vars.

**Frontend:** `npm run build` → deploy `dist/` to Vercel, Netlify, or Cloudflare Pages. Set `VITE_API_URL` if your API is on a different domain.

**Database:** SQLite file lives in `backend/data/blog.db` — back it up or migrate to PostgreSQL using the same schema with minor adjustments.
#   b l o g 
 
 