import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

function loading() {
  const skeletonItems = Array.from({ length: 3 }, (_, i) => i);

  return (
    <div className="xl:col-span-6 w-full max-w-xl space-y-5 mx-auto">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 gap-6">
          {/* PROFILE HEADER */}
          <Card className="shadow-none border-none">
            <CardContent className="flex flex-wrap justify-center gap-5 md:gap-9 py-5 px-0">
              {/* AVATAR */}
              <Skeleton className="size-16 md:size-20 rounded-full" />

              <div className="flex flex-col max-w-xs md:max-w-sm space-y-3 md:space-y-5">
                {/* USERNAME & SETTINGS BUTTON */}
                <div className="flex justify-between items-center gap-5">
                  <Skeleton className="h-7 w-32" />
                  <Skeleton className="size-7 rounded-full" />
                </div>

                {/* STATS */}
                <div className="flex gap-3 sm:gap-5">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>

                {/* PROFILE INFO */}
                <div className="space-y-3">
                  <Skeleton className="h-5 w-24" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>

                {/* ADDITIONAL INFO */}
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TABS */}
          <div className="space-y-4">
            <div className="flex justify-evenly border-b p-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>

            {/* POSTS */}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default loading;
