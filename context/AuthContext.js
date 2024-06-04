import React, { useContext, useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, collection, setDoc, addDoc } from "firebase/firestore";

export const AuthContext = React.createContext();

export function useAuth() {

  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [createdUser, setCreatedUser] = useState(false);

  async function signup(email, password, formData) {
    try {
      setCreatedUser(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;


      // Make sure user is not admin by default
      if (formData){
        await setDoc(doc(db, "users", user.uid), formData)
      } else{
        await setDoc(doc(db, "users", user.uid), {
          email,
          isAdmin: false

        });
        return await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      }

    } catch (error) {
      console.error(error);
    }
  }

  async function  login(email, password) {

    setLoginEmail(email);
    setLoginPassword(password);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      setLoading(false);
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setIsAdmin(userDoc.data().isAdmin);
        localStorage.setItem('admin', JSON.stringify(userDoc.data().isAdmin));
      }
    } else {
      setCurrentUser(null);
      localStorage.removeItem('user');
      setLoading(false);
      setIsAdmin(false);
      localStorage.removeItem('admin');
    }
   return userCredential
  }

  async function logout() {
    const variable = await signOut(auth);
    setCurrentUser(null);
    localStorage.removeItem('user');
    setLoading(false);
    setIsAdmin(false);
    localStorage.removeItem('admin');
    return variable
  }
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAdmin(JSON.parse(localStorage.getItem('admin')));
    }
  }, []);
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     console.log("new user")
  //     if(createdUser){
  //       return
  //     }
  //     if (user) {
  //       setCurrentUser(user);
  //       setLoading(false);
  //       const userDoc = await getDoc(doc(db, "users", user.uid));
  //       if (userDoc.exists()) {
  //         setIsAdmin(userDoc.data().isAdmin);
  //       }
  //     }
  //   });
  //   return unsubscribe;
  // }, []);
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     console.log("new user")
  //     if(createdUser){
  //       return
  //     }
  //     if (user) {
  //       setCurrentUser(user);
  //       setLoading(false);
  //       const userDoc = await getDoc(doc(db, "users", user.uid));
  //       if (userDoc.exists()) {
  //         setIsAdmin(userDoc.data().isAdmin);
  //       }
  //     } else {
  //       setCurrentUser(null);
  //       setLoading(false);
  //       setIsAdmin(false);
  //     }
  //   });
  //   return unsubscribe;
  // }, []);
  const value = {
    currentUser,
    login,
    signup,
    logout,
    isAdmin
  };

  return (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
  );
}
