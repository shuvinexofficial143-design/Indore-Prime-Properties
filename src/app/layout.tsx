import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
export const metadata: Metadata = {
  title: "Indore Prime Properties | Shuvi 360 Demo",
  description: "A fictional real estate portfolio demonstration by Shuvi 360.",
  robots: { index: false, follow: false }
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
