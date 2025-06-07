import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6366f1',
};

export const metadata: Metadata = {
  title: "Vibe Coding | colonmelvin.com",
  description: "An interactive coding experience where you control the vibe. Adjust the atmosphere, feel the code, and create your perfect coding environment.",
  keywords: ["vibe coding", "interactive", "coding experience", "web development", "atmosphere"],
  authors: [{ name: "colonmelvin" }],
  creator: "colonmelvin",
  openGraph: {
    title: "Vibe Coding | colonmelvin.com",
    description: "Control the vibe. Feel the code. Create your perfect coding atmosphere.",
    url: "https://colonmelvin.com",
    siteName: "colonmelvin.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe Coding | colonmelvin.com",
    description: "An interactive coding experience where you control the vibe.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
