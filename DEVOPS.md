# DevOps Setup Files

This directory contains all DevOps infrastructure files for the blog application.

## Files Added

### Docker Configuration
- **`Dockerfile`** (backend)
  - Alpine-based Node.js image
  - Production-optimized with npm ci for reproducible builds

- **`Dockerfile`** (frontend)
  - Multi-stage build to minimize image size
  - Builder stage for compilation
  - Serve stage for production runtime

- **`.dockerignore`** (all directories)
  - Excludes unnecessary files from Docker build context
  - Reduces image size and build time

### Docker Compose
- **`docker-compose.yml`**
  - Development configuration
  - Health checks for backend
  - Automatic service dependencies
  - Volume management for data persistence

- **`docker-compose.prod.yml`**
  - Production-optimized configuration
  - Restart policies (always)
  - Log rotation and limits
  - Enhanced health checks

### CI/CD Pipeline
- **`.github/workflows/ci-cd.yml`**
  - Automated testing on PR/push to main
  - Node.js 18.x testing matrix
  - Syntax validation for backend
  - Build verification for frontend
  - Docker image build and test

### Environment Configuration
- **`.env.example`** (backend)
  - Template for backend environment variables
  - Includes JWT secret, database URL, upload settings

- **`.env.example`** (frontend)
  - Template for frontend environment variables
  - API URL and app name configuration

- **`.env.production`**
  - Production environment defaults
  - Secure configuration template

### Project Configuration
- **`.gitignore`**
  - Excludes node_modules, build files, logs
  - Prevents database and upload commits
  - IDE configuration exclusion

- **`.nvmrc`**
  - Specifies Node.js version (18.19.0)
  - Works with nvm/fnm for automatic version switching

### Automation & Scripting
- **`Makefile`**
  - Common development commands
  - Docker management shortcuts
  - Install, dev, build, start, stop targets
  - Docker shell access for debugging

- **`scripts/healthcheck.sh`**
  - Health check script for monitoring
  - Validates backend API and frontend availability
  - Suitable for container orchestration

### Documentation
- **`DEPLOYMENT.md`**
  - Complete deployment guide
  - Local development setup
  - Docker deployment instructions
  - Production deployment checklist
  - Troubleshooting guide
  - Database and upload management

## Quick Start

### Development with Docker
```bash
make docker-build
make docker-up
```

### Without Docker
```bash
make install
make dev
```

### Production Deployment
```bash
cp .env.production .env
# Update JWT_SECRET and other values
docker-compose -f docker-compose.prod.yml up -d
```

## DevOps Features

✅ **Containerization**
- Multi-stage builds for optimized images
- Alpine Linux for small footprint
- Health checks for reliability

✅ **Orchestration**
- Docker Compose for local and production
- Network isolation
- Volume management

✅ **CI/CD**
- GitHub Actions automated testing
- Syntax validation
- Docker image verification

✅ **Environment Management**
- Multi-environment support (.env files)
- Secure secrets handling
- Configuration templates

✅ **Monitoring**
- Health check endpoints
- Log rotation
- Container statistics

✅ **Development Tools**
- Makefile for common tasks
- Shell access to containers
- Debug utilities

✅ **Version Management**
- Node.js version pinning (.nvmrc)
- Lock files for dependency consistency

## File Structure
```
blog/
├── .github/workflows/
│   └── ci-cd.yml                 # GitHub Actions pipeline
├── backend/
│   ├── Dockerfile                # Backend container image
│   ├── .dockerignore             # Docker build exclusions
│   └── .env.example              # Backend config template
├── frontend/
│   ├── Dockerfile                # Frontend container image
│   ├── .dockerignore             # Docker build exclusions
│   └── .env.example              # Frontend config template
├── scripts/
│   └── healthcheck.sh            # Health check utility
├── docker-compose.yml            # Development compose
├── docker-compose.prod.yml       # Production compose
├── .env.production               # Production defaults
├── .gitignore                    # Git exclusions
├── .nvmrc                        # Node version
├── Makefile                      # Automation commands
└── DEPLOYMENT.md                 # Deployment guide
```

## Next Steps

1. Review and customize `DEPLOYMENT.md`
2. Update `.env.production` with your secrets
3. Test with `make docker-build && make docker-up`
4. Deploy to production using chosen platform (AWS, Azure, GCP, DigitalOcean, etc.)
5. Monitor using health check endpoints

## Services

- **Backend API**: Port 4000 (`http://localhost:4000`)
- **Frontend Web**: Port 5173 (`http://localhost:5173`)
- **Database**: SQLite in `/app/data` (Docker volume)
- **Uploads**: `/app/public/uploads` (Docker volume)
