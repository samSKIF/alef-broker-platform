import type { Metadata, Viewport } from "next";
import { Inter, Tajawal, JetBrains_Mono } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/shared";
import "./globals.css";

// PRD §5.2 fallback fonts loaded via next/font. The primary brand families
// (Helvetica Neue LT Pro for Latin, GE SS Two for Arabic) are proprietary —
// we rely on system-installed copies and fall through to these.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  variable: "--font-tajawal",
  weight: ["400", "500", "700"],
  display: "swap",
});

const jbm = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alef Broker Platform",
  description:
    "Alef Group broker enablement & engagement platform — broker PWA + admin console.",
  // PRD §11 — installable PWA. iOS Safari needs an explicit
  // apple-mobile-web-app-capable hint to drop the address bar when the
  // user opens the home-screen shortcut.
  appleWebApp: {
    capable: true,
    title: "Alef",
    statusBarStyle: "black-translucent",
  },
};

// Viewport-coupled metadata (Next.js 15+ split this out of `metadata`).
// PRD §5.1 navy theme color colours the iOS status bar / Android URL bar
// when the PWA is installed. PRD §6 designs are mobile-first; we pin
// initial-scale to keep iOS Safari from zooming on input focus.
export const viewport: Viewport = {
  themeColor: "#333F48",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${tajawal.variable} ${jbm.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
