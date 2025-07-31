import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

function NotificationSkeleton() {
  const skeletonItems = Array.from({ length: 7 }, (_, i) => i);

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Notifications</CardTitle>
          <Skeleton className="h-4 w-20" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-13rem)] md:h-[calc(100vh-9.75rem)]">
          {skeletonItems.map((index) => (
            <div key={index} className="flex items-start gap-4 p-6 border-b">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20 md:w-28" />
                  <Skeleton className="h-4 w-40 md:w-60" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-32 md:w-full" />
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default NotificationSkeleton;
