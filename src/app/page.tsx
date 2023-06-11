"use client";

import HomePage from "@/components/HomePage";
import { useAuthContext } from "@/context/store/AuthContext";
import { redirect } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuthContext();
  if (!user && !loading) {
    return redirect("/signin");
  }

  return <>{user && !loading && <HomePage />}</>;
}
