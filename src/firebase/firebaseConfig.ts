
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_,
  appId: process.env.REACT_APP_messagingSenderId,
  measurementId: process.env.REACT_APP_measurementId,
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();

auth.languageCode = 'it';
