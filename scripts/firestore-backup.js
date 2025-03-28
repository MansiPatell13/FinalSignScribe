
// This script is meant to be run using Node.js with Firebase Admin SDK
// Install dependencies: npm install firebase-admin
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json'); // You need to download this from Firebase console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const BACKUP_PATH = path.join(__dirname, '../backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_PATH)) {
  fs.mkdirSync(BACKUP_PATH, { recursive: true });
}

// Create timestamp for the backup
const timestamp = new Date().toISOString().replace(/:/g, '-');
const backupFolder = path.join(BACKUP_PATH, `backup-${timestamp}`);
fs.mkdirSync(backupFolder, { recursive: true });

async function backupCollection(collectionName) {
  console.log(`Backing up collection: ${collectionName}`);
  
  const snapshot = await db.collection(collectionName).get();
  
  if (snapshot.empty) {
    console.log(`No documents in collection ${collectionName}`);
    return;
  }
  
  const documents = [];
  snapshot.forEach(doc => {
    documents.push({
      id: doc.id,
      data: doc.data()
    });
  });
  
  const filePath = path.join(backupFolder, `${collectionName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));
  
  console.log(`Backed up ${documents.length} documents from ${collectionName}`);
}

async function performBackup() {
  try {
    // Get list of all collections
    const collections = await db.listCollections();
    
    // Create a list of collection names
    const collectionNames = collections.map(collection => collection.id);
    
    // Backup each collection
    for (const collectionName of collectionNames) {
      await backupCollection(collectionName);
    }
    
    console.log(`Backup completed successfully: ${backupFolder}`);
  } catch (error) {
    console.error('Error performing backup:', error);
  }
}

performBackup()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
