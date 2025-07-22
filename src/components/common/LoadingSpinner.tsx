import { Loader2Icon } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
}

function LoadingSpinner({ size = 4 }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center items-center">
      <Loader2Icon className={`size-${size} animate-spin`} />
    </div>
  );
}

export default LoadingSpinner;
