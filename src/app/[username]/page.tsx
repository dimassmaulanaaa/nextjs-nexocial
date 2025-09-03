import { notFound } from "next/navigation";
import { getCurrentUserId, getUserProfile } from "@/actions/user.action";
import { getUserPosts } from "@/actions/post.action";
import PostList from "@/components/post/PostList";

async function UserPostPage({ params }: { params: { username: string } }) {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) return;

  const username = decodeURIComponent(params.username);
  const user = await getUserProfile(username);

  if (!user) return notFound();

  const initialPosts = await getUserPosts(user.id, 1, 5);

  const fetcher = async (page: number, pageSize: number) => {
    "use server";
    return await getUserPosts(user.id, page, pageSize);
  };

  return (
    <div className="mt-5">
      {initialPosts.length > 0 ? (
        <PostList userId={currentUserId} initialPosts={initialPosts} fetcher={fetcher} />
      ) : (
        <section className="text-center py-8 text-muted-foreground" aria-labelledby="posts-heading">
          <h2 id="posts-heading" className="sr-only">
            Post List
          </h2>

          <p className="text-lg font-medium">No posts yet</p>

          <p className="text-sm mt-2">When you share something, it will appear here</p>
        </section>
      )}
    </div>
  );
}

export default UserPostPage;
