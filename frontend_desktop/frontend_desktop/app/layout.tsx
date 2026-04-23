import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Damayan",
  description: "Damayan desktop frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
