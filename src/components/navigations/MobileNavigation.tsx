"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignInButton, useUser } from "@clerk/nextjs";
import { BellIcon, HomeIcon, LogInIcon } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";

function MobileNavigation() {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
    router.refresh();
  };

  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 rounded-full backdrop-blur supports-[backdrop-filter]:bg-foreground/10 z-50">
      <ul className="flex items-center justify-around gap-5 h-12">
        {/* HOME */}
        <li>
          <button onClick={() => handleNavigate("/")} className="hover:text-primary/85 items-center" aria-label="Home">
            <HomeIcon className={`${pathname === "/" ? "size-7" : "size-6"}`} />
          </button>
        </li>

        {user ? (
          <>
            {/* NOTIFICATIONS */}
            <li>
              <Link href="/notifications" className="hover:text-primary/85 items-center" aria-label="Notifications">
                <BellIcon className={`${pathname === "/notifications" ? "size-7" : "size-6"}`} />
              </Link>
            </li>

            {/* PROFILE */}
            <li>
              <button
                onClick={() => handleNavigate(`/${user?.username}`)}
                className="hover:text-primary/85 items-center"
                aria-label="Profile"
              >
                <UserAvatar
                  className={`${pathname === `/${user?.username}` ? "size-8" : "size-7"}`}
                  src={user?.imageUrl}
                  fallback={user?.username?.charAt(0).toUpperCase()}
                />
              </button>
            </li>
          </>
        ) : null}

        {user ? null : (
          <li>
            <SignInButton mode="modal" fallbackRedirectUrl="/">
              <Link href="/" aria-label="SignIn" className="hover:text-primary/85">
                <LogInIcon />
              </Link>
            </SignInButton>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default MobileNavigation;
