import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function PostUploadSkeleton() {
  return (
    <Card className="mb-5">
      <CardContent className="pt-6">
        <div className="space-y-20">
          <div className="flex space-x-4">
            <Skeleton className="size-11 rounded-full" />
            <Skeleton className="h-5 w-36" />
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex">
              <Skeleton className="h-9 w-20 rounded-full" />
            </div>
            <div>
              <Skeleton className="h-9 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PostUploadSkeleton;
