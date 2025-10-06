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
  title: "AI Blog Summarizer | Summarize Any Blog Instantly with Gemini AI",
  description:
    "Turn long blog posts into clear, concise summaries with AI Blog Summarizer. Built with Next.js, TypeScript, and Google Gemini — fast, accurate, and free to use.",
  keywords: [
    "AI blog summarizer",
    "AI summarizer",
    "blog summarizer by URL",
    "Gemini AI summarizer",
    "Next.js AI tool",
    "Google Gemini API",
    "AI content summary",
    "blog summary generator",
  ],
  authors: [{ name: "Sadaf Shahab" }],
  openGraph: {
    title: "AI Blog Summarizer",
    description:
      "Summarize any blog instantly using Google Gemini AI. Built with Next.js + TypeScript for speed and precision.",
    url: "https://ai-blog-summarizer-by-sadaf.vercel.app/",
    siteName: "AI Blog Summarizer",
    images: [
      {
        url: "https://cdn.prod.website-files.com/6552ac3288a17b3a67ac2b93/6580cfa63c8fa1a3c4e5bbd9_logo%5B1%5D.png",
        width: 1200,
        height: 630,
        alt: "AI Blog Summarizer preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="shortcut icon"
          href="https://cdn.prod.website-files.com/6552ac3288a17b3a67ac2b93/6580cfa63c8fa1a3c4e5bbd9_logo%5B1%5D.png"
          type="image/png"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
