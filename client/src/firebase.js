// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-836a3.firebaseapp.com",
  projectId: "mern-estate-836a3",
  storageBucket: "mern-estate-836a3.appspot.com",
  messagingSenderId: "868274338970",
  appId: "1:868274338970:web:7983602f618d9318b87323"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);