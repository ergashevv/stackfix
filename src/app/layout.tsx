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
    default: "StackFix AI – Professional AI Debugging & Error Analysis",
    template: "%s | StackFix AI",
  },
  description:
    "The ultimate AI-powered debugging assistant. Analyze complex stack traces, identify root causes with Gemini-2.5 Flash, and get verified solutions from Stack Overflow in seconds.",
  keywords: [
    "AI debugging",
    "software error analysis",
    "Gemini AI coding assistant",
    "Stack Overflow results AI",
    "developer productivity tool",
    "intelligent bug fixing",
    "automated code repair",
  ],
  authors: [{ name: "StackFix AI Team" }],
  creator: "StackFix AI",
  publisher: "StackFix AI",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "StackFix AI – Fix Coding Errors with AI",
    description:
      "Transform your debugging workflow with AI-powered analysis and structured solutions. Built for modern developers.",
    url: "https://stackfix.ai",
    siteName: "StackFix AI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/favicon.png",
        width: 1024,
        height: 1024,
        alt: "StackFix AI Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StackFix AI – High-Performance AI Debugging",
    description:
      "Stop wasting hours on cryptic errors. Let StackFix AI analyze and solve them for you instantly.",
    images: ["/favicon.png"],
  },
  alternates: {
    canonical: "https://stackfix.ai",
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
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedTheme = localStorage.getItem('theme');
                  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                  
                  function updateTheme(isDark) {
                    if (isDark) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  }

                  if (storedTheme === 'dark' || (!storedTheme && mediaQuery.matches)) {
                    updateTheme(true);
                  } else {
                    updateTheme(false);
                  }

                  mediaQuery.addEventListener('change', function(e) {
                    if (!localStorage.getItem('theme')) {
                      updateTheme(e.matches);
                    }
                  });
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
