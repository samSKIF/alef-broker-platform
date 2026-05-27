import type { Metadata } from "next";
import { Inter, Tajawal, JetBrains_Mono } from "next/font/google";
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
