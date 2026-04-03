# Deployment Guide

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
make install
```

### Run Development Servers
```bash
make dev
```

Backend: http://localhost:4000
Frontend: http://localhost:5173

## Docker Deployment

### Prerequisites
- Docker
- Docker Compose

### Build Images
```bash
make docker-build
```

### Start Services
```bash
make docker-up
```

Services will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### View Logs
```bash
make logs
```

### Stop Services
```bash
make docker-down
```

## Production Deployment

### Build Frontend for Production
```bash
cd frontend
npm run build
```

### Environment Configuration
1. Copy `.env.production` to `.env`
2. Update `JWT_SECRET` with a secure random string
3. Set `FRONTEND_URL` to your production domain

### Docker Production Build
```bash
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
```

### Health Checks
Backend includes a health check endpoint:
```
GET /api/health
```

Frontend automatically redirects to backend API at `VITE_API_URL`.

## Database

SQLite database is stored in:
- Local: `backend/data/blog.db`
- Docker: Volume mounted to persist data

### Reset Database
```bash
rm backend/data/blog.db
```

The schema will be recreated on next start.

## File Uploads

Uploaded images are stored in:
- Local: `backend/public/uploads/`
- Docker: Volume mounted to persist uploads

Access uploads at: `http://localhost:4000/uploads/{filename}`

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port
lsof -i :4000
kill -9 <PID>
```

### Database Locked
- Stop all running instances
- Delete `.db-shm` and `.db-wal` files if present
- Restart

### Docker Issues
```bash
# Rebuild without cache
docker-compose build --no-cache

# Clean up
docker system prune
```

## Continuous Integration

GitHub Actions automatically:
- Runs tests on PR/push to main
- Builds and tests Docker images
- Validates syntax and dependencies

See `.github/workflows/ci-cd.yml` for details.
