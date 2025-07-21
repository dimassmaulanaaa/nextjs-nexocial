"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/actions/user.action";

export async function createPost(content: string, image: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      throw new Error("Authentication required. Please log in");
    }

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
