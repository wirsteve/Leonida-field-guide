import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Fraunces, Inter } from "next/font/google";
import { TabBar } from "@/components/shell/tab-bar";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Leonida Field Guide",
  description: "Your personal, spoiler-free playthrough guide.",
  applicationName: "Field Guide",
  appleWebApp: {
    capable: true,
    title: "Field Guide",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b1219",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${barlow.variable} ${inter.variable} antialiased`}>
      <body>
        <div className="min-h-dvh">{children}</div>
        <TabBar />
      </body>
    </html>
  );
}
