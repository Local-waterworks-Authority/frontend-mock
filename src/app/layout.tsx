import type { Metadata } from "next";
import { Mitr, Sarabun } from "next/font/google";
import "./globals.css";

const mitr = Mitr({
  variable: "--font-mitr",
  subsets: ["thai"],
  weight: ["400", "700"],
});

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Local Waterworks Authority | หน่วยงานประปา",
  description:
    "The Local Waterworks Authority (LWA) is a system to collect, validate, and manage waterworks processes for local authorities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mitr.variable} ${sarabun.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
