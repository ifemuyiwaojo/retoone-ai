import { mkdir, copyFile, readdir, stat, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function createBackup(version) {
  const timestamp = Date.now();
  const backupDir = join(projectRoot, 'backups', `v${version}`);
  
  // Create backup directory
  await mkdir(backupDir, { recursive: true });

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
    const sourcePath = join(projectRoot, file);
    const destPath = join(backupDir, file);

    if (existsSync(sourcePath)) {
      const stats = await stat(sourcePath);
      if (stats.isDirectory()) {
        await copyDirectory(sourcePath, destPath);
      } else {
        await copyFile(sourcePath, destPath);
      }
    }
  }

  // Save backup configuration
  const config = {
    version,
    timestamp,
    files: filesToBackup
  };

  await writeFile(
    join(backupDir, 'backup-config.json'),
    JSON.stringify(config, null, 2)
  );

  console.log(`Backup v${version} created successfully at ${new Date(timestamp).toLocaleString()}`);
}

async function copyDirectory(source, destination) {
  await mkdir(destination, { recursive: true });
  const files = await readdir(source);

  for (const file of files) {
    const sourcePath = join(source, file);
    const destPath = join(destination, file);

    const stats = await stat(sourcePath);
    if (stats.isDirectory()) {
      await copyDirectory(sourcePath, destPath);
    } else {
      await copyFile(sourcePath, destPath);
    }
  }
}

// Get version from command line arguments
const version = process.argv[2] || 'latest';

// Run backup
createBackup(version).catch(error => {
  console.error('Backup failed:', error);
  process.exit(1);
});