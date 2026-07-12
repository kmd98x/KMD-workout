import type { Metadata } from "next";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Geist, Geist_Mono } from "next/font/google";
import { BottomNav } from "@/shared/ui/BottomNav";
import { ConvexClientProvider } from "@/shared/ui/ConvexClientProvider";
import { SheetHost } from "@/shared/ui/SheetHost";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Steady",
  description: "A no-frills workout tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full bg-bg text-ink">
          <ConvexClientProvider>
            <SheetHost>
              <div className="mx-auto w-full max-w-[520px] px-[18px] pt-5 pb-[120px] md:max-w-[720px] lg:max-w-[1000px] xl:max-w-[1120px]">
                {children}
              </div>
              <BottomNav />
            </SheetHost>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
