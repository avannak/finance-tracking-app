import ToastifyProvider from "@/components/toastify/ToastifyProvider";
import { GlobalContextProvider } from "@/context/GlobalContext";
import AuthContextProvider from "@/context/store/AuthContext";
import { FinanceContextProvider } from "@/context/store/FinanceContext";
import { Inter } from "next/font/google";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Financy: Empower Your Financial Future!",
  description:
    "Dive into a seamless experience of tracking and managing your finances. Discover where every penny goes, and take control of your financial destiny with Financy.",
};

const DynamicLayoutContent = dynamic(
  () => import("@/components/DynamicLayoutContent"),
  {
    ssr: false,
  }
);

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
              <DynamicLayoutContent>{children}</DynamicLayoutContent>
            </FinanceContextProvider>
          </GlobalContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
};

export default RootLayout;
