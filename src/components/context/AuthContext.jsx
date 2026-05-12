import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../../firebase/firebase";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Log in
  const login = async (email, password, role) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Persist role in localStorage
    localStorage.setItem("userRole", role);
    setUserRole(role);
    return userCredential;
  };

  // Google Login
  const loginWithGoogle = async (role) => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    localStorage.setItem("userRole", role);
    setUserRole(role);
    return userCredential;
  };

  // Log out
  const logout = () => {
    localStorage.removeItem("userRole");
    setUserRole(null);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      // Load role from localStorage on auth change
      const savedRole = localStorage.getItem("userRole");
      if (user && savedRole) {
        setUserRole(savedRole);
      } else if (!user) {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    login,
    signup,
    logout,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
