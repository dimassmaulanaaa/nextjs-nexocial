"use client";

import { SignInButton } from "@clerk/nextjs";
import { HeartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type LikeButtonProps = {
  isAuthenticated: boolean;
  hasLiked: boolean;
  optimisticLikes: number;
  onClick: () => void;
};

function LikeButton({ isAuthenticated, hasLiked, optimisticLikes, onClick }: LikeButtonProps) {
  return (
    <>
      {isAuthenticated ? (
        <Button
          variant="ghost"
          size="sm"
          className={`text-muted-foreground ${hasLiked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"}`}
          onClick={onClick}
        >
          {hasLiked ? <HeartIcon className="size-5 fill-current" /> : <HeartIcon className="size-5" />}
          <span>{optimisticLikes}</span>
        </Button>
      ) : (
        <SignInButton mode="modal" fallbackRedirectUrl="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <HeartIcon className="size-5" />
            <span>{optimisticLikes}</span>
          </Button>
        </SignInButton>
      )}
    </>
  );
}

export default LikeButton;
