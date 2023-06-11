import "./globals.css";
import { Inter } from "next/font/google";
import Navigation from "@/components/Navigation";
import { GlobalContextProvider } from "@/context/GlobalContext";
import { FinanceContextProvider } from "@/context/store/FinanceContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalContextProvider>
          <FinanceContextProvider>
            <Navigation />
            {children}
          </FinanceContextProvider>
        </GlobalContextProvider>
      </body>
    </html>
  );
}
