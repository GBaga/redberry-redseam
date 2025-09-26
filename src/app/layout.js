// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Header from "@/components/layout/Header";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Redberry RedSeam Clothing",
//   description: "Redberry  bootcamp",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <Header />

//         <main className="pt-20">{children}</main>
//       </body>
//     </html>
//   );
// }

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
