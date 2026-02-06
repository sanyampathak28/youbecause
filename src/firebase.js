import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAYYP7fIfVRVuMn451oO_KGlxTe3SX0zVk",
  authDomain: "project-01-db-a3f53.firebaseapp.com",
  projectId: "project-01-db-a3f53",
  storageBucket: "project-01-db-a3f53.firebasestorage.app",
  messagingSenderId: "646425464031",
  appId: "1:646425464031:web:4ac8e3ec63a3977cd96d6a",
  measurementId: "G-Q4S6N8LD0B"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
