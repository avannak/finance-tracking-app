import Navigation from "@/components/Navigation";
import ToastifyProvider from "@/components/toastify/ToastifyProvider";
import { GlobalContextProvider } from "@/context/GlobalContext";
import AuthContextProvider from "@/context/store/AuthContext";
import { FinanceContextProvider } from "@/context/store/FinanceContext";
import { Inter } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Financy: Empower Your Financial Future!",
  description:
    "Dive into a seamless experience of tracking and managing your finances. Discover where every penny goes, and take control of your financial destiny with Financy.",
};

type LayoutProps = {
  children: React.ReactNode;
};

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/images/financy.ico" />
      </Head>
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
