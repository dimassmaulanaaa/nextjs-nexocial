import { Metadata } from "next";
import { getNotifications, markNotificationsAsRead } from "@/actions/notification.action";
import NotificationsPageClient from "@/app/notifications/NotificationsPageClient";

export const metadata: Metadata = {
  title: "Nexocial",
  description: "View your latest notifications and updates",
};

export default async function NotificationsPageServer() {
  const notifications = await getNotifications();

  const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);

  if (unreadIds.length > 0) {
    await markNotificationsAsRead(unreadIds);
  }

  const unreadCount = unreadIds.length;

  return <NotificationsPageClient initialNotifications={notifications} initialUnreadCount={unreadCount} />;
}
