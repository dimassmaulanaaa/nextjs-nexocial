import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { BellIcon } from "lucide-react";
import ModeToggle from "@/components/common/ModeToggle";
import { Button } from "@/components/ui/button";

async function DesktopNavbar() {
  const user = await currentUser();

  return (
    <div className="hidden md:flex items-center space-x-3">
      <ModeToggle />

      {user ? (
        <div className="flex items-center space-x-5">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/notifications">
              <BellIcon className="w-5 h-5" />
              <span className="sr-only">Notifications</span>
            </Link>
          </Button>

          <UserButton afterSignOutUrl="/" />
        </div>
      ) : (
        <>
          <SignInButton mode="modal">
            <Button className="lg:hidden">Sign In</Button>
          </SignInButton>
        </>
      )}
    </div>
  );
}

export default DesktopNavbar;
