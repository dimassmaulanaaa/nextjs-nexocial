"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { getCurrentUserId } from "@/actions/user.action";

export async function createComment(postId: string, content: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) throw new Error("Authentication required. Please log in");

    if (!content) throw new Error("Content is required");

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found");

    const [comment] = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          content: content.trim(),
          authorId: userId,
          postId,
        },
      });

      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            type: "COMMENT",
            receiverId: post.authorId,
            creatorId: userId,
            postId,
            commentId: newComment.id,
          },
        });
      }

      return [newComment];
    });

    if (comment && post.authorId !== userId) {
      try {
        await pusherServer.trigger(`${post.authorId}-notification`, "notification:new", {});
      } catch (pusherError) {
        console.error("Failed to send real-time notification:", pusherError);
      }
    }

    revalidatePath(`/`);
    return { success: true, comment };
  } catch (error) {
    console.error("Error in createComment:", error);
    return { success: false, error: "Failed to create comment" };
  }
}
