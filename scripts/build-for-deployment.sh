#!/bin/bash

# Alternative deployment script that doesn't use Docker
# This script packages the microservices for deployment

set -e

echo "🏗️  Building microservices for production deployment..."

# Create a deployment directory
DEPLOY_DIR="./deployment"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# Build each microservice
SERVICES=("product-service" "cart-service" "order-service" "ai-service" "api-gateway")

for service in "${SERVICES[@]}"; do
    echo "📦 Building $service..."
    cd "microservices/$service"
    
    # Install dependencies and build
    npm ci
    npm run build
    
    # Create deployment package
    mkdir -p "../../$DEPLOY_DIR/$service"
    cp -r dist package.json package-lock.json "../../$DEPLOY_DIR/$service/"
    
    # Install only production dependencies in deployment directory
    cd "../../$DEPLOY_DIR/$service"
    npm ci --only=production
    
    # Go back to root
    cd "../../"
    
    echo "✅ $service built successfully"
done

# Build the Next.js frontend
echo "🌐 Building frontend..."
npm run build

# Copy frontend build to deployment directory
cp -r .next package.json package-lock.json "$DEPLOY_DIR/frontend/"
cd "$DEPLOY_DIR/frontend"
npm ci --only=production
cd "../../"

echo "🎉 All services built successfully!"
echo "📁 Deployment files are in: $DEPLOY_DIR"
echo ""
echo "🚀 To run in production:"
echo "   1. Copy the deployment folder to your server"
echo "   2. For each service, run: npm start"
echo "   3. Make sure to set the correct environment variables"
