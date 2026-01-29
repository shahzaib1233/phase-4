# PowerShell script to validate Docker build process for FastAPI Backend

Write-Host "Starting FastAPI Backend Docker build validation..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "Dockerfile")) {
    Write-Host "ERROR: Dockerfile not found in current directory" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "requirements.txt")) {
    Write-Host "ERROR: requirements.txt not found in current directory" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "main.py")) {
    Write-Host "ERROR: main.py not found in current directory" -ForegroundColor Red
    exit 1
}

Write-Host "✓ All required files found" -ForegroundColor Green

# Check if Docker is available
try {
    $dockerVersion = docker --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "WARNING: Docker is not installed or not in PATH" -ForegroundColor Yellow
        Write-Host "This script can only validate file structure, not build the image" -ForegroundColor Yellow
    } else {
        Write-Host "✓ Docker is available" -ForegroundColor Green

        # Attempt to build the image
        Write-Host "Building Docker image..." -ForegroundColor Cyan
        docker build -t fastapi-backend:test . 2>$null

        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Docker build completed successfully" -ForegroundColor Green

            # Get image size (using PowerShell to parse docker images output)
            $imageInfo = docker images fastapi-backend:test --format "{{.Size}}"
            Write-Host "Image size: $imageInfo" -ForegroundColor Cyan

            # Clean up test image
            docker rmi fastapi-backend:test 2>$null >$null
            Write-Host "✓ Test image cleaned up" -ForegroundColor Green
        } else {
            Write-Host "✗ Docker build failed" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "Docker validation failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Validation completed successfully!" -ForegroundColor Green
Write-Host "Files are properly structured for Docker build." -ForegroundColor Green