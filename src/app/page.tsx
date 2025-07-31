import { currentUser } from "@clerk/nextjs/server";
import { syncUser, getCurrentUserId } from "@/actions/user.action";
import { getPosts } from "@/actions/post.action";
import PostFeed from "@/components/post/PostFeed";
import PostUpload from "@/components/post/PostUpload";

export default async function Home() {
  const user = await currentUser();

  if (user) await syncUser();

  const userId = await getCurrentUserId();
  const posts = await getPosts();

  return (
    <>
      {user ? <PostUpload /> : null}

      <div className="space-y-5">
        {posts.map((post) => (
          <PostFeed key={post.id} post={post} userId={userId} />
        ))}
      </div>
    </>
  );
}
