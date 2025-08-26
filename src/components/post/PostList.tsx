"use client";

import { memo } from "react";
import { getPosts } from "@/actions/post.action";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import PostFeed from "@/components/post/PostFeed";
import PostFeedSkeleton from "@/components/post/PostFeedSkeleton";

type Post = Awaited<ReturnType<typeof getPosts>>[number];

type PostListProps = {
  userId: string | null;
  initialPosts: Post[];
  fetcher: (page: number, pageSize: number) => Promise<Post[]>;
};

function PostList({ userId, fetcher, initialPosts }: PostListProps) {
  const {
    data: posts,
    isLoading,
    hasMore,
    ref,
  } = useInfiniteScroll<Post>({
    initialData: initialPosts,
    fetcher: fetcher,
    pageSize: 5,
  });

  return (
    <>
      {posts.map((post) => (
        <PostFeed key={post.id} post={post} userId={userId} />
      ))}

      {hasMore && (
        <div ref={ref} className="mt-4">
          {isLoading && <PostFeedSkeleton />}
        </div>
      )}
    </>
  );
}

export default memo(PostList);
