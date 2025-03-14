import Analytics from "@/components/Analytics";
import React from "react";
import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SplashScreen from "@/components/ui/SplashScreen";
import { ThemeProvider } from "@/providers/theme-provider";

const Navbar = React.lazy(() => import("@/components/Header/Navbar"));
const Footer = React.lazy(() => import("@/components/Footer/Footer"));
const SocialLists = React.lazy(() => import("@/components/Socials/SocialLists"));
const SideNavbar = React.lazy(() => import("@/components/SideNavbar/SideNavbar"));

const spaceGrotesk = Space_Grotesk({
  variable: "--font-Space_Grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-IBM_Plex_Mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Chethiya Nuwan • Portfolio",
  description:
    "My personal portfolio showcasing projects, skills, and experience.",
  keywords: [
    "Chethiya Nuwan",
    "Portfolio",
    "Software Engineer",
    "Web Developer",
    "Projects",
    "Skills",
    "Experience",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    url: "https://chethiyanuwan.github.io/portfolio",
    title: "Chethiya Nuwan • Portfolio",
    description:
      "Passionate software engineer building user-friendly, scalable applications with Next.js and modern technologies.",
    images: [
      {
        url: "https://chethiyanuwan.github.io/portfolio/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Chethiya Nuwan • Portfolio",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="portfolio/favicon.ico" sizes="any" />
        <link
          rel="shortcut icon"
          href="portfolio/favicon.ico"
          type="image/x-icon"
        />
        <link rel="apple-touch-icon" href="portfolio/favicon.ico" />
        <link rel="mask-icon" href="portfolio/favicon.ico" />
        <link rel="icon" href="favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="favicon.ico" />
        <link rel="mask-icon" href="favicon.ico" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex items-start w-full">
            <SideNavbar />
            <div className="w-full lg:flex-1">
              <Navbar />
              <main>{children}</main>
              <Footer />
            </div>
            <SocialLists />
          </div>
          <SplashScreen />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
