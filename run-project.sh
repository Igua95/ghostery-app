#!/bin/bash

# Ghostery App - Complete Project Setup Script
# This script will:
# 1. Spin up the database
# 2. Run backend services
# 3. Run Prisma migrations
# 4. Run database seeding
# 5. Start the frontend

set -e  # Exit on any error

echo "🚀 Starting Ghostery App..."
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Cleanup function
cleanup() {
    print_warning "Cleaning up..."
    docker-compose down
    exit 1
}

# Set trap for cleanup on script exit
trap cleanup SIGINT SIGTERM

# Step 1: Clean up any existing containers
print_status "Cleaning up existing containers..."
docker-compose down -v

# Step 2: Start the database first
print_status "Starting PostgreSQL database..."
docker-compose up -d postgres

# Step 3: Wait for database to be ready
print_status "Waiting for database to be ready..."
until docker-compose exec postgres pg_isready -U postgres -d chatapp; do
    print_status "Database not ready yet, waiting 5 seconds..."
    sleep 5
done
print_success "Database is ready!"

# Step 4: Build and start backend service
print_status "Building and starting backend service..."
docker-compose up -d --build backend

# Step 5: Wait for backend to be ready
print_status "Waiting for backend to be ready..."
backend_ready=false
max_attempts=30
attempt=0

while [ $backend_ready = false ] && [ $attempt -lt $max_attempts ]; do
    attempt=$((attempt + 1))
    if docker-compose exec backend curl -f http://localhost:4000 >/dev/null 2>&1; then
        backend_ready=true
        print_success "Backend is ready!"
    else
        print_status "Backend not ready yet, waiting 5 seconds... ($attempt/$max_attempts)"
        sleep 5
    fi
done

if [ $backend_ready = false ]; then
    print_error "Backend failed to start after $max_attempts attempts"
    docker-compose logs backend
    exit 1
fi

# Step 6: Run Prisma migrations
print_status "Running Prisma migrations..."
docker-compose exec backend npx prisma migrate deploy

# Step 7: Generate Prisma client
print_status "Generating Prisma client..."
docker-compose exec backend npx prisma generate

# Step 8: Run database seeding
print_status "Seeding database with initial data..."
docker-compose exec backend npm run db:seed

# Step 9: Start the frontend
print_status "Building and starting frontend..."
docker-compose up -d --build frontend

# Step 10: Show status
print_status "Checking service status..."
docker-compose ps

echo ""
echo "================================="
print_success "🎉 Ghostery App is now running!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:4000"
echo "🗄️  Database: localhost:5432"
echo ""
echo "To stop the application, run:"
echo "  docker-compose down"
echo ""
echo "To view logs, run:"
echo "  docker-compose logs -f [service_name]"
echo ""
echo "Services: frontend, backend, postgres"
echo "================================="
