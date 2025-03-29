
// Firebase client configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXyWBitU-f2mAkZMN0e4wtLa2Q3hL3xbs",
  authDomain: "signscribe-82.firebaseapp.com",
  projectId: "signscribe-82",
  storageBucket: "signscribe-82.firebasestorage.app",
  messagingSenderId: "422301957279",
  appId: "1:422301957279:web:5a35c25d6182da7f5836aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
