import Link from "next/link";
import { HomeIcon } from "lucide-react";
import DesktopNavbar from "@/components/layout/DesktopNavbar";
import MobileNavbar from "@/components/layout/MobileNavbar";
import { Button } from "@/components/ui/button";

function Navbar() {
  return (
    <header className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary font-mono tracking-wider">
              Nexocial
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link href="/">
                <HomeIcon className="w-5 h-5" />
                Home
              </Link>
            </Button>
          </div>

          <DesktopNavbar />
          <MobileNavbar />
        </div>
      </div>
    </header>
  );
}
export default Navbar;
