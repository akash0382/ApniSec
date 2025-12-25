import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ApniSec - Your Trusted Cybersecurity Partner",
  description:
    "ApniSec provides comprehensive cybersecurity solutions including Cloud Security Assessments, Red Team Assessments, and VAPT services.",
  keywords: [
    "cybersecurity",
    "cloud security",
    "VAPT",
    "penetration testing",
    "red team assessment",
    "security consulting",
  ],
  authors: [{ name: "ApniSec" }],
  openGraph: {
    title: "ApniSec - Your Trusted Cybersecurity Partner",
    description:
      "Comprehensive cybersecurity solutions for your business",
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}

