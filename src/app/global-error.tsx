"use client";

import { useEffect } from "react";
import localFont from "next/font/local";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
          <div className="flex flex-col items-center text-center max-w-md space-y-4">
            <AlertTriangle className="h-16 w-16 text-destructive" />
            <h1 className="text-3xl font-bold">Oops! An Error Occurred</h1>
            <p className="text-muted-foreground">
              Something went wrong on our end. We&apos;ve been notified and are looking into it. Please try again in a
              moment.
            </p>
            <Button onClick={() => reset()}>Try Again</Button>
          </div>
        </div>
      </body>
    </html>
  );
}
