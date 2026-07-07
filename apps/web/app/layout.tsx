import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "video-capture — open source screen recording",
  description:
    "Record your screen and camera, share with a link. An open source alternative to Loom.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
