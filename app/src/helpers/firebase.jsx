import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore/lite';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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

const signInWithEmailAndPassword = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const newUserRef = doc(collection(db, "users"));

    await setDoc(newUserRef, {
      uid: user.uid,
      username,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  auth.signOut();
};

export {
  auth,
  db,
  signInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
};