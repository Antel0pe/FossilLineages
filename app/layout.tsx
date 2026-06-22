import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fossil Lineages — Human Origins Atlas",
  description:
    "Explore the evidence, uncertainty, fossils, and evolutionary pressures across 25 million years of human ancestry.",
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
