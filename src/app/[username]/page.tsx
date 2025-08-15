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
    title: `@${user.username} | Nexocial`,
    description: user.bio || `Check out ${user.name || user.username}'s profile`,
    openGraph: {
      title: `@${user.username} | Nexocial`,
      description: user.bio || `Check out ${user.name || user.username}'s profile`,
      images: user.image ? [{ url: user.image }] : [],
    },
  };
}

async function ProfilePageServer({ params }: Props) {
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
    <div className="xl:col-span-6 space-y-5">
      <ProfilePageClient
        currentUserId={currentUserId}
        user={user}
        posts={posts}
        likedPosts={likedPosts}
        isFollowing={isCurrentUserFollowing}
      />
    </div>
  );
}

export default ProfilePageServer;
