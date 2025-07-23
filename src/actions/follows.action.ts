import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
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
      await prisma.$transaction([
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
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("ERROR in toggleFollow:", error);
    return { success: false, error: "Error toggling follow" };
  }
}
