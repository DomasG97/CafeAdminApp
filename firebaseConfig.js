// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAn4PfjSSQAHJCM6icwQ9zc7uZx8mVK9Tg",
  authDomain: "cafeapp-e2012.firebaseapp.com",
  projectId: "cafeapp-e2012",
  storageBucket: "cafeapp-e2012.appspot.com",
  messagingSenderId: "750345639180",
  appId: "1:750345639180:web:60481b4944e37b8b3ba529",
  databaseURL: "https://cafeapp-e2012-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const Firebase = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(Firebase);

// Initialize Realtime Database
const database = getDatabase(Firebase)

export default Firebase