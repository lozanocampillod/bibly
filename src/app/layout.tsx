import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bibly",
    template: "%s | Bibly",
  },
  description: "Bibly helps you master your bibliography using spaced repetition and active recall.",
  openGraph: {
    title: "Bibly",
    description: "Master your bibliography with spaced repetition and review stats.",
    url: "https://bibly.lzcpd.xyz",
    siteName: "Bibly",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bibly",
    description: "Master your bibliography with spaced repetition and review stats.",
    creator: "@deivvvv_",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
