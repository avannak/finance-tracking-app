"use client";
import { useContext, createContext } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

export interface FirebaseUser {
  uid: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

export type authContextTypes = {
  user: FirebaseUser | null;
  loading: boolean;
  googleLoginHandler: () => Promise<void>;
  logout: () => Promise<void>;
};

export const authContext = createContext<authContextTypes>({
  user: null,
  loading: true,
  googleLoginHandler: async () => {},
  logout: async () => {},
});

const AuthContextProvider = ({ children }: any) => {
  const [firebaseUser, loading] = useAuthState(auth);
  const router = useRouter();

  const user: FirebaseUser | null = firebaseUser
    ? {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      }
    : null;

  const googleLoginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider)
        .then((result) => {
          // This gives a Google Access Token. Use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential !== null) {
            // Safe to use credential here
            const token = credential.accessToken;
          }
          // The signed-in user info.
          const user = result.user;
          //  Retrieve the user's uid with user.uid
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem(`expenses-${user?.uid}`);
      router.push("/signin");
    } catch (error) {
      throw error;
    }
  };

  const values = { user, loading, googleLoginHandler, logout };
  return <authContext.Provider value={values}>{children}</authContext.Provider>;
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(authContext);
