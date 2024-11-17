import fs from 'fs';
import path from 'path';

interface BackupConfig {
  version: string;
  timestamp: number;
  files: string[];
}

export async function createBackup(version: string) {
  const timestamp = Date.now();
  const backupDir = path.join(process.cwd(), 'backup', `v${version}`);
  
  // Create backup directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Files to backup
  const filesToBackup = [
    'src',
    'server',
    'public',
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    '.env'
  ];

  // Copy files to backup directory
  for (const file of filesToBackup) {
    const sourcePath = path.join(process.cwd(), file);
    const destPath = path.join(backupDir, file);

    if (fs.existsSync(sourcePath)) {
      if (fs.lstatSync(sourcePath).isDirectory()) {
        copyDirectory(sourcePath, destPath);
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  }

  // Save backup configuration
  const config: BackupConfig = {
    version,
    timestamp,
    files: filesToBackup
  };

  fs.writeFileSync(
    path.join(backupDir, 'backup-config.json'),
    JSON.stringify(config, null, 2)
  );

  console.log(`Backup v${version} created successfully at ${new Date(timestamp).toLocaleString()}`);
}

function copyDirectory(source: string, destination: string) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const files = fs.readdirSync(source);

  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}