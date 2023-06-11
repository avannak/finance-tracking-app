"use client";
import { useContext, createContext } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export interface FirebaseUser {
  uid: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

export type authContextTypes = {
  user: FirebaseUser | null;
  loading: boolean;
  googleLoginHandler: () => {};
  logout: () => {};
};

export const authContext = createContext<authContextTypes>({
  user: null,
  loading: false,
  googleLoginHandler: async () => {},
  logout: async () => {},
});

const AuthContextProvider = ({ children }: any) => {
  const [firebaseUser, loading] = useAuthState(auth);

  const user: FirebaseUser | null = firebaseUser
    ? {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      }
    : null;

  const googleLoginHandler = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const values = { user, loading, googleLoginHandler, logout };
  return <authContext.Provider value={values}>{children}</authContext.Provider>;
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(authContext);
