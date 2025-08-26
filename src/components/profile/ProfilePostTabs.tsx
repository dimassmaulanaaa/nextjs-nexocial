"use client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import { getUserPosts, getUserLikedPosts } from "@/actions/post.action";
import { getUserProfile } from "@/actions/user.action";
import { useClerkSync } from "@/hooks/useClerkSync";
import ProfilePageSkeleton from "@/components/profile/ProfilePageSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PostList = dynamic(() => import("@/components/post/PostList"));

type User = Awaited<ReturnType<typeof getUserProfile>>;
type Posts = Awaited<ReturnType<typeof getUserPosts>>;
type LikedPosts = Awaited<ReturnType<typeof getUserLikedPosts>>;
type ProfilePostTabsProps = {
  currentUserId: string;
  user: NonNullable<User>;
  initialPosts: Posts;
  initialLikedPosts: LikedPosts;
};

function ProfilePostTabs({ currentUserId, user, initialPosts, initialLikedPosts }: ProfilePostTabsProps) {
  const { isRedirecting } = useClerkSync(user.username);

  const fetchUserPosts = useCallback(
    (page: number, pageSize: number) => {
      return getUserPosts(currentUserId, page, pageSize);
    },
    [currentUserId]
  );

  const fetchUserLikedPosts = useCallback(
    (page: number, pageSize: number) => {
      return getUserLikedPosts(currentUserId, page, pageSize);
    },
    [currentUserId]
  );

  if (isRedirecting) return <ProfilePageSkeleton />;

  return (
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
      <TabsContent value="posts" className="mt-6">
        <div className="space-y-6">
          {initialPosts.length > 0 ? (
            <PostList userId={currentUserId} initialPosts={initialPosts} fetcher={fetchUserPosts} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-lg font-medium">No posts yet</p>
              <p className="text-sm mt-2">When you share something, it will appear here</p>
            </div>
          )}
        </div>
      </TabsContent>

      {/* LIKED POSTS */}
      <TabsContent value="likes" className="mt-6">
        <div className="space-y-6">
          {initialPosts.length > 0 ? (
            <PostList userId={currentUserId} initialPosts={initialLikedPosts} fetcher={fetchUserLikedPosts} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-lg font-medium">No liked posts to show</p>
              <p className="text-sm mt-2">Posts you like will appear here</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default ProfilePostTabs;
