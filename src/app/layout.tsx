import Navigation from "@/components/Navigation";
import { GlobalContextProvider } from "@/context/GlobalContext";
import AuthContextProvider from "@/context/store/AuthContext";
import { FinanceContextProvider } from "@/context/store/FinanceContext";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import ToastifyProvider from "@/components/toastify/ToastifyProvider";
import HomePage from "@/components/HomePage";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

type LayoutProps = {
  children: React.ReactNode;
};

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <GlobalContextProvider>
            <FinanceContextProvider>
              <ToastifyProvider />
              <Navigation className="min-w-[200px]" />
              <main>{children}</main>
            </FinanceContextProvider>
          </GlobalContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
};

export default RootLayout;
