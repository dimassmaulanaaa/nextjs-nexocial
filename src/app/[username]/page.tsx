import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUserId, getUserProfile } from "@/actions/user.action";
import { getUserLikedPosts, getUserPosts } from "@/actions/post.action";
import { isFollowing } from "@/actions/follows.action";
import ProfilePageClient from "@/app/[username]/ProfilePageClient";

type Props = {
  params: { username: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await getUserProfile(params.username);

  if (!user) {
    return {
      title: "User Not Found",
      description: "The requested user profile could not be found.",
    };
  }

  return {
    title: `Nexocial (@${user.username})`,
    description: user.bio || `Check out ${user.name || user.username}'s profile`,
    openGraph: {
      title: `Nexocial (@${user.username})`,
      description: user.bio || `Check out ${user.name || user.username}'s profile`,
      images: user.image ? [{ url: user.image }] : [],
    },
  };
}

async function ProfilePageServer({ params }: Props) {
  try {
    const currentUserId = await getCurrentUserId();

    if (!currentUserId) return;

    const username = decodeURIComponent(params.username);
    const user = await getUserProfile(username);

    if (!user) {
      notFound();
    }

    const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
      getUserPosts(user.id).catch(() => []),
      getUserLikedPosts(user.id).catch(() => []),
      isFollowing(user.id).catch(() => false),
    ]);

    return (
      <ProfilePageClient
        currentUserId={currentUserId}
        user={user}
        posts={posts}
        likedPosts={likedPosts}
        isFollowing={isCurrentUserFollowing}
      />
    );
  } catch (error) {
    console.error("Error in ProfilePage:", error);
    notFound();
  }
}

export default ProfilePageServer;
