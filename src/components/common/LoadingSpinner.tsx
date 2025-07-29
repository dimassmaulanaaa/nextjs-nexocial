import { Loader2Icon } from "lucide-react";

type LoadingSpinnerProps = {
  size?: number;
};

function LoadingSpinner({ size = 4 }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center items-center px-3">
      <Loader2Icon className={`size-${size} animate-spin`} />
    </div>
  );
}

export default LoadingSpinner;
