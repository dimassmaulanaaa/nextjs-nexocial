"use client";

import Link from "next/link";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { BellIcon, HomeIcon, LogInIcon } from "lucide-react";
import ModeToggle from "@/components/common/ModeToggle";

function MobileNavigation() {
  const { user } = useUser();

  return (
    <header className="md:hidden fixed bottom-3 left-3 right-3 mx-auto border rounded-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center justify-around h-12">
          <Link href="/" className="flex gap-5 text-lg font-semibold hover:text-primary/75">
            <HomeIcon />
          </Link>

          {user ? (
            <Link href="/notifications" className="flex gap-5 text-lg font-semibold hover:text-primary/75">
              <BellIcon />
            </Link>
          ) : null}

          <ModeToggle />

          {user ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <>
              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <Link
                  href=""
                  className="flex gap-5 p-2 rounded-full text-lg font-semibold bg-primary text-primary-foreground shadow hover:bg-primary/90"
                >
                  <LogInIcon />
                </Link>
              </SignInButton>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default MobileNavigation;
