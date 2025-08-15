import { Metadata } from "next";
import { getNotifications, markNotificationsAsRead } from "@/actions/notification.action";
import { getCurrentUserId } from "@/actions/user.action";
import NotificationsPageClient from "@/app/notifications/NotificationsPageClient";

export const metadata: Metadata = {
  title: "Notifications | Nexocial",
  description: "View your latest notifications and updates",
};

export default async function NotificationsPageServer() {
  const userId = await getCurrentUserId();
  const notifications = await getNotifications();

  const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);

  if (unreadIds.length > 0) {
    await markNotificationsAsRead(unreadIds);
  }

  const unreadCount = unreadIds.length;

  return (
    <div className="xl:col-span-6 space-y-5">
      <NotificationsPageClient
        initialNotifications={notifications}
        initialUnreadCount={unreadCount}
        currentUserId={userId}
      />
    </div>
  );
}
