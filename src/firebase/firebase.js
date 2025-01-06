// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCEWo7MrkONpYqYeQFC1q7dOPgIZaTDAHM",
    authDomain: "habitflow-1bfc9.firebaseapp.com",
    projectId: "habitflow-1bfc9",
    storageBucket: "habitflow-1bfc9.firebasestorage.app",
    messagingSenderId: "312515111257",
    appId: "1:312515111257:web:514a790933ef8a911ac448",
    measurementId: "G-11GYYBLQ64"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, auth, db, analytics };