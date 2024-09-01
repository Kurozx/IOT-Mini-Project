import { Inter } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from "@/components/nav";
import BootstrapClient from "@/components/bootstrapClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IOT Dashboard"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <BootstrapClient />
      <Navbar />

      <div className="mt-2 mb-2">
          {children}
        </div>

        
        </body>
    </html>
  );
}
