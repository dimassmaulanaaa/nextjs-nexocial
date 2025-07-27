"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { getPosts, deletePost } from "@/actions/post.action";
import { toggleLike } from "@/actions/like.action";
import CommentButton from "@/components/common/CommentButton";
import CommentForm from "@/components/common/CommentForm";
import CommentList from "@/components/common/CommentList";
import LikeButton from "@/components/common/LikeButton";
import DeleteButton from "@/components/common/DeleteButton";
import UserAvatar from "@/components/common/UserAvatar";
import { Card, CardContent } from "@/components/ui/card";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];
type PostFeedProps = {
  post: Post;
  userId: string | null;
};

function PostFeed({ post, userId }: PostFeedProps) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(post.likes.some((like) => like.userId === userId));
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (isLoading) return;

    const previousLikedState = hasLiked;
    const previousLikesCount = optimisticLikes;

    try {
      setIsLoading(true);

      const newLikedState = !previousLikedState;
      const newLikesCount = previousLikedState ? previousLikesCount - 1 : previousLikesCount + 1;

      setHasLiked(newLikedState);
      setOptimisticLikes(newLikesCount);

      const result = await toggleLike(post.id);

      if (!result.success) {
        setHasLiked(previousLikedState);
        setOptimisticLikes(previousLikesCount);

        toast.error(result?.error || "Failed to toggle like");
      }
    } catch (error) {
      setHasLiked(previousLikedState);
      setOptimisticLikes(previousLikesCount);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong. Please check your connection and try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const result = await deletePost(post.id);
      if (result.success) toast.success("Post deleted successfully");
      else throw new Error(result.error);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong. Please check your connection and try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* HEADER & CONTENT */}
          <div className="flex space-x-3 sm:space-x-4">
            <Link href={`/profile/${post.author.username}`}>
              <UserAvatar
                className="size-8 sm:size-9"
                src={post.author.image ?? ""}
                fallback={(post.author.name?.charAt(0) ?? "").trim() || "U"}
              />
            </Link>

            {/* POST HEADER & TEXT CONTENT */}
            <div className="flex-1 min-w-0">
              {/* POST HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 truncate">
                <div className="flex items-center space-x-2">
                  <Link href={`/profile/${post.author.username}`} className="font-semibold truncate">
                    {post.author.username}
                  </Link>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                </div>
              </div>

              {/* TEXT CONTENT */}
              <p className="mt-2 text-sm text-foreground break-words">{post.content}</p>
            </div>
          </div>

          {/* IMAGE CONTENT */}
          {post.image && (
            <div className="rounded-lg overflow-hidden">
              <Image src={post.image} alt="Post content" width={500} height={300} className="w-full h-auto object-cover" />{" "}
            </div>
          )}

          {/* LIKE, COMMENT, N DELETE BUTTONS */}
          <div className="flex items-start justify-between pt-2">
            <div className="flex items-center space-x-1">
              {/* LIKE */}
              <LikeButton
                isAuthenticated={!!user}
                hasLiked={hasLiked}
                optimisticLikes={optimisticLikes}
                onClick={handleLike}
              />
              {/* COMMENT */}
              <CommentButton
                isAuthenticated={!!user}
                showComments={showComments}
                commentCount={post.comments.length}
                onClick={() => setShowComments((prev) => !prev)}
              />{" "}
            </div>

            {/* DELETE */}
            {userId === post.author.id && <DeleteButton onClick={handleDelete} isLoading={isLoading} />}
          </div>

          {/* COMMENT SECTION */}
          {showComments && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <CommentList key={comment.id} comment={comment} />
                ))}
              </div>

              <CommentForm postId={post.id} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PostFeed;
