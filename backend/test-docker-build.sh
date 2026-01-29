#!/bin/bash
# Test script to validate Docker build process for FastAPI Backend

set -e  # Exit on any error

echo "Starting FastAPI Backend Docker build validation..."

# Check if we're in the right directory
if [ ! -f "Dockerfile" ]; then
    echo "ERROR: Dockerfile not found in current directory"
    exit 1
fi

if [ ! -f "requirements.txt" ]; then
    echo "ERROR: requirements.txt not found in current directory"
    exit 1
fi

if [ ! -f "main.py" ]; then
    echo "ERROR: main.py not found in current directory"
    exit 1
fi

echo "✓ All required files found"

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "WARNING: Docker is not installed or not in PATH"
    echo "This script can only validate file structure, not build the image"
else
    echo "✓ Docker is available"

    # Attempt to build the image
    echo "Building Docker image..."
    docker build -t fastapi-backend:test .

    if [ $? -eq 0 ]; then
        echo "✓ Docker build completed successfully"

        # Get image size
        IMAGE_SIZE=$(docker inspect --format='{{.Size}}' fastapi-backend:test)
        # Convert bytes to MB for easier reading
        IMAGE_SIZE_MB=$((IMAGE_SIZE / 1024 / 1024))
        echo "Image size: ${IMAGE_SIZE_MB}MB"

        if [ $IMAGE_SIZE_MB -lt 300 ]; then
            echo "✓ Image size is under 300MB target (${IMAGE_SIZE_MB}MB)"
        else
            echo "⚠️  Image size exceeds 300MB target (${IMAGE_SIZE_MB}MB)"
        fi

        # Clean up test image
        docker rmi fastapi-backend:test > /dev/null 2>&1
        echo "✓ Test image cleaned up"
    else
        echo "✗ Docker build failed"
        exit 1
    fi
fi

echo ""
echo "Validation completed successfully!"
echo "Files are properly structured for Docker build."