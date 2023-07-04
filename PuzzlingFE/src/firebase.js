// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBxEEFJkvzHfm5Dz40XOgHCeavnBeI8Kio",
    authDomain: "puzzling-bc501.firebaseapp.com",
    projectId: "puzzling-bc501",
    storageBucket: "puzzling-bc501.appspot.com",
    messagingSenderId: "156006550632",
    appId: "1:156006550632:web:105449834c9178c2e97fdd",
    measurementId: "G-B93LXFYLG3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);