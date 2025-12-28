import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "breathe",
  description: "A moment of stillness. Grounding techniques for nervous system regulation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%23040804'/><circle cx='16' cy='16' r='8' fill='none' stroke='%2334d399' stroke-width='1.5' opacity='0.6'/><circle cx='16' cy='16' r='3' fill='%2334d399' opacity='0.8'/></svg>" />
      </head>
      <body className="bg-[#040804] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
