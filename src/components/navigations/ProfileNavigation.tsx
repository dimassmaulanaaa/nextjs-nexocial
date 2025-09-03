"use client";

import { usePathname, useRouter } from "next/navigation";

type ProfileNavigationProps = {
  username: string;
};

function ProfileNavigation({ username }: ProfileNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: `/${username}`, label: "Posts", ariaLabel: "Posts" },
    { href: `/${username}/liked`, label: "Likes", ariaLabel: "Liked Posts" },
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
    router.refresh();
  };

  return (
    <nav className="w-full">
      <ul className="flex items-center justify-evenly border-b rounded-none h-auto p-0 bg-transparent">
        {navLinks.map((link) => (
          <li key={link.href}>
            <button
              className={`flex items-center gap-2 rounded-none px-5 py-2 text-base font-semibold ${
                pathname === link.href ? "border-b-2 border-primary bg-transparent shadow-none text-lg" : ""
              }`}
              onClick={() => handleNavigate(link.href)}
              aria-label={link.label}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default ProfileNavigation;
