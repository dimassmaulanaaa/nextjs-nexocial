"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { getNotifications, markNotificationsAsRead } from "@/actions/notification.action";
import NotificationPageSkeleton from "@/components/common/NotificationPageSkeleton";
import UserAvatar from "@/components/common/UserAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type Notifications = Awaited<ReturnType<typeof getNotifications>>;
type Notification = Notifications[number];

function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);

      try {
        const data = await getNotifications();

        setNotifications(data);

        const unreadIds = data.filter((n) => !n.read).map((n) => n.id);

        if (unreadIds.length > 0) await markNotificationsAsRead(unreadIds);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong. Please check your connection and try again"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (isLoading) return <NotificationPageSkeleton />;

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Notifications</CardTitle>
          <span className="text-xs text-muted-foreground">{notifications.filter((n) => !n.read).length} unread</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-13rem)] md:h-[calc(100vh-9.75rem)]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-6 border-b ${!notification.read ? "bg-muted/50" : ""}`}
              >
                <Link href={`/profile/${notification.creator.username}`}>
                  <UserAvatar
                    className="size-8 md:size-10"
                    src={notification.creator.image ?? ""}
                    fallback={notification.creator.username.charAt(0)}
                  />
                </Link>
                <div className={`flex-1 space-y-3 ${notification.type === "FOLLOW" ? "pt-1 md:pt-2" : ""} `}>
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
                        : `commented: ${notification.comment?.content}`}{" "}
                    </span>
                    {/* TIME */}
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  {/* NOTIFICATION CONTENT & IMAGE */}
                  {notification.post && (notification.type === "LIKE" || notification.type === "COMMENT") && (
                    <div className="flex items-start max-h-20 md:max-h-32 p-3 rounded-md text-sm bg-muted-foreground/10">
                      {/* CONTENT */}
                      <p className="line-clamp-3 md:line-clamp-5">{notification.post.content}</p>

                      {/* IMAGE */}
                      {notification.post.image && (
                        <Image
                          src={notification.post.image}
                          alt="Post content"
                          className="rounded-md w-full max-w-[200px] h-auto object-cover"
                        />
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
export default NotificationsPage;
