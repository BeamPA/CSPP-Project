// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyBTjMlc736LoTIc8NkJ7z-yFwcGKBnGJmA",
   authDomain: "csppproject-5568d.firebaseapp.com",
   projectId: "csppproject-5568d",
   storageBucket: "csppproject-5568d.firebasestorage.app",
   messagingSenderId: "609930927322",
   appId: "1:609930927322:web:c0d7077444519d976459e3",
   measurementId: "G-8Y45PZZFRH"
 };
const app = initializeApp(firebaseConfig);
console.log(app); // Check if the app is initialized correctly
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInWithEmailAndPassword };