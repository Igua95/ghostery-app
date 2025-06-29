#!/bin/bash

# Simple Ghostery App Startup Script

echo "🚀 Starting Ghostery App..."

# Stop any running containers
docker-compose down

# Start database
echo "📦 Starting database..."
docker-compose up -d postgres

# Wait for database
echo "⏳ Waiting for database..."
sleep 10

# Start backend
echo "🔧 Starting backend..."
docker-compose up -d --build backend

# Wait for backend
echo "⏳ Waiting for backend..."
sleep 10

# Run migrations and seed
echo "🗄️  Running migrations and seeding..."
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma generate
docker-compose exec backend npm run db:seed

# Start frontend
echo "📱 Starting frontend..."
docker-compose up -d --build frontend

echo "✅ Done! App running at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:4000"
