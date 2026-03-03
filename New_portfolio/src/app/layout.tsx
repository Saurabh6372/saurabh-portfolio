import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saurabh Maurya - Product Designer",
  description:
    "I'm an experienced digital designer based in the beautiful landscapes of India crafting products with purpose and meticulous attention to detail.",
  openGraph: {
    title: "Saurabh Maurya - Product Designer",
    description:
      "I design products with purpose and meticulous attention to detail.",
    url: "https://saurabhmaurya.dev",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
