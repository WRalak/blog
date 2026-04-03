.PHONY: help install dev build start stop clean docker-build docker-up docker-down logs

help:
	@echo "Available commands:"
	@echo "  make install      - Install dependencies for both backend and frontend"
	@echo "  make dev          - Start both backend and frontend in development mode"
	@echo "  make build        - Build frontend for production"
	@echo "  make start        - Start production servers"
	@echo "  make stop         - Stop running servers"
	@echo "  make clean        - Clean up node_modules and build files"
	@echo "  make docker-build - Build Docker images"
	@echo "  make docker-up    - Start services with Docker Compose"
	@echo "  make docker-down  - Stop Docker Compose services"
	@echo "  make logs         - View Docker Compose logs"

install:
	cd backend && npm install
	cd frontend && npm install

dev:
	@echo "Starting backend..."
	cd backend && npm start &
	@echo "Starting frontend..."
	cd frontend && npm run dev &

build:
	cd frontend && npm run build

start:
	cd backend && npm start & \
	cd frontend && npm run preview &

stop:
	@pkill -f "npm start" || true
	@pkill -f "npm run" || true

clean:
	rm -rf backend/node_modules frontend/node_modules
	rm -rf backend/dist frontend/dist
	rm -rf backend/data

docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

logs:
	docker-compose logs -f

docker-stats:
	docker stats

docker-shell-backend:
	docker exec -it blog-api sh

docker-shell-frontend:
	docker exec -it blog-web sh
