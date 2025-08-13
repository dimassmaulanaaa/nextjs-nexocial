"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { syncUser } from "@/actions/user.action";

type UserDataType = {
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
};

export const useClerkSync = (currentPageUsername?: string) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const previousUserRef = useRef<UserDataType | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleUsernameChange = useCallback(
    async (oldUsername: string | null, newUsername: string | null, currentPageUsername?: string) => {
      if (oldUsername === newUsername || !newUsername) {
        router.refresh();
        return;
      }

      const pathSegments = pathname.split("/").filter(Boolean);
      const isProfilePage = pathSegments.length === 1 && pathSegments[0] !== "";

      if (isProfilePage) {
        const urlUsername = decodeURIComponent(pathSegments[0]);
        const isCurrentUserProfile =
          currentPageUsername === oldUsername || urlUsername === oldUsername || urlUsername === currentPageUsername;

        if (isCurrentUserProfile) {
          setIsRedirecting(true);
          router.replace(`/${newUsername}`);
          redirectTimeoutRef.current = setTimeout(() => {
            setIsRedirecting(false);
          }, 5000);

          return;
        }
      }
      router.refresh();
    },
    [pathname, router]
  );

  useEffect(() => {
    if (!isLoaded || !user || isRedirecting) return;

    const currentUserData: UserDataType = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    };

    const previousUserData = previousUserRef.current;

    if (!previousUserData) {
      previousUserRef.current = currentUserData;
      return;
    }

    const hasChanged =
      currentUserData.username !== previousUserData.username ||
      currentUserData.firstName !== previousUserData.firstName ||
      currentUserData.lastName !== previousUserData.lastName ||
      currentUserData.imageUrl !== previousUserData.imageUrl;

    if (hasChanged) {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(async () => {
        try {
          await syncUser();
          await handleUsernameChange(previousUserData.username, currentUserData.username, currentPageUsername);
        } catch (error) {
          console.error("Error syncing user data:", error);
        }
      }, 3000);

      previousUserRef.current = currentUserData;
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [user, isLoaded, handleUsernameChange, currentPageUsername, isRedirecting]);

  return {
    isRedirecting,
  };
};
