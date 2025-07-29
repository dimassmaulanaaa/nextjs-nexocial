"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon } from "lucide-react";
import { createPost } from "@/actions/post.action";
import SubmitButton from "@/components/common/SubmitButton";
import UserAvatar from "@/components/common/UserAvatar";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function PostUpload() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;

    setIsLoading(true);
    try {
      const result = await createPost(content, imageUrl);

      if (result.success) {
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);
        toast.success("Post created successfully");
      } else {
        toast.error(result.error || "Failed to create post. Please try again");
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
    <Card className="mb-5">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <UserAvatar
              className="size-10"
              src={user?.imageUrl}
              fallback={(user?.firstName?.charAt(0) ?? "") + (user?.lastName?.charAt(0) ?? "").trim() || "U"}
            />
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isLoading}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>

            <SubmitButton
              className="flex items-center gap-2 px-5"
              isLoading={isLoading}
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl) || isLoading}
            >
              <SendIcon className="size-4" />
              <span>Post</span>
            </SubmitButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default PostUpload;
