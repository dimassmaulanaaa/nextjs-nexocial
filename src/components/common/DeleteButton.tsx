"use client";

import { Trash2Icon } from "lucide-react";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";

type deleteButtonProps = {
  onClick: () => void;
  isLoading: boolean;
};

function DeleteButton({ onClick, isLoading }: deleteButtonProps) {
  return (
    <ConfirmationDialog
      onConfirm={onClick}
      isLoading={isLoading}
      title="Delete this post?"
      description="This action cannot be undone. This will permanently delete your post."
      actionText="Delete"
      variant="destructive"
    >
      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500" aria-label="Delete">
        <Trash2Icon className="size-4" />
      </Button>
    </ConfirmationDialog>
  );
}

export default DeleteButton;
