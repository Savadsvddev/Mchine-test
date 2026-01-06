// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDK30IkfDv_70ksHnm23u6DBiGDTxSdRfc",
  authDomain: "howincloud-test.firebaseapp.com",
  projectId: "howincloud-test",
  storageBucket: "howincloud-test.firebasestorage.app",
  messagingSenderId: "1030689110480",
  appId: "1:1030689110480:web:d07c4217a246af3f46a1d5",
  measurementId: "G-FWW2KNS45W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const firestore = getFirestore(app);
