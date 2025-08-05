"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { toggleFollow } from "@/actions/follows.action";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";

type FollowButtonProps = {
  userId: string;
};

function FollowButton({ userId }: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true);

    try {
      await toggleFollow(userId);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please check your connection and try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button size={"sm"} onClick={handleFollow} disabled={isLoading} className="px-5">
      {isLoading ? <LoadingSpinner /> : "Follow"}
    </Button>
  );
}
export default FollowButton;
