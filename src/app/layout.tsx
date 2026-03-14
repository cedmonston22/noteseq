import type { Metadata } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "noteseq",
  description: "Real-time collaborative notes for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${spaceMono.variable} min-h-screen bg-[#111116] text-[#E8E8ED] antialiased`}
        style={{ fontFamily: "var(--font-outfit), var(--font-sans)" }}
      >
        {children}
      </body>
    </html>
  );
}
