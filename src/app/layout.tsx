import type { Metadata } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import { ThemeProvider } from "@/lib/useTheme";
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${spaceMono.variable} min-h-screen antialiased`}
        style={{ fontFamily: "var(--font-outfit), var(--font-sans)", background: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        <ConvexClientProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
