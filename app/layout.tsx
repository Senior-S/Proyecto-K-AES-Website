import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Proyecto K - Utils",
  description: "Fandom website con una variedad de utilidades para resolver el ARG 'Proyecto K'"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="./icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="./icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="./icons/favicon-16x16.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
