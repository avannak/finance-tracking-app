import Image from "next/image";
import React from "react";
import { ImStatsBars } from "react-icons/im";
import { RiLogoutBoxRLine } from "react-icons/ri";

type Props = {};

const Navigation = (props: Props) => {
  return (
    <header className="container max-w-2xl px-6 py-6 mx-auto">
      <div className="flex justify-between">
        {/* User Information */}
        <div className="flex items-center gap-2">
          {/* img */}
          <div className="h-[40px] w-[40px] rounded-full overflow-hidden">
            <button>
              <Image
                className="object-cover w-full h-full"
                src="https://thispersondoesnotexist.com/"
                alt="Profile img"
                height={500}
                width={500}
              />
            </button>
          </div>

          {/* name */}
          <small>Hello, Arthur!</small>
        </div>

        {/* Right side of navigation */}
        <nav className="flex items-center gap-4">
          <div>
            <button>
              <ImStatsBars className="text-2xl" />
            </button>
          </div>
          <div>
            <button className="btn btn-danger">Sign Out</button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
