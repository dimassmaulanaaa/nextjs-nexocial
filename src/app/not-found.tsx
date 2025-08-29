import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found | Nexocial",
  description: "The page you're looking for doesn't exist. Return to Nexocial to continue connecting.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex flex-col xl:col-span-6 gap-5 items-center justify-center h-[77.5vh] text-center p-4">
      <div className="gap-3">
        <div className="relative text-9xl font-bold text-primary/25 select-none">404</div>

        <h1 className="text-3xl font-bold">Page Not Found</h1>

        <p className="text-muted-foreground mt-1">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get you back to connecting
          with others.
        </p>
      </div>

      <div className="flex items-center">
        <Button asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">If you believe this is an error, please try refreshing the page</p>
    </div>
  );
}
