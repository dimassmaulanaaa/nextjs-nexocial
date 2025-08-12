"use server";

import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) throw new Error("Authentication required. Please log in");

    const dbUser = await prisma.user.upsert({
      where: {
        clerkId: userId,
      },
      update: {
        username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        image: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
      create: {
        clerkId: userId,
        username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        image: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return dbUser;
  } catch (error) {
    console.error("ERROR in syncUser:", error);
    throw new Error("Failed to sync user with the database");
  }
}

export async function getCurrentUserId() {
  const { userId: clerkId } = await auth();

  if (!clerkId) return null;

  const user = await prisma.user.findUnique({
    where: {
      clerkId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.id;
}

export async function getSuggestedUsers() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return [];
    }

    const suggestedUsers = await prisma.user.findMany({
      where: {
        AND: [
          {
            NOT: {
              id: userId,
            },
          },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
      },
      take: 5,
    });

    return suggestedUsers;
  } catch (error) {
    console.error("ERROR in getSuggestedUsers:", error);
    return [];
  }
}

export async function getUserProfile(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        image: true,
        location: true,
        website: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    throw new Error("Failed to fetch profile");
  }
}

export async function updateUserProfile(formData: FormData) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) throw new Error("Unauthorized");

    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const website = formData.get("website") as string;

    const user = await prisma.user.update({
      where: { clerkId },
      data: {
        bio,
        location,
        website,
      },
    });

    revalidatePath("/profile");
    return { success: true, user };
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
