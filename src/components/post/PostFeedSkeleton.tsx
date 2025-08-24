import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function PostFeedSkeleton() {
  const skeletonItems = Array.from({ length: 2 }, (_, i) => i);

  return (
    <>
      {skeletonItems.map((index) => (
        <Card key={index} className="overflow-hidden mb-5">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex space-x-3 sm:space-x-4">
                <Skeleton className="size-11 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-56" />
                  <Skeleton className="h-5 w-36" />
                </div>
              </div>

              <div className="rounded-lg overflow-hidden">
                <Skeleton className="h-96 w-full" />
              </div>

              <div className="flex items-start justify-between pt-2">
                <div className="flex items-center space-x-5 mx-3">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="size-8 rounded-full" />
                </div>

                <Skeleton className="size-8 rounded-full mx-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="overflow-hidden mb-5">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex space-x-3 sm:space-x-4">
              <Skeleton className="size-11 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-5 w-36" />
              </div>
            </div>

            <div className="flex items-start justify-between pt-2">
              <div className="flex items-center space-x-5 mx-3">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="size-8 rounded-full" />
              </div>

              <Skeleton className="size-8 rounded-full mx-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default PostFeedSkeleton;
