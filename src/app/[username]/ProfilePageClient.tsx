"use client";

import { useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { CalendarIcon, LinkIcon, MapPinIcon, LoaderIcon } from "lucide-react";
import { getUserProfile } from "@/actions/user.action";
import { getUserPosts } from "@/actions/post.action";
import { useClerkSync } from "@/hooks/useClerkSync";
import FollowButton from "@/components/common/FollowButton";
import ModeToggle from "@/components/common/ModeToggle";
import UserAvatar from "@/components/common/UserAvatar";
import ProfilePostsList from "@/components/profile/ProfilePostsList";
import ProfileSettingsMenu from "@/components/profile/ProfileSettingsMenu";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type User = Awaited<ReturnType<typeof getUserProfile>>;
type Posts = Awaited<ReturnType<typeof getUserPosts>>;
type ProfilePageClientProps = {
  currentUserId: string;
  user: NonNullable<User>;
  posts: Posts;
  likedPosts: Posts;
  isFollowing: boolean;
};

function ProfilePageClient({ currentUserId, user, posts, likedPosts, isFollowing }: ProfilePageClientProps) {
  const { user: currentUser } = useUser();

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

  if (isRedirecting) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <LoaderIcon className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Updating profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        {/* PROFILE HEADER */}
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
                <p className="font-semibold">{user.name || user.username}</p>

                {user.bio && <p className="break-words">{user.bio}</p>}
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

        {/* TABS */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full justify-evenly border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="posts"
              className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
              data-[state=active]:bg-transparent data-[state=active]:shadow-none px-7 text-base font-semibold"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
              data-[state=active]:bg-transparent data-[state=active]:shadow-none px-7 text-base font-semibold"
            >
              Likes
            </TabsTrigger>
          </TabsList>

          {/* POSTS */}
          <TabsContent value="posts" className="mt-5">
            <ProfilePostsList posts={posts} userId={currentUserId} type="posts" />
          </TabsContent>

          {/* LIKED POSTS */}
          <TabsContent value="likes" className="mt-5">
            <ProfilePostsList posts={likedPosts} userId={currentUserId} type="likes" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProfilePageClient;
