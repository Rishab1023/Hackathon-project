// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjtsr2Oa75esvI4_dpjD4Jpx7n5qEIi0A",
  authDomain: "studio-1743997863-78cd3.firebaseapp.com",
  projectId: "studio-1743997863-78cd3",
  storageBucket: "studio-1743997863-78cd3.firebasestorage.app",
  messagingSenderId: "851847706209",
  appId: "1:851847706209:web:b79d2640342af64de11c20",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
