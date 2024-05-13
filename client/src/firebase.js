// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "waterloo-student-housing.firebaseapp.com",
  projectId: "waterloo-student-housing",
  storageBucket: "waterloo-student-housing.appspot.com",
  messagingSenderId: "951106739324",
  appId: "1:951106739324:web:c152bd99a84be1b1063df9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);