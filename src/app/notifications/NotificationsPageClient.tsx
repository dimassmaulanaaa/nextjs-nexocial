"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { getNotifications } from "@/actions/notification.action";
import UserAvatar from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePusher } from "@/hooks/usePusher";

type Notifications = Awaited<ReturnType<typeof getNotifications>>;
type NotificationsPageClientProps = {
  initialNotifications: Notifications;
  initialUnreadCount: number;
  currentUserId: string | null;
};

function NotificationsPageClient({ initialNotifications, initialUnreadCount, currentUserId }: NotificationsPageClientProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const { isConnected, bindEvent, unbindEvent } = usePusher({
    userId: currentUserId,
  });

  useEffect(() => {
    if (!isConnected) return;

    const handleNewNotification = async () => {
      try {
        const updatedNotifications = await getNotifications();
        setNotifications(updatedNotifications);

        const newUnreadCount = updatedNotifications.filter((n) => !n.read).length;
        setUnreadCount(newUnreadCount);
      } catch (error) {
        console.error("Error refreshing notifications:", error);
      }
    };

    bindEvent("notification:new", handleNewNotification);

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      unbindEvent("notification:new");
    };
  }, [isConnected, bindEvent, unbindEvent]);

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Notifications</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-gray-400"}`} />
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-13rem)] md:h-[calc(100vh-9.75rem)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No new notifications</h3>
              <p className="text-sm text-muted-foreground">When someone interacts with you, it&apos;ll appear here.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-6 border-b transition-colors duration-200 ${
                  !notification.read ? "bg-muted/50" : ""
                }`}
              >
                <Link href={`/profile/${notification.creator.username}`}>
                  <UserAvatar
                    className="size-8 md:size-10"
                    src={notification.creator.image ?? ""}
                    fallback={notification.creator.username.charAt(0)}
                  />
                </Link>
                <div className={`flex-1 space-y-3 ${notification.type === "FOLLOW" ? "pt-1 md:pt-2" : ""}`}>
                  {/* NOTIFICATION HEADER */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0">
                    {/* USERNAME */}
                    <Link href={`/profile/${notification.creator.username}`}>
                      <span className="font-semibold truncate">{notification.creator.username}</span>
                    </Link>
                    {/* MESSAGE */}
                    <span className="text-sm text-foreground">
                      {notification.type === "FOLLOW"
                        ? "started following you"
                        : notification.type === "LIKE"
                        ? "liked your post"
                        : `commented: ${notification.comment?.content}`}
                    </span>
                    {/* TIME */}
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  {/* NOTIFICATION CONTENT & IMAGE */}
                  {notification.post && (notification.type === "LIKE" || notification.type === "COMMENT") && (
                    <div className="grid grid-cols-12 sm:grid-cols-6 gap-3 p-3 items-start rounded-md text-sm bg-muted-foreground/10">
                      {/* CONTENT */}
                      <p className="col-span-9 sm:col-span-5 line-clamp-3 sm:line-clamp-4">{notification.post.content}</p>

                      {/* IMAGE */}
                      {notification.post.image && (
                        <div className="col-span-3 sm:col-span-1 relative self-center aspect-square size-auto rounded-lg bg-foreground/5">
                          <Image
                            src={notification.post.image}
                            alt={`Content image ${notification.post.id}`}
                            className="rounded-md object-contain"
                            fill
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default NotificationsPageClient;
