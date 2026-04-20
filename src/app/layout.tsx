import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PLC Temperature Monitor",
  description: "Real-time temperature from LOGO! 8.4 PLC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
