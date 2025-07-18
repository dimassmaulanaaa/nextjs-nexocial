"use client";

import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";
import { BellIcon, HomeIcon, MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/common/ModeToggle";

function MobileNavbar() {
  const { user } = useUser();

  return (
    <div className="md:hidden flex items-center space-x-3">
      <ModeToggle />

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full space-y-2 mt-6">
            <Button variant="ghost" className="flex items-center gap-4 justify-start text-base" asChild>
              <Link href="/">
                <HomeIcon className="w-5 h-5" /> Home
              </Link>
            </Button>

            {user ? (
              <>
                <Button variant="ghost" className="flex items-center gap-4 justify-start text-base" asChild>
                  <Link href="/notifications">
                    <BellIcon className="w-5 h-5" /> Notifications
                  </Link>
                </Button>

                <div className="mt-auto">
                  <div className="border-t my-4" />
                  <Button variant="ghost" className="flex items-center gap-4 justify-start text-base" asChild>
                    <Link href={`/profile/${user.username ?? user.id}`}>
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={user.imageUrl} alt={user.fullName ?? "User profile"} />
                        <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      Profile
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-5">
                <SignInButton>
                  <Button className="w-full">Sign In</Button>
                </SignInButton>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;
