// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from '@firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCYB0XHPoKc9b_1PQv9V2YihIodeCKaqKo",
    authDomain: "library-acd19.firebaseapp.com",
    projectId: "library-acd19",
    storageBucket: "library-acd19.appspot.com",
    messagingSenderId: "792869585990",
    appId: "1:792869585990:web:10f6364119db505380b647",
    measurementId: "G-4BL6RSC3MX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);