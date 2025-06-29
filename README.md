# Ghostery Application

This project is a real-time chat application called Ghostery built with React, TypeScript, Tailwind CSS for the frontend, and Node.js with tRPC for the backend. The application is containerized using Docker and orchestrated with Docker Compose, with PostgreSQL as the database.

## Getting Started

### Prerequisites

- Docker
- Docker Compose
- Node.js (for local development)

### Setup

1. Clone the repository:

   ```bash
   git clone git@github.com:Igua95/ghostery-app.git
   cd ghostery-app
   ```

2. **Complete Setup (Recommended)**: Use the comprehensive setup script that handles everything:

   ```bash
   ./run-project.sh
   ```

   This script will:
   - Start the PostgreSQL database
   - Build and start the backend service
   - Run Prisma migrations and generate the client
   - Seed the database with initial data
   - Start the frontend application

3. **Quick Start**: For a simpler startup (after initial setup):

   ```bash
   ./start.sh
   ```

4. **Using npm scripts** (alternative):

   ```bash
   npm run setup    # Complete setup (runs run-project.sh)
   npm run build    # Build and start all services
   npm run start    # Start services in detached mode
   npm run stop     # Stop all services
   ```

### Usage

After running the setup, the application will be available at:

- **Frontend**: `http://localhost:3000` - React application with Tailwind CSS
- **Backend**: `http://localhost:4000` - Node.js API with tRPC
- **Database**: `localhost:5432` - PostgreSQL database

#### Test Credentials

For testing the application, you can use the following pre-seeded user accounts (see `backend/prisma/seed.ts` for reference):

- **Username**: `heisenberg` | **Password**: `password`
- **Username**: `jessepinkman` | **Password**: `password`
- **Username**: `saulgoodman` | **Password**: `password`
- **Username**: `mikeherman` | **Password**: `password`

These test users are automatically created when the database is seeded during the setup process.

### Available Scripts

- `./run-project.sh` - Complete setup and startup (recommended for first run)
- `./start.sh` - Quick startup for subsequent runs
- `./build.sh` - Simple Docker Compose build and start with logs
- `docker-compose down` - Stop all services
- `docker-compose logs -f [service_name]` - View logs for specific service

### Development

For local development without Docker:

#### Prerequisites for Local Development

1. **Start PostgreSQL Database**: Even for local development, you'll need the PostgreSQL container running:

```bash
docker-compose up -d postgres
```

2. **Environment Configuration**: Copy the environment example file in the backend:

```bash
cd backend
cp .env.example .env
```

The `.env` file contains the database connection string and other configuration needed for local development.

#### Frontend Development
Navigate to the `frontend` directory and run:

```bash
cd frontend
npm install
npm run dev
```

#### Backend Development
Navigate to the `backend` directory and run:

```bash
cd backend
npm install
npm run dev
```

**Note**: Make sure the PostgreSQL container is running before starting the backend for local development.

#### Database Operations
To work with the database:

```bash
# Run migrations
docker-compose exec backend npx prisma migrate dev

# Generate Prisma client
docker-compose exec backend npx prisma generate

# Seed the database
docker-compose exec backend npm run db:seed

# Open Prisma Studio
docker-compose exec backend npx prisma studio
```

### Troubleshooting

- If services fail to start, check logs: `docker-compose logs [service_name]`
- To completely reset: `docker-compose down -v` (removes volumes)
- Ensure ports 3000, 4000, and 5432 are available
- For database connection issues, wait for PostgreSQL to fully initialize

### Architecture

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + TypeScript + tRPC + Prisma
- **Database**: PostgreSQL
- **WebSocket**: Real-time messaging support
- **Containerization**: Docker + Docker Compose
