import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCncSMOCoR_Sq8S93lgxm98oUWCbiUSVz4",
  authDomain: "dashboard-3cabc.firebaseapp.com",
  projectId: "dashboard-3cabc",
  storageBucket: "dashboard-3cabc.appspot.com",
  messagingSenderId: "1084377023586",
  appId: "1:1084377023586:web:2ed0bd61efd48cbb767d3b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export {
  auth,
  db,
};