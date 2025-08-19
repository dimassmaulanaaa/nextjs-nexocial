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
  try {
    const username = decodeURIComponent(params.username);
    const user = await getUserProfile(username);

    if (!user) {
      return {
        title: "User Not Found | Nexocial",
        description: "The requested user profile could not be found on Nexocial.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const displayName = user.name || user.username;
    const profileDescription = user.bio || `Check out ${displayName}'s profile on Nexocial`;
    const imageUrl = user.image || "U";

    return {
      title: `(@${user.username}) | Nexocial`,
      description: profileDescription,
      keywords: [`${user.username}`, "profile", "social media", "Nexocial", displayName],
      authors: [{ name: displayName, url: `/${user.username}` }],
      openGraph: {
        title: `(@${user.username})`,
        description: profileDescription,
        type: "profile",
        images: [
          {
            url: imageUrl,
            width: 400,
            height: 400,
            alt: `${displayName}'s profile picture`,
          },
        ],
        url: `/${user.username}`,
        siteName: "Nexocial",
      },
      twitter: {
        card: "summary",
        title: `(@${user.username})`,
        description: profileDescription,
        images: [imageUrl],
      },
      alternates: {
        canonical: `/${user.username}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Profile | Nexocial",
      description: "User profile on Nexocial",
    };
  }
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
