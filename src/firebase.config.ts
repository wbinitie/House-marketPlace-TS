// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBb1wYMBpcepvyKwLnfL--Kxv0vYwZquEY",
  authDomain: "house-marketplace-app-e8272.firebaseapp.com",
  projectId: "house-marketplace-app-e8272",
  storageBucket: "house-marketplace-app-e8272.appspot.com",
  messagingSenderId: "975359094667",
  appId: "1:975359094667:web:496c965c790dd672c7898e",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
