import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLrQRyJf5Eov3hRLRYyGb1fswCIU01t5M",
  authDomain: "himyougtuffglass-89fe8.firebaseapp.com",
  projectId: "himyougtuffglass-89fe8",
  storageBucket: "himyougtuffglass-89fe8.firebasestorage.app",
  messagingSenderId: "1037006327190",
  appId: "1:1037006327190:web:9c0fe23007e92fbc49e1b7",
  measurementId: "G-W0VP1JTLDS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
