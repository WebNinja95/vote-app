// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNqJECVLl6nDdgYrOrnX9crpMX-iiReWk",
  authDomain: "vote-app-bc85b.firebaseapp.com",
  projectId: "vote-app-bc85b",
  storageBucket: "vote-app-bc85b.firebasestorage.app",
  messagingSenderId: "683684159728",
  appId: "1:683684159728:web:403575137378648bea2235",
  measurementId: "G-2T2S1VVBEV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
