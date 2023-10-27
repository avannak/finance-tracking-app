// AuthComponent.tsx

import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { authContext, FirebaseUser } from "./AuthContext"; // import from context provider

const AuthComponent = ({ children }: any) => {
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
