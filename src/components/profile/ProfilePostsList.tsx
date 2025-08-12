"use client";

import { getPosts } from "@/actions/post.action";
import PostFeed from "@/components/post/PostFeed";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type ProfilePostsList = {
  posts: Posts;
  userId: string;
  type: "posts" | "likes";
};
function ProfilePostsList({ posts, userId, type }: ProfilePostsList) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">{type === "posts" ? "No posts yet" : "No liked posts to show"}</p>
        <p className="text-sm mt-2">
          {type === "posts" ? "When you share something, it will appear here." : "Posts you like will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostFeed key={post.id} post={post} userId={userId} />
      ))}
    </div>
  );
}

export default ProfilePostsList;
