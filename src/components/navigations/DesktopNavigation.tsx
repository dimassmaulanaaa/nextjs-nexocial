"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignInButton, useUser } from "@clerk/nextjs";
import { BellIcon, HomeIcon, LogInIcon } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";

function DesktopNavigation() {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
    router.refresh();
  };

  return (
    <nav className="hidden md:flex flex-col h-screen sticky top-0 border-r py-4">
      <ul className="flex flex-col h-full gap-9 pl-4 lg:w-full">
        {/* LOGO */}
        <li className="pb-3 tracking-wider">
          <Link href="/" aria-label="Logo">
            <span className="font-extrabold text-4xl">N</span>
            <span className="hidden lg:inline font-semibold text-3xl">exocial</span>
          </Link>
        </li>

        {/* HOME */}
        <li>
          <button
            onClick={() => handleNavigate("/")}
            className={`flex gap-5 w-full text-lg font-semibold hover:text-primary/85 hover:border-primary/85 ${
              pathname === "/" ? "font-bold border-primary border-r-[3px]" : ""
            }`}
            aria-label="Home"
          >
            <HomeIcon className="size-7" />
            <span className="hidden lg:block">Home</span>
          </button>
        </li>

        {user ? (
          <>
            {/* NOTIFICATIONS */}
            <li>
              <Link
                href="/notifications"
                className={`flex gap-5 text-lg font-semibold hover:text-primary/85 hover:border-primary/85 ${
                  pathname === `/notifications` ? "font-bold border-primary border-r-[3px]" : ""
                }`}
                aria-label="Notifications"
              >
                <BellIcon className="size-7" />
                <span className="hidden lg:block">Notifications</span>
              </Link>
            </li>

            {/* PROFILE */}
            <li>
              <button
                onClick={() => handleNavigate(`/${user?.username}`)}
                className={`flex gap-5 w-full text-lg font-semibold hover:text-primary/85 hover:border-primary/85 ${
                  pathname === `/${user?.username}` ? "font-bold border-primary border-r-[3px]" : ""
                }`}
                aria-label="Profile"
              >
                <UserAvatar className="size-7" src={user?.imageUrl} fallback={user?.username?.charAt(0).toUpperCase()} />
                <span className="hidden lg:block">Profile</span>
              </button>
            </li>
          </>
        ) : null}

        {user ? null : (
          <li>
            <SignInButton mode="modal" fallbackRedirectUrl="/">
              <Link href="/" aria-label="SignIn" className="flex gap-5 text-lg font-semibold hover:text-primary/85">
                <LogInIcon className="size-8 lg:size-7" /> <span className="hidden lg:block">Sign in</span>
              </Link>
            </SignInButton>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default DesktopNavigation;
