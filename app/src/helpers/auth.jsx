import { auth, db } from "./firebase";
import { collection, doc, setDoc, getDoc } from 'firebase/firestore/lite';
import { updateProfile, createUserWithEmailAndPassword,
    signInWithEmailAndPassword, sendPasswordResetEmail, signOut, signInWithPopup ,
    GithubAuthProvider, GoogleAuthProvider, sendEmailVerification } from "firebase/auth";


const loginInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return "ok";
  } catch (err) {
    switch (err.code) {
      case 'auth/wrong-password':
        return "Wrong email or password";
      case 'auth/user-not-found':
        return "User doesn't exist";
      default:
        return "Unknown error";
    }
  }
};

const githubProvider = new GithubAuthProvider();
githubProvider.addScope('read:user');

const loginWithGithub = async () => {
  return await signInWithPopup(auth, githubProvider)
  .then(async (result) => {
    const user = result.user;
    const docUserRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docUserRef);
    
    if (!docSnap.exist) {
      await setDoc(docUserRef, {
        uid: user.uid,
        username: result._tokenResponse.screenName,
        authProvider: 'github',
        layouts: {lg: []},
        email: user.email,
      });
    }

    await updateProfile(user, {
      displayName: result._tokenResponse.screenName
    })
  }).catch((error) => {
    const errorCode = error.code;
    switch (errorCode) {
      case 'auth/account-exists-with-different-credential':
        return "Account exists with different provider";
      case 'auth/cancelled-popup-request':
        return "Login popup cancelled"
      case 'auth/popup-closed-by-user':
        return "Popup closed by user";
      case 'auth/popup-blocked':
        return 'Please autorize popup window';
      default:
        return errorCode;
    }
  });
}

const googleProvider = new GoogleAuthProvider();

const loginWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider)
  .then(async (result) => {
    const user = result.user;
    const docUserRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docUserRef);
    
    if (!docSnap.exist) {
      await setDoc(docUserRef, {
        uid: user.uid,
        username: result._tokenResponse.screenName,
        authProvider: 'google',
        layouts: {lg: []},
        email: user.email,
      });
    }

  }).catch((error) => {
    const errorCode = error.code;
    console.log(error)
    switch (errorCode) {
      case 'auth/account-exists-with-different-credential':
        return "Account exists with different provider";
      case 'auth/cancelled-popup-request':
        return "Login popup cancelled";
      case 'auth/popup-closed-by-user':
        return "Popup closed by user";
      case 'auth/popup-blocked':
        return 'Please autorize popup window';
      default:
        return errorCode;
    }
  });
}

const registerWithEmailAndPassword = async (username, email, password) => {

  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    const newUserRef = doc(collection(db, "users"), user.uid);
    
    updateProfile(user, {
      displayName: username
    })

    setDoc(newUserRef, {
      uid: user.uid,
      username,
      authProvider: "local",
      layouts: {lg: []},
      email,
    });
    sendEmailVerification(auth.currentUser);
    return "ok";
  })
  .catch((error) => {
    const errorCode = error.code;
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return "Email already in use";
      default:
        return errorCode;
    }
  });
};

const resetPasswordWithEmail = async (email) => {
  return sendPasswordResetEmail(auth, email)
  .then(() => {
    return "Mail with password reset link sent !"
  })
  .catch((error) => {
    const errorMessage = error.message;
    console.log(errorMessage);
  });
};

const logout = () => {
  signOut(auth).then(() => {
    return true;
  }).catch((error) => {
    alert(error);
    return false;
  });
};

export {
    loginInWithEmailAndPassword,
    loginWithGithub,
    loginWithGoogle,
    registerWithEmailAndPassword,
    resetPasswordWithEmail,
    logout,
  };