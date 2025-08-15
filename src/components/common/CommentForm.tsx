"use client";

import { useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { SendIcon } from "lucide-react";
import { createComment } from "@/actions/comment.action";
import SubmitButton from "@/components/common/SubmitButton";
import UserAvatar from "@/components/common/UserAvatar";
import { Textarea } from "@/components/ui/textarea";

type CommentFormProps = {
  postId: string;
};

function CommentForm({ postId }: CommentFormProps) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async () => {
    if (!newComment.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const result = await createComment(postId, newComment);

      if (result.success) {
        setNewComment("");
      } else {
        toast.error(result.error || "Failed to post comment.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex space-x-3">
      <UserAvatar className="size-7 flex-shrink-0" src={user?.imageUrl} fallback={user?.firstName?.charAt(0) || "U"} />
      <div className="flex-1">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px] resize-none"
          disabled={isLoading}
          autoFocus
        />
        <div className="flex justify-end mt-2">
          {user ? (
            <SubmitButton
              size="sm"
              className="flex items-center gap-2 px-3"
              isLoading={isLoading}
              onClick={handleSubmit}
              disabled={!newComment.trim() || isLoading}
            >
              <SendIcon className="size-4" />
              <span>Comment</span>
            </SubmitButton>
          ) : (
            <SignInButton mode="modal" fallbackRedirectUrl="/">
              <SubmitButton size="sm" className="flex items-center gap-2 px-3">
                <SendIcon className="size-4" />
                <span>Comment</span>
              </SubmitButton>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentForm;
