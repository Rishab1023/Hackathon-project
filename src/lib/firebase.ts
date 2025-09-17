// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "apiKey": "test-api-key",
  "authDomain": "test-project-id.firebaseapp.com",
  "projectId": "test-project-id",
  "storageBucket": "test-project-id.appspot.com",
  "messagingSenderId": "123456789012",
  "appId": "1:123456789012:web:1234567890abcdef123456",
  "measurementId": "G-MEASUREMENTID"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
