"use client";
import { useAuthContext } from "@/context/store/AuthContext";
import Image from "next/image";
import { redirect } from "next/navigation";
import logo from "public/images/Financy.png";
import piggyBank from "public/images/piggy-bank.webp";
import { FcGoogle } from "react-icons/fc";

type Props = {};

const SignIn = (props: Props) => {
  const { googleLoginHandler, user, loading } = useAuthContext();
  if (user && !loading) {
    return redirect("/");
  }

  return (
    <div className="relative top-0 left-0 right-0 container max-w-2xl px-6 py-6 mx-auto flex flex-col items-center">
      <Image src={logo} alt="logo" width={300} height={400}></Image>
      <div className="w-full h-full my-6 bg-slate-800 rounded-t-2xl rounded-b-2xl">
        <Image
          className="rounded-t-2xl w-full"
          height={300}
          src={piggyBank}
          alt="piggy-bank"
        />
        <div className="px-4 py-4">
          <h3 className="text-2xl text-center px-6 py-6">
            Please sign in to continue
          </h3>
          <button
            type="button"
            onClick={googleLoginHandler}
            className="box-border my-6 mx-auto flex flex-center text-center rounded-xl py-4 px-8 bg-slate-700 border-slate-700 text-lime-400 border items-center justify-center h-full"
          >
            <FcGoogle className="mx-2 text-3xl" />
            <h3 className="font-bold">Sign in with Google</h3>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
