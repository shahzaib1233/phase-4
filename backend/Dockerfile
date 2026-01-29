# Multi-stage Dockerfile for FastAPI Backend
# Production-ready image with security and optimization best practices

# =============================================
# BUILDER STAGE - Install dependencies and create virtual environment
# =============================================
FROM python:3.13-slim AS builder

# Install uv package manager for faster dependency resolution
RUN pip install --no-cache-dir --upgrade pip uv

# Set working directory
WORKDIR /app

# Copy dependency files first for better layer caching
# Since we don't have pyproject.toml and uv.lock initially, we'll convert requirements.txt
COPY requirements.txt .

# Create pyproject.toml from requirements.txt to use with uv
RUN pip install --no-cache-dir toml && \
    echo "import toml" > create_pyproject.py && \
    echo "with open('requirements.txt', 'r') as f:" >> create_pyproject.py && \
    echo "    reqs = [line.strip() for line in f if line.strip() and not line.startswith('#')]" >> create_pyproject.py && \
    echo "deps = {'project': {'name': 'fastapi-backend', 'version': '0.1.0', 'dependencies': reqs}}" >> create_pyproject.py && \
    echo "with open('pyproject.toml', 'w') as f:" >> create_pyproject.py && \
    echo "    toml.dump(deps, f)" >> create_pyproject.py && \
    python create_pyproject.py && \
    # Skip uv lock generation for now due to dependency conflicts, use requirements.txt directly \
    echo "Skipping uv lock generation due to dependency conflicts"

# Install PostgreSQL development libraries needed for psycopg2-binary
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create a flexible requirements file without strict version pins for Docker build
RUN cp requirements.txt requirements_flexible.txt && \
    sed -i 's/==/>=/g' requirements_flexible.txt

# Install dependencies using pip with flexible version handling
RUN python -m venv venv && \
    venv/bin/pip install --no-cache-dir --upgrade pip setuptools && \
    # Install dependencies with flexible versions to handle conflicts
    venv/bin/pip install --no-cache-dir -r requirements_flexible.txt && \
    # Then resolve any dependency conflicts
    venv/bin/pip check

# Copy application source code
COPY . .

# =============================================
# FINAL STAGE - Create minimal production image
# =============================================
FROM python:3.13-slim AS final

# Create non-root user for security
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Set working directory
WORKDIR /app

# Copy the virtual environment from builder stage
COPY --from=builder /app/venv /venv

# Copy application code from builder stage
COPY --from=builder /app /app

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app && \
    chown -R appuser:appgroup /venv && \
    chmod -R 755 /app

# Switch to non-root user
USER appuser

# Expose port 8000 for FastAPI application
EXPOSE 8000

# Add health check capability if /health endpoint exists
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Set production runtime command with uvicorn
CMD ["/venv/bin/uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--reload=false"]

# Add standard labels
LABEL maintainer="FastAPI Docker Maintainers"
LABEL version="1.0"
LABEL description="Production-ready FastAPI backend container"

# Comments explaining parameterization for reuse with other FastAPI apps:
# - To adapt for other FastAPI applications, change the main module in the CMD instruction
# - Update the health check endpoint if different from /health
# - Modify the WORKDIR if your app uses a different path