"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col xl:col-span-6 gap-3 items-center justify-center h-[77.5vh] text-center p-4">
      <AlertTriangle className="h-16 w-16 text-destructive" />
      <h1 className="text-3xl font-bold">Oops! An Error Occurred</h1>
      <p className="text-muted-foreground">
        Something went wrong on our end. We&apos;ve been notified and are looking into it. Please try again or return home.
      </p>

      <div className="flex items-center gap-4 mt-2">
        <Button onClick={() => reset()}>Try Again</Button>

        <Button variant="outline" asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
