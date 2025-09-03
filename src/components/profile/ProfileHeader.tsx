import { format } from "date-fns";
import { CalendarIcon, LinkIcon, MapPinIcon } from "lucide-react";
import { getUserProfile } from "@/actions/user.action";
import FollowButton from "@/components/common/FollowButton";
import ModeToggle from "@/components/common/ModeToggle";
import UserAvatar from "@/components/common/UserAvatar";
import ProfileSettingsMenu from "@/components/profile/ProfileSettingsMenu";
import { Card, CardContent } from "@/components/ui/card";

type User = Awaited<ReturnType<typeof getUserProfile>>;
type ProfileHeaderProps = {
  user: NonNullable<User>;
  isOwnProfile: boolean;
  initialIsFollowing: boolean;
};

function ProfileHeader({ user, isOwnProfile, initialIsFollowing }: ProfileHeaderProps) {
  const formattedDate = format(new Date(user.createdAt), "MMMM yyyy");

  return (
    <section aria-labelledby="profile-heading">
      <h2 id="profile-heading" className="sr-only">
        User Profile
      </h2>

      <Card className="shadow-none border-none">
        <CardContent className="flex flex-wrap justify-center gap-5 md:gap-9 py-5 px-0">
          <UserAvatar
            className="size-16 md:size-20"
            src={user.image ?? ""}
            fallback={user.username.charAt(0).toUpperCase()}
          />

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
                <FollowButton targetUserId={user.id} initialIsFollowing={initialIsFollowing} />
              )}
            </div>

            {/* STATS */}
            <div className="flex gap-3 sm:gap-5 pr-5 md:pr-11 font-semibold">
              <div>
                {user._count.following.toLocaleString()} <span className="font-normal text-muted-foreground">following</span>
              </div>
              <div>
                {user._count.followers.toLocaleString()} <span className="font-normal text-muted-foreground">followers</span>
              </div>
              <div>
                {user._count.posts.toLocaleString()} <span className="font-normal text-muted-foreground">posts</span>
              </div>
            </div>

            {/* PROFILE INFO */}
            <div className="w-full text-sm space-y-2">
              <p className="font-semibold break-words">{user.name}</p>
              <p className="break-words whitespace-pre-wrap">{user.bio}</p>
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
                <span className="truncate">Joined {formattedDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default ProfileHeader;
