// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQdutlsJ-DQIX0neF2e-k3P_G37e4OXE8",
  authDomain: "atob-advancedmobile.firebaseapp.com",
  projectId: "atob-advancedmobile",
  storageBucket: "atob-advancedmobile.firebasestorage.app",
  messagingSenderId: "996836397335",
  appId: "1:996836397335:web:5aa513165427e76bf1e752",
  measurementId: "G-ZEFYPDKNJJ"
};

// Initialize Firebase
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
