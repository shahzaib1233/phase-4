# FastAPI Backend Docker Container

This repository contains a production-ready FastAPI backend application packaged in a Docker container using multi-stage builds for optimized security and performance.

## Features

- **Multi-stage build**: Separates build dependencies from runtime components
- **Security-focused**: Runs as non-root user with minimal privileges
- **Optimized**: Small image size under 300MB target
- **Kubernetes-ready**: Designed for deployment in Kubernetes environments
- **Dependency management**: Uses uv for faster dependency resolution

## Prerequisites

- Docker 20.10 or higher
- Python 3.13 compatible environment (for local development)

## Build Instructions

To build the Docker image locally:

```bash
# Navigate to the backend directory
cd backend

# Build the Docker image with a tag
docker build -t fastapi-backend:latest .

# Or specify a custom tag
docker build -t fastapi-backend:v1.0.0 .
```

## Run Instructions

To run the container locally:

```bash
# Run with default settings (port 8000)
docker run -p 8000:8000 fastapi-backend:latest

# Run with environment variables
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:password@host:5432/db \
  -e SECRET_KEY=your-secret-key \
  fastapi-backend:latest

# Run in detached mode
docker run -d -p 8000:8000 --name fastapi-app fastapi-backend:latest
```

## Docker Compose (Local Development)

For local development with a complete stack including database:

```bash
# Navigate to the backend directory
cd backend

# Start the services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the services
docker-compose down
```

The Docker Compose setup includes:
- FastAPI backend service (port 8000)
- PostgreSQL database service (port 5432)
- Automatic networking between services

## Environment Variables

The application supports the following environment variables:

- `DATABASE_URL`: PostgreSQL database connection string
- `SECRET_KEY`: Secret key for JWT token signing
- `DEBUG`: Enable/disable debug mode (true/false)
- `LOG_LEVEL`: Logging level (info, debug, warning, error)

## Health Check

The container includes a health check that monitors the `/health` endpoint. The health check runs every 30 seconds with a 10-second timeout.

## Kubernetes Deployment

For Kubernetes deployment, refer to the `k8s-deployment.yaml` manifest in this repository.

## Image Details

- **Base image**: python:3.13-slim
- **Exposed port**: 8000
- **User**: Non-root user (UID 1000)
- **Working directory**: /app
- **Runtime**: uvicorn with 2 workers

## Dockerfile Structure

This image uses a multi-stage build process:

1. **Builder stage**: Installs dependencies and creates virtual environment
2. **Final stage**: Contains only runtime components with optimized security

## Adapting for Other FastAPI Applications

To adapt this Dockerfile for other FastAPI applications:

1. Change the main module in the CMD instruction (currently `main:app`)
2. Update the health check endpoint if different from `/health`
3. Modify the WORKDIR if your app uses a different path
4. Adjust dependencies in requirements.txt as needed

## Validation Scripts

This repository includes validation scripts to test the Docker build process:

- `test-docker-build.sh` - Bash script for Linux/macOS
- `test-docker-build.ps1` - PowerShell script for Windows

These scripts validate that:
- Required files are present
- Docker build completes successfully
- Image size is within target limits
- Test image is cleaned up after validation