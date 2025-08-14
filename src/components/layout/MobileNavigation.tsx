"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, useUser } from "@clerk/nextjs";
import { BellIcon, HomeIcon, LogInIcon } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";

function MobileNavigation() {
  const { user } = useUser();
  const pathname = usePathname();
  const navLinks = [
    { href: "/", icon: HomeIcon, auth: false },
    { href: "/notifications", icon: BellIcon, auth: false },
    { href: `/${user?.username}`, icon: UserAvatar, auth: true },
  ];

  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 rounded-full backdrop-blur supports-[backdrop-filter]:bg-foreground/10 z-50">
      <ul className="flex items-center justify-around gap-5 h-12">
        {navLinks.map((link) => {
          if (!link.auth || user) {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <li key={link.href}>
                <Link href={link.href} className={`hover:text-primary/85 items-center`}>
                  {link.icon === UserAvatar ? (
                    <UserAvatar
                      className={`${isActive ? "size-8" : "size-7"}`}
                      src={user?.imageUrl}
                      fallback={user?.username?.charAt(0).toUpperCase()}
                    />
                  ) : (
                    <Icon className={`${isActive ? "size-7" : "size-6"}`} />
                  )}
                </Link>
              </li>
            );
          }
          return null;
        })}
        {user ? null : (
          <li>
            <SignInButton mode="modal" fallbackRedirectUrl="/">
              <Link href="/" className="hover:text-primary/85">
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
