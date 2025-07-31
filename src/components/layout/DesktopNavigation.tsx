"use client";

import Link from "next/link";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { BellIcon, HomeIcon, LogInIcon, UserIcon } from "lucide-react";
import { toTitleCase } from "@/lib/utils";

function DesktopNavigation() {
  const { user } = useUser();
  let formattedName = "You";

  if (user?.fullName) {
    const names = user.fullName.split(" ");
    const firstName = toTitleCase(names[0]);
    const initials = names
      .slice(1)
      .map((name) => name.charAt(0).toUpperCase())
      .join(" ");
    formattedName = initials ? `${firstName} ${initials}` : firstName;
  }

  return (
    <nav className="hidden md:flex flex-col items-center h-screen sticky top-0 border-r py-4 lg:px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <ul className="flex flex-col h-full lg:w-full gap-5">
        <li className="pb-3 text-4xl font-extrabold lg:text-3xl lg:font-bold tracking-wider">
          <Link href="/">
            <span className="hidden lg:block">Nexocial</span>
            <span className="block lg:hidden">N</span>
          </Link>
        </li>
        <li>
          <Link href="/" className="flex gap-5 text-lg font-semibold hover:text-primary/75">
            <HomeIcon className="size-8 lg:size-7" />
            <span className="hidden lg:block">Home</span>
          </Link>
        </li>
        {user ? (
          <li>
            <Link href="/notifications" className="flex gap-5 text-lg font-semibold hover:text-primary/75">
              <BellIcon className="size-8 lg:size-7" />
              <span className="hidden lg:block">Notifications</span>
            </Link>
          </li>
        ) : null}
        {user ? (
          <li>
            <Link href={`/profile/${user.username}`} className="flex gap-5 text-lg font-semibold hover:text-primary/75">
              <UserIcon className="size-8 lg:size-7" />
              <span className="hidden lg:block">Profile</span>
            </Link>
          </li>
        ) : null}
        <li className="flex justify-center gap-5 mt-auto py-5 text-lg font-semibold">
          {user ? (
            <>
              <UserButton afterSignOutUrl="/" />
              <span className="hidden lg:block">{formattedName}</span>
            </>
          ) : (
            <>
              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <Link
                  href=""
                  className="flex gap-5 p-2 lg:py-2 lg:px-5 rounded-full text-lg font-semibold bg-primary text-primary-foreground shadow hover:bg-primary/90"
                >
                  <LogInIcon className="size-8 lg:size-7" />
                  <span className="hidden lg:block">Sign In</span>
                </Link>
              </SignInButton>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default DesktopNavigation;
