"use client";
import { useGlobalContext } from "@/context/GlobalContext";
import { useAuthContext } from "@/context/store/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import "react-resizable/css/styles.css";
import Icon from "./icon/Icon";
import { FaAngleDoubleRight } from "react-icons/fa";

type Props = {
  className?: string;
};

const Navigation = (props: Props) => {
  const { user, loading, logout } = useAuthContext();
  const { showNav, setShowNav, navWidth } = useGlobalContext();
  const pathname = usePathname();

  useEffect(() => {
    function setVHVariable() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    setVHVariable();
    window.addEventListener("resize", setVHVariable);

    return () => {
      window.removeEventListener("resize", setVHVariable);
    };
  }, [pathname]); // useEffect will be triggered on pathname change

  return (
    <div
      className="relative min-h-full"
      style={
        showNav
          ? { height: "calc(var(--vh, 1vh) * 100)" }
          : { height: "h-full" }
      }
    >
      {showNav && user && (
        <div className="flex flex-col h-full bg-zinc-900 border border-gray-800 min-h-screen">
          <nav
            style={{ width: navWidth }}
            className="flex flex-col  bg-zinc-900 border-r border-zinc-800 h-full top-0 left-0 overflow-y-auto"
          >
            <header className="p-4">
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
                            user.photoURL ||
                            "https://thispersondoesnotexist.com/"
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
      )}
      {!showNav && (
        <div className="fixed top-0 left-0 h-full w-4 bg-zinc-900 border-r border-zinc-800 z-50">
          <button
            className="absolute top-3 left-0 mt-4 ml-0"
            onClick={() => setShowNav(true)}
          >
            <Icon name="FaChevronRight"></Icon>
          </button>
        </div>
      )}
      {showNav && user && (
        <button
          className="absolute top-3 right-0 mt-4 mr-4"
          onClick={() => setShowNav(false)}
        >
          <Icon name="FaChevronLeft"></Icon>
        </button>
      )}
    </div>
  );
};

export default Navigation;
