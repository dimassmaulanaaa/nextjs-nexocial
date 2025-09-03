import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUserId, getUserProfile } from "@/actions/user.action";
import { isFollowing } from "@/actions/follows.action";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileNavigation from "@/components/navigations/ProfileNavigation";

type Props = {
  params: { username: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
    title: `@${user.username} | Nexocial`,
    description: profileDescription,
    keywords: [`${user.username}`, "profile", "social media", "Nexocial", displayName],
    authors: [{ name: displayName, url: `/${user.username}` }],
    openGraph: {
      title: `@${user.username}`,
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
      title: `@${user.username}`,
      description: profileDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/${user.username}`,
    },
  };
}

export default async function ProfileLayout({ params, children }: Props) {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) return;

  const username = decodeURIComponent(params.username);
  const user = await getUserProfile(username);

  if (!user) {
    notFound();
  }

  const isCurrentUserFollowing = await isFollowing(user.id);

  const isOwnProfile = currentUserId === user.id;

  return (
    <div className="xl:col-span-6 w-full max-w-xl space-y-5 mx-auto">
      <ProfileHeader user={user} isOwnProfile={isOwnProfile} initialIsFollowing={isCurrentUserFollowing} />

      <ProfileNavigation username={user.username} />

      {children}
    </div>
  );
}
