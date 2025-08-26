"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { CalendarIcon, LinkIcon, MapPinIcon } from "lucide-react";
import { getUserProfile } from "@/actions/user.action";
import { useClerkSync } from "@/hooks/useClerkSync";
import UserAvatar from "@/components/common/UserAvatar";
import { Card, CardContent } from "@/components/ui/card";
import ProfilePageSkeleton from "@/components/profile/ProfilePageSkeleton";

const FollowButton = dynamic(() => import("@/components/common/FollowButton"));
const ModeToggle = dynamic(() => import("@/components/common/ModeToggle"));
const ProfileSettingsMenu = dynamic(() => import("@/components/profile/ProfileSettingsMenu"));

type User = Awaited<ReturnType<typeof getUserProfile>>;
type ProfileHeaderProps = {
  user: NonNullable<User>;
  isFollowing: boolean;
};

function ProfileHeader({ user, isFollowing }: ProfileHeaderProps) {
  const { user: currentUser, isLoaded } = useUser();
  const { isRedirecting } = useClerkSync(user.username);

  const isOwnProfile = useMemo(() => currentUser?.username === user.username, [currentUser?.username, user.username]);
  const formattedDate = useMemo(() => format(new Date(user.createdAt), "MMMM yyyy"), [user.createdAt]);
  const stats = useMemo(
    () => ({
      following: user._count.following,
      followers: user._count.followers,
      posts: user._count.posts,
    }),
    [user._count]
  );

  if (!isLoaded || isRedirecting) return <ProfilePageSkeleton />;

  return (
    <Card className="shadow-none border-none">
      <CardContent className="flex flex-wrap justify-center gap-5 md:gap-9 py-5 px-0">
        <UserAvatar className="size-16 md:size-20" src={user.image ?? ""} fallback={user.username.charAt(0).toUpperCase()} />

        <div className="flex flex-col max-w-xs md:max-w-sm space-y-3 md:space-y-5">
          {/* USERNAME & SETTINGS BUTTON */}
          <div className="flex justify-between items-center gap-5">
            <h1 className="text-xl font-medium truncate">{user.username}</h1>

            {isOwnProfile ? (
              <span>
                <ProfileSettingsMenu user={user} />
                <ModeToggle />
              </span>
            ) : (
              <FollowButton targetUserId={user.id} initialIsFollowing={isFollowing} />
            )}
          </div>

          {/* STATS */}
          <div className="flex gap-3 sm:gap-5 pr-5 md:pr-11 font-semibold">
            <div>
              {stats.following.toLocaleString()} <span className="font-normal text-muted-foreground">following</span>
            </div>
            <div>
              {stats.followers.toLocaleString()} <span className="font-normal text-muted-foreground">followers</span>
            </div>
            <div>
              {stats.posts.toLocaleString()} <span className="font-normal text-muted-foreground">posts</span>
            </div>
          </div>

          {/* PROFILE INFO */}
          <div className="w-full text-sm space-y-2">
            <p className="font-semibold break-words">{user.name}</p>
            <p className="break-words">{user.bio}</p>
          </div>

          {/* ADDITIONAL INFO */}
          <div className="text-xs items-center text-muted-foreground space-y-1">
            {user.location && (
              <div className="flex gap-1 items-center">
                <MapPinIcon className="size-3 flex-shrink-0" />
                <span className="truncate">{user.location}</span>
              </div>
            )}

            {user.website && (
              <div className="flex gap-1 items-center">
                <LinkIcon className="size-3 flex-shrink-0" />
                <a
                  href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                  className="hover:underline truncate"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}

            <div className="flex gap-1 items-center">
              <CalendarIcon className="size-3 flex-shrink-0" />
              <span>Joined {formattedDate}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileHeader;
