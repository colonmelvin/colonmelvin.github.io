import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Colon Melvin",
  description: "North Carolina. AWS. Photography. Trading. Running.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#040804] text-white antialiased cursor-none md:cursor-none">
        {children}
      </body>
    </html>
  );
}
