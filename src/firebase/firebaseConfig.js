// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtzO0pu1rkRJRV0Q9yHtF4yRZdjwfxgbo",
  authDomain: "fmsystem-8b5f5.firebaseapp.com",
  projectId: "fmsystem-8b5f5",
  storageBucket: "fmsystem-8b5f5.firebasestorage.app",
  messagingSenderId: "846272593062",
  appId: "1:846272593062:web:b5e2d9d951e41aaa984867"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);