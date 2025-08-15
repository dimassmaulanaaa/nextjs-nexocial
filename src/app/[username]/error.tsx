"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[75vh] text-center p-4">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Oops! Something went wrong.</h2>
      <p className="text-muted-foreground mb-6">An unexpected error occurred. Please try to refresh the page.</p>
      <Button onClick={() => reset()}>Try Again</Button>
    </div>
  );
}
