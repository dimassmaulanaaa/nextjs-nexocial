"use client";

import { MessageCircleIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

type CommentButtonProps = {
  isAuthenticated: boolean;
  showComments: boolean;
  commentCount: number;
  onClick: () => void;
};

function CommentButton({ isAuthenticated, showComments, commentCount, onClick }: CommentButtonProps) {
  return (
    <>
      {isAuthenticated ? (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground gap-2 hover:text-blue-500" // Tambahkan gap-2
          onClick={onClick}
        >
          <MessageCircleIcon className={`size-5 ${showComments ? "fill-blue-500 text-blue-500" : ""}`} />
          <span>{commentCount}</span>
        </Button>
      ) : (
        <SignInButton mode="modal">
          <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
            <MessageCircleIcon className="size-5" />
            <span>{commentCount}</span>
          </Button>
        </SignInButton>
      )}
    </>
  );
}

export default CommentButton;
