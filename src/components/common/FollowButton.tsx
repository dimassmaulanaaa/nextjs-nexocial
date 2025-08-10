"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { toggleFollow } from "@/actions/follows.action";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";

type FollowButtonProps = {
  targetUserId: string;
  initialIsFollowing: boolean;
};

function FollowButton({ targetUserId, initialIsFollowing }: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  const handleFollow = async () => {
    setIsLoading(true);

    try {
      const result = await toggleFollow(targetUserId);

      if (result.success) {
        setIsFollowing((prev) => !prev);
      } else {
        toast.error(result.error || "Failed to follow");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong. Please check your connection and try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size={"sm"}
      className="px-5"
      onClick={handleFollow}
      disabled={isLoading}
      variant={isFollowing ? "outline" : "default"}
    >
      {isLoading ? <LoadingSpinner /> : isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}

export default FollowButton;
