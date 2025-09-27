// app/layout.js
import MainLayout from "@/components/layout/MainLayout";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Redberry RedSeam Clothing",
  description: "Redberry bootcamp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="antialiased" suppressHydrationWarning={true}>
        <MainLayout>
          {children}
          <ToastContainer />
        </MainLayout>
      </body>
    </html>
  );
}
