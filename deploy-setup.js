import { execSync } from 'child_process';
import { writeFileSync, chmodSync } from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupDeployment() {
  console.log('🚀 DigitalOcean Deployment Setup\n');

  // Gather information
  const dropletIP = await question('Enter your DigitalOcean Droplet IP: ');
  const sunoApiKey = await question('Enter your Suno API Key: ');
  const openaiApiKey = await question('Enter your OpenAI API Key: ');
  const frontendDomain = await question('Enter your frontend domain (e.g., myapp.com): ');

  // Update .env.production
  const envContent = `NODE_ENV=production
PORT=3001
CORS_ORIGINS=https://${frontendDomain}
SUNO_API_KEY=${sunoApiKey}
OPENAI_API_KEY=${openaiApiKey}`;

  writeFileSync('.env.production', envContent);
  console.log('\n✅ Created .env.production');

  // Update deploy.sh with the correct IP
  const deployScript = `#!/bin/bash
# Deployment configuration
DEPLOY_USER="root"
DEPLOY_HOST="${dropletIP}"
DEPLOY_PATH="/var/www/retoone-backend"

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
for file in "\${FILES_TO_DEPLOY[@]}"; do
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

echo "✅ Deployment complete!"`;

  writeFileSync('deploy.sh', deployScript);
  chmodSync('deploy.sh', '755');
  console.log('✅ Created deploy.sh');

  // Create server setup script
  const serverSetupScript = `#!/bin/bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2
npm install -y pm2@latest -g

# Create deployment directory
mkdir -p /var/www/retoone-backend
chown -R $USER:$USER /var/www/retoone-backend

# Install essential build tools
apt install -y build-essential

echo "✅ Server setup complete!"`;

  writeFileSync('server-setup.sh', serverSetupScript);
  chmodSync('server-setup.sh', '755');
  console.log('✅ Created server-setup.sh');

  console.log('\n📝 Next steps:');
  console.log('1. Run these commands on your local machine:');
  console.log('   ssh-keygen -t rsa -b 4096');
  console.log(`   ssh-copy-id root@${dropletIP}`);
  console.log('\n2. Run this command on your DigitalOcean droplet:');
  console.log('   ./server-setup.sh');
  console.log('\n3. Finally, deploy your application:');
  console.log('   ./deploy.sh');

  rl.close();
}

setupDeployment().catch(console.error);