import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
};

// initialize firebase
firebase.initializeApp(firebaseConfig);

// initialize firestore and authentication
export const projectFirestore = firebase.firestore();
export const projectAuth = firebase.auth();
export const projectStorage = firebase.storage();
export const timestamp = firebase.firestore.Timestamp;
