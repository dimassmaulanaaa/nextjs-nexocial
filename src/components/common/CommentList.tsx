"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getPosts } from "@/actions/post.action";
import UserAvatar from "@/components/common/UserAvatar";

type Posts = Awaited<ReturnType<typeof getPosts>>[number];
type PostComment = Posts["comments"][number];

type CommentListProps = {
  comment: PostComment;
};

function CommentList({ comment }: CommentListProps) {
  return (
    <div className="flex space-x-3">
      <Link href={`/profile/${comment.author.username}`}>
        <UserAvatar
          className="size-7 flex-shrink-0"
          src={comment.author.image ?? ""}
          fallback={comment.author.name?.charAt(0).toUpperCase() || "U"}
        />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link href={`/profile/${comment.author.username}`} className="font-medium text-sm">
            {comment.author.username}
          </Link>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
        </div>
        <p className="text-sm break-words">{comment.content}</p>
      </div>
    </div>
  );
}

export default CommentList;
