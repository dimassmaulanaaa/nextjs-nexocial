"use server";

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
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        image: user.imageUrl,
      },
    });

    return dbUser;
  } catch (error) {
    console.error("ERROR in syncUser:", error);
    throw new Error("Failed to sync user with the database");
  }
}

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
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
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 5,
    });

    return suggestedUsers;
  } catch (error) {
    console.error("ERROR in getSuggestedUsers:", error);
    return [];
  }
}
