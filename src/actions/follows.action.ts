"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { getCurrentUserId } from "@/actions/user.action";

export async function toggleFollow(targetUserId: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) throw new Error("Authentication required. Please log in");

    if (userId === targetUserId) throw new Error("You can't follow your own account");

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      });
    } else {
      const follow = await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
          },
        }),

        prisma.notification.create({
          data: {
            type: "FOLLOW",
            receiverId: targetUserId,
            creatorId: userId,
          },
        }),
      ]);

      if (follow && targetUserId !== userId) {
        try {
          await pusherServer.trigger(`${targetUserId}-notification`, "notification:new", {});
        } catch (pusherError) {
          console.error("Failed to send real-time notification:", pusherError);
        }
      }
    }

    revalidatePath("/");
    revalidatePath(`/${targetUserId}`);
    return { success: true };
  } catch (error) {
    console.error("ERROR in toggleFollow:", error);
    return { success: false, error: "Error toggling follow" };
  }
}

export async function isFollowing(targetUserId: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) return false;

    const follow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    return !!follow;
  } catch (error) {
    console.error("Error in isFollowing:", error);
    return false;
  }
}
