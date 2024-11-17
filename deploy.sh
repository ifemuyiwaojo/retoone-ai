#!/bin/bash
# Deployment configuration
DEPLOY_USER="root"
DEPLOY_HOST="your_droplet_ip"
DEPLOY_PATH="/var/www/retoone-backend"
DEPLOY_BRANCH="main"

# Files to deploy
FILES_TO_DEPLOY=(
  "package.json"
  "package-lock.json"
  "ecosystem.config.js"
  "server"
  ".env.production"
)

echo "🚀 Deploying to DigitalOcean..."

# Create a temporary directory for the files
TEMP_DIR=$(mktemp -d)
echo "📦 Preparing files for deployment..."

# Copy files to temp directory
for file in "${FILES_TO_DEPLOY[@]}"; do
  cp -r "$file" "$TEMP_DIR/"
done

# Rename .env.production to .env on the temp directory
mv "$TEMP_DIR/.env.production" "$TEMP_DIR/.env"

# Deploy to server
echo "📤 Uploading files to server..."
rsync -avz --delete "$TEMP_DIR/" "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/"

# Clean up temp directory
rm -rf "$TEMP_DIR"

# Install dependencies and restart PM2
echo "🔧 Installing dependencies and starting server..."
ssh "$DEPLOY_USER@$DEPLOY_HOST" "cd $DEPLOY_PATH && npm install --production && pm2 restart ecosystem.config.js --env production"

echo "✅ Deployment complete!"