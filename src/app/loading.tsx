import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function loading() {
  const skeletonItems = Array.from({ length: 3 }, (_, i) => i);

  return (
    <>
      <Card className="mb-5">
        <CardContent className="pt-6">
          <div className="space-y-24">
            <div className="flex space-x-4">
              <Skeleton className="size-10 rounded-full" />
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

      {skeletonItems.map((index) => (
        <Card key={index} className="overflow-hidden mb-5">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex space-x-3 sm:space-x-4">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-5 w-52" />
              </div>

              <div className="rounded-lg overflow-hidden">
                <Skeleton className="h-96 w-full" />
              </div>

              <div className="flex items-start justify-between pt-2">
                <div className="flex items-center space-x-5 mx-3">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="size-8 rounded-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default loading;
