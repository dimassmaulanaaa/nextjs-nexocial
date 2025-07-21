import { Loader2Icon } from "lucide-react";

function LoadingSpinner({ size = 4 }: { size?: number }) {
  return (
    <div className="flex justify-center items-center">
      <Loader2Icon className={`size-${size} animate-spin`} />
    </div>
  );
}

export default LoadingSpinner;
