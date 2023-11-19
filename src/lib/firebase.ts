// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOtdU_pPSVU_unYklhJmFjsC2onXZD4fo",
  authDomain: "fightboticsfightmanager.firebaseapp.com",
  projectId: "fightboticsfightmanager",
  storageBucket: "fightboticsfightmanager.appspot.com",
  messagingSenderId: "808574577580",
  appId: "1:808574577580:web:3ad8cf456becce654d6809"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig)
export const firestore = getFirestore(app)
export const auth = getAuth(app);
export const database = getDatabase(app);