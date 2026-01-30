#!/bin/bash

# Build script for Render deployment
echo "Starting build process..."

# Install and build frontend
echo "Building frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install --only=production
cd ..

echo "Build completed successfully!"