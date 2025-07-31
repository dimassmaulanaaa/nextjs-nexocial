"use server";

import prisma from "@/lib/prisma";
import { getCurrentUserId } from "./user.action";

export async function getNotifications() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) return [];

    const notifications = await prisma.notification.findMany({
      where: {
        receiverId: userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            image: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications;
  } catch (error) {
    console.error("Error in getNotifications:", error);
    throw new Error("Failed to fetch notifications");
  }
}

export async function markNotificationsAsRead(notificationIds: string[]) {
  try {
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
      },
      data: {
        read: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error in markNotificationsAsRead:", error);
    return { success: false, error: "Failed to marking notifications as read" };
  }
}
