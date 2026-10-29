import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "SonicFlow — Your media, your way",
  description: "A polished media toolkit for video links, audio extraction and music discovery."
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}