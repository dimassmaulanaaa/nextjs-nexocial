"use client";

import Link from "next/link";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { BellIcon, HomeIcon, LogInIcon, UserIcon } from "lucide-react";
import ModeToggle from "@/components/common/ModeToggle";

function MobileNavigation() {
  const { user } = useUser();

  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 mx-auto border rounded-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex items-center justify-around gap-5 h-12 text-lg font-semibold">
          <li>
            <Link href="/" className="hover:text-primary/75">
              <HomeIcon />
            </Link>
          </li>

          <li>
            <Link href="/notifications" className="hover:text-primary/75">
              <BellIcon />
            </Link>
          </li>

          <li>
            <Link href={`/${user?.username}`} className="hover:text-primary/75">
              <UserIcon />
            </Link>
          </li>

          <li className="flex">
            {user ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <Link href="" className="p-[0.315rem] text-primary-foreground rounded-full bg-primary hover:bg-primary/90">
                  <LogInIcon />
                </Link>
              </SignInButton>
            )}
          </li>

          <li>
            <ModeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default MobileNavigation;
