import { Metadata } from "next";
import { notFound } from "next/navigation";
import { isFollowing } from "@/actions/follows.action";
import { getUserLikedPosts, getUserPosts } from "@/actions/post.action";
import { getCurrentUserId, getUserProfile } from "@/actions/user.action";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePostTabs from "@/components/profile/ProfilePostTabs";

type Props = {
  params: { username: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
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
        canonical: `${baseUrl}/${user.username}`,
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

  const [initialPosts, initialLikedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id, 1, 5).catch(() => []),
    getUserLikedPosts(user.id, 1, 5).catch(() => []),
    isFollowing(user.id).catch(() => false),
  ]);

  return (
    <div className="xl:col-span-6 w-full max-w-xl space-y-5 mx-auto">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <ProfileHeader user={user} isFollowing={isCurrentUserFollowing} />
          <ProfilePostTabs
            currentUserId={currentUserId}
            user={user}
            initialPosts={initialPosts}
            initialLikedPosts={initialLikedPosts}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfilePageServer;
