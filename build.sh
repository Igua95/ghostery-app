#!/bin/bash

# Build the Docker images for frontend and backend
docker-compose build

# Run the Docker containers for frontend and backend
docker-compose up -d

# Optional: Show logs for both services
docker-compose logs -f