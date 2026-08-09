import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import StructuredData from "@/components/StructuredData";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_DESCRIPTION =
  "E-Motion Rennteam Aalen – das Formula-Student-Electric-Team der Hochschule Aalen. Team, Fahrzeuge, Sponsoren und News.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "E-Motion Rennteam Aalen | Formula Student Electric",
    template: "%s | E-Motion Rennteam Aalen",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "E-Motion Rennteam Aalen | Formula Student Electric",
    description: SITE_DESCRIPTION,
    siteName: "E-Motion Rennteam Aalen",
    locale: "de_DE",
    type: "website",
    images: ["/uploads/ert-14-26-studio.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Motion Rennteam Aalen | Formula Student Electric",
    description: SITE_DESCRIPTION,
    images: ["/uploads/ert-14-26-studio.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <StructuredData />
        <Header />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
