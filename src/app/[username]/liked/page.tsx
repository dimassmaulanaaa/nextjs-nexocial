import { notFound } from "next/navigation";
import { getCurrentUserId, getUserProfile } from "@/actions/user.action";
import { getUserLikedPosts } from "@/actions/post.action";
import PostList from "@/components/post/PostList";

async function UserLikedPostsPage({ params }: { params: { username: string } }) {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) return;

  const username = decodeURIComponent(params.username);
  const user = await getUserProfile(username);

  if (!user) return notFound();

  const initialLikedPosts = await getUserLikedPosts(user.id, 1, 5);

  const fetcher = async (page: number, pageSize: number) => {
    "use server";
    return await getUserLikedPosts(user.id, page, pageSize);
  };

  return (
    <div className="mt-5">
      {initialLikedPosts.length > 0 ? (
        <PostList userId={currentUserId} initialPosts={initialLikedPosts} fetcher={fetcher} />
      ) : (
        <section className="text-center py-8 text-muted-foreground" aria-labelledby="liked-posts-heading">
          <h2 id="liked-posts-heading" className="sr-only">
            Liked Post List
          </h2>

          <p className="text-lg font-medium">No liked posts to show</p>

          <p className="text-sm mt-2">Posts you like will appear here</p>
        </section>
      )}
    </div>
  );
}

export default UserLikedPostsPage;
