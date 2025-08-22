"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, useUser } from "@clerk/nextjs";
import { BellIcon, HomeIcon, LogInIcon } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";

function DesktopNavigation() {
  const { user } = useUser();
  const pathname = usePathname();
  const navLinks = [
    { href: "/", label: "Home", icon: HomeIcon, auth: false },
    { href: "/notifications", label: "Notifications", icon: BellIcon, auth: true },
    { href: `/${user?.username}`, label: "Profile", icon: UserAvatar, auth: true },
  ];

  return (
    <nav className="hidden md:flex flex-col h-screen sticky top-0 border-r py-4">
      <ul className="flex flex-col h-full gap-9 pl-4 lg:w-full">
        <li className="pb-3 tracking-wider">
          <Link href="/">
            <span className="font-extrabold text-4xl">N</span>
            <span className="hidden lg:inline font-semibold text-3xl">exocial</span>
          </Link>
        </li>
        {navLinks.map((link) => {
          if (!link.auth || user) {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-label={link.label}
                  className={`flex gap-5 text-lg font-semibold hover:text-primary/85 hover:border-primary/85 ${
                    isActive ? "font-bold border-primary border-r-[3px]" : ""
                  }`}
                >
                  {link.label === "Profile" ? (
                    <UserAvatar className="size-7" src={user?.imageUrl} fallback={user?.username?.charAt(0).toUpperCase()} />
                  ) : (
                    <Icon className="size-7" />
                  )}
                  <span className="hidden lg:block">{link.label}</span>
                </Link>
              </li>
            );
          }
          return null;
        })}
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
