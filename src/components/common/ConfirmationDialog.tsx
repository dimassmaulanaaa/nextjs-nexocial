"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmationDialogProps {
  children: React.ReactNode;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  actionText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

function ConfirmationDialog({
  children,
  onConfirm,
  isLoading = false,
  title = "Are you sure?",
  description = "This action may have consequences. Please confirm you want to proceed.",
  actionText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={variant === "destructive" ? "bg-red-500 hover:bg-red-600" : ""}
          >
            {isLoading ? <LoadingSpinner /> : actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmationDialog;
