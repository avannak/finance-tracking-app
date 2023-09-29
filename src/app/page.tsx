"use client";

import HomePage from "@/components/HomePage";
import SignIn from "@/app/signin/page"; // Assuming this is the correct path to your SignIn component
import { useAuthContext } from "@/context/store/AuthContext";

export default function Home() {
  const { user, loading } = useAuthContext();

  // If not authenticated and not loading, render SignIn
  if (!user && !loading) {
    return <SignIn />;
  }

  // If authenticated, render HomePage
  return <>{user && !loading && <HomePage />}</>;
}
