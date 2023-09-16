"use client";
import Image from "next/image";
import React, { useContext } from "react";
import { useAuthContext } from "@/context/store/AuthContext";
import { ImStatsBars } from "react-icons/im";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { BsPlusSquareFill } from "react-icons/bs";
import Link from "next/link";

type Props = {
  className?: string;
};

const Navigation = (props: Props) => {
  const { user, loading, logout } = useAuthContext();
  return (
    user && (
      <div
        className={`fixed flex flex-col h-full w-64 bg-zinc-900 border border-gray-800 ${props.className}`}
      >
        <header className="">
          <div className="flex justify-between">
            {/* User Information */}
            {user && !loading && (
              <div className="flex items-center gap-2">
                {/* img */}
                <div className="h-[40px] w-[40px] rounded-full overflow-hidden">
                  <button>
                    <Image
                      className="object-cover w-full h-full"
                      // src="https://thispersondoesnotexist.com/"
                      src={
                        user.photoURL || "https://thispersondoesnotexist.com/"
                      }
                      alt={user.displayName || "Unknown User"}
                      referrerPolicy="no-referrer"
                      height={500}
                      width={500}
                    />
                  </button>
                </div>

                {/* name */}
                <small>Hello, {user.displayName}</small>
              </div>
            )}

            {/* Right side of navigation */}
            {user && !loading && (
              <nav className="flex items-center gap-2">
                <div>
                  {/* <button className="m-1">
                <BsPlusSquareFill className="text-2xl" />
              </button> */}
                </div>
              </nav>
            )}
          </div>
        </header>
        <nav className=" bg-zinc-900 border-r border-zinc-800 h-screen w-64 fixed top-0 left-0 overflow-y-auto">
          <div className="p-4">
            <Link
              href="/"
              className="w-full text-left flex items-center text-2xl"
            >
              <span className="mr-2">📊</span>
              Overview
            </Link>
          </div>
          <ul className="list-none p-4">
            <li>
              <Link
                href="/income"
                className="text-white hover:text-gray-300 block py-2"
              >
                Income History
              </Link>
            </li>
            <li>
              <a
                href="#budgets"
                className="text-white hover:text-gray-300 block py-2"
              >
                Budgets
              </a>
            </li>
            <li>
              <a
                href="#trends"
                className="text-white hover:text-gray-300 block py-2"
              >
                Trends
              </a>
            </li>
          </ul>
          <div className="p-4">
            <button
              type="button"
              onClick={logout}
              className="btn btn-danger w-full text-left flex items-center text-red-600 hover:text-white py-2"
            >
              <span className="mr-2">🚪</span>
              Sign Out
            </button>
          </div>
        </nav>
      </div>
    )
  );
};

export default Navigation;
