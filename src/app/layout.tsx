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
  title: "StackFix AI – Fix Coding Errors with AI",
  description:
    "AI-powered debugging assistant for developers. Analyze errors, find root causes, and get real solutions from Stack Overflow instantly.",
  keywords: [
    "AI debugging tool",
    "fix coding errors",
    "stack overflow AI",
    "developer tool",
    "error analyzer",
  ],
  authors: [{ name: "Pulat Ergashev" }, { name: "Azamkhuja Vosiljonov" }],
  openGraph: {
    title: "StackFix AI – Fix Coding Errors with AI",
    description:
      "AI-powered debugging assistant for developers. Analyze errors, find root causes, and get real solutions from Stack Overflow instantly.",
    url: "https://soso.uz",
    siteName: "StackFix AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackFix AI – Fix Coding Errors with AI",
    description:
      "AI-powered debugging assistant for developers. Analyze errors, find root causes, and get real solutions from Stack Overflow instantly.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
