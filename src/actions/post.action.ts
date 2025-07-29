"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/actions/user.action";

export async function createPost(content: string, image: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) throw new Error("Authentication required. Please log in");

    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: userId,
      },
    });

    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    console.error("ERROR in createPost:", error);
    return { success: false, error: "An unexpected error occurred. Please try again" };
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.error("ERROR in getPosts:", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function deletePost(postId: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) throw new Error("Authentication required. Please log in");

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found");

    if (post.authorId !== userId) throw new Error("Unauthorized. No delete permission");

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("ERROR in deletePost:", error);
    return { success: false, error: "Failed to delete post" };
  }
}
