"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import { type ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = ButtonProps & {
  isLoading?: boolean;
};

function SubmitButton({ children, isLoading, ...props }: SubmitButtonProps) {
  return (
    <Button {...props} disabled={props.disabled || isLoading}>
      {isLoading ? <LoadingSpinner /> : <>{children}</>}
    </Button>
  );
}

export default SubmitButton;
