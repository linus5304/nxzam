import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "xzam",
  description: "xzam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${GeistSans.variable} ${GeistMono.variable} antialiased font-sans bg-background`}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}