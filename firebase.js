import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDhvl-1OaLVQe7BS745YJRm6719Zxkk-cc",
  authDomain: "languagelearning-5bf8f.firebaseapp.com",
  projectId: "languagelearning-5bf8f",
  storageBucket: "languagelearning-5bf8f.appspot.com",
  messagingSenderId: "785099551174",
  appId: "1:785099551174:web:27cff8f8dd4319fa2b82c7",
  measurementId: "G-K9BL52QC4M"
}

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app);
