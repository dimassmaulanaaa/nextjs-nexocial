"use client";

import { useState, useEffect, useRef } from "react";
import { SignOutButton, useClerk, useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { SettingsIcon } from "lucide-react";
import { getUserProfile, syncUser, updateUserProfile } from "@/actions/user.action";
import SubmitButton from "@/components/common/SubmitButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type User = Awaited<ReturnType<typeof getUserProfile>>;

function ProfileSettingsMenu({ user }: { user: NonNullable<User> }) {
  const { openUserProfile } = useClerk();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
  });
  const previousClerkDataRef = useRef({
    username: clerkUser?.username,
    firstName: clerkUser?.firstName,
    lastName: clerkUser?.lastName,
    imageUrl: clerkUser?.imageUrl,
  });

  useEffect(() => {
    if (!clerkUser) return;

    const currentClerkData = {
      username: clerkUser.username,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    };

    const hasDataChanged = JSON.stringify(previousClerkDataRef.current) !== JSON.stringify(currentClerkData);

    if (hasDataChanged) {
      const syncUserUpdate = async () => {
        try {
          await syncUser();

          const currentUsername = pathname.split("/")[1];
          const newUsername = clerkUser.username;

          if (newUsername && currentUsername !== newUsername) {
            router.push(`/${newUsername}`);
          } else {
            router.refresh();
          }

          previousClerkDataRef.current = currentClerkData;
        } catch (error) {
          console.error("Error syncing user data:", error);
          toast.error(
            error instanceof Error ? error.message : "Something went wrong. Please check your connection and try again"
          );
        }
      };
      syncUserUpdate();
    }
  }, [clerkUser, router, pathname]);

  const handleEditSubmit = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const formData = new FormData();

      Object.entries(editForm).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const result = await updateUserProfile(formData);

      if (result.success) {
        setShowEditDialog(false);
      } else {
        toast.error(result.error || "Failed to edit profile");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong. Please check your connection and try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"ghost"} aria-label="Settings">
            <SettingsIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44 space-y-1" align="center">
          <DropdownMenuItem className="justify-center" onClick={() => setShowEditDialog(true)}>
            Edit profile
          </DropdownMenuItem>
          <DropdownMenuItem className="justify-center" onClick={() => openUserProfile()}>
            Account information
          </DropdownMenuItem>
          <SignOutButton>
            <DropdownMenuItem className="justify-center" asChild>
              <div className="w-full">Sign out</div>
            </DropdownMenuItem>
          </SignOutButton>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="min-h-[100px]"
                placeholder="Tell us about yourself"
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground text-right">{editForm.bio.length}/500</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                placeholder="Where are you based?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={editForm.website}
                onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                placeholder="Your personal website"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>

            <SubmitButton isLoading={isLoading} onClick={handleEditSubmit} disabled={isLoading}>
              <span>Save changes</span>
            </SubmitButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProfileSettingsMenu;
