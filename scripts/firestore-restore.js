
// This script is meant to be run using Node.js with Firebase Admin SDK
// Install dependencies: npm install firebase-admin
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json'); // You need to download this from Firebase console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const BACKUP_PATH = path.join(__dirname, '../backups');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// List available backups
function listBackups() {
  if (!fs.existsSync(BACKUP_PATH)) {
    console.log('No backups found!');
    rl.close();
    return [];
  }
  
  const backups = fs.readdirSync(BACKUP_PATH)
    .filter(item => fs.statSync(path.join(BACKUP_PATH, item)).isDirectory())
    .filter(item => item.startsWith('backup-'));
  
  if (backups.length === 0) {
    console.log('No backups found!');
    rl.close();
    return [];
  }
  
  console.log('Available backups:');
  backups.forEach((backup, index) => {
    console.log(`${index + 1}: ${backup}`);
  });
  
  return backups;
}

async function restoreFromBackup(backupFolder) {
  const fullBackupPath = path.join(BACKUP_PATH, backupFolder);
  
  if (!fs.existsSync(fullBackupPath)) {
    console.log(`Backup folder not found: ${backupFolder}`);
    return;
  }
  
  // Get all JSON files in the backup folder
  const files = fs.readdirSync(fullBackupPath)
    .filter(file => file.endsWith('.json'));
  
  if (files.length === 0) {
    console.log('No backup files found in the selected backup folder.');
    return;
  }
  
  console.log(`Found ${files.length} collections to restore.`);
  
  // Restore each collection
  for (const file of files) {
    const collectionName = file.replace('.json', '');
    const filePath = path.join(fullBackupPath, file);
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const documents = JSON.parse(fileContent);
      
      console.log(`Restoring ${documents.length} documents to collection ${collectionName}...`);
      
      // Use a batch to restore documents
      const batchSize = 500; // Firestore limit
      for (let i = 0; i < documents.length; i += batchSize) {
        const batch = db.batch();
        const chunk = documents.slice(i, i + batchSize);
        
        for (const doc of chunk) {
          const docRef = db.collection(collectionName).doc(doc.id);
          batch.set(docRef, doc.data);
        }
        
        await batch.commit();
        console.log(`Restored batch ${i / batchSize + 1} of ${Math.ceil(documents.length / batchSize)}`);
      }
      
      console.log(`Successfully restored collection: ${collectionName}`);
    } catch (error) {
      console.error(`Error restoring collection ${collectionName}:`, error);
    }
  }
  
  console.log('Restoration completed!');
}

async function main() {
  const backups = listBackups();
  
  if (backups.length === 0) {
    return;
  }
  
  rl.question('Enter the number of the backup to restore: ', async (answer) => {
    const backupIndex = parseInt(answer) - 1;
    
    if (isNaN(backupIndex) || backupIndex < 0 || backupIndex >= backups.length) {
      console.log('Invalid selection!');
      rl.close();
      return;
    }
    
    const selectedBackup = backups[backupIndex];
    
    rl.question(`Are you sure you want to restore from "${selectedBackup}"? This will overwrite existing data! (y/n): `, async (confirmation) => {
      if (confirmation.toLowerCase() === 'y') {
        await restoreFromBackup(selectedBackup);
      } else {
        console.log('Restoration cancelled.');
      }
      rl.close();
    });
  });
}

main().catch(console.error);
