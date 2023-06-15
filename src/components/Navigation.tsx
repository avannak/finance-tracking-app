"use client";
import Image from "next/image";
import React, { useContext } from "react";
import { useAuthContext } from "@/context/store/AuthContext";
import { ImStatsBars } from "react-icons/im";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { BsPlusSquareFill } from "react-icons/bs";

type Props = {};

const Navigation = (props: Props) => {
  const { user, loading, logout } = useAuthContext();

  return (
    <header className="container max-w-2xl px-3 py-6 mx-auto">
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
                  src={user.photoURL || "https://thispersondoesnotexist.com/"}
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
              <button className="m-1">
                <ImStatsBars className="text-2xl" />
              </button>
            </div>
            <div>
              <button type="button" onClick={logout} className="btn btn-danger">
                Sign Out
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navigation;
