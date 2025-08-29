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
      return getUserPosts(user.id, page, pageSize);
    },
    [user.id]
  );

  const fetchUserLikedPosts = useCallback(
    (page: number, pageSize: number) => {
      return getUserLikedPosts(user.id, page, pageSize);
    },
    [user.id]
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
      <TabsContent value="posts" className="mt-5">
        {initialPosts.length > 0 ? (
          <PostList userId={currentUserId} initialPosts={initialPosts} fetcher={fetchUserPosts} />
        ) : (
          <section className="text-center py-8 text-muted-foreground" aria-labelledby="posts-heading">
            <h2 id="posts-heading" className="sr-only">
              Post List
            </h2>

            <p className="text-lg font-medium">No posts yet</p>

            <p className="text-sm mt-2">When you share something, it will appear here</p>
          </section>
        )}
      </TabsContent>

      {/* LIKED POSTS */}
      <TabsContent value="likes" className="mt-5">
        {initialPosts.length > 0 ? (
          <PostList userId={currentUserId} initialPosts={initialLikedPosts} fetcher={fetchUserLikedPosts} />
        ) : (
          <section className="text-center py-8 text-muted-foreground" aria-labelledby="liked-posts-heading">
            <h2 id="liked-posts-heading" className="sr-only">
              Liked Post List
            </h2>

            <p className="text-lg font-medium">No liked posts to show</p>

            <p className="text-sm mt-2">Posts you like will appear here</p>
          </section>
        )}
      </TabsContent>
    </Tabs>
  );
}

export default ProfilePostTabs;
