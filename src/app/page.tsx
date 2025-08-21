import { currentUser } from "@clerk/nextjs/server";
import { syncUser, getCurrentUserId } from "@/actions/user.action";
import { getPosts } from "@/actions/post.action";
import PostFeed from "@/components/post/PostFeed";
import PostUpload from "@/components/post/PostUpload";
import FollowSuggestions from "@/components/widget/FollowSuggestions";

export default async function Home() {
  const user = await currentUser();

  if (user) await syncUser();

  const userId = await getCurrentUserId();
  const posts = await getPosts();

  return (
    <>
      <div className="xl:col-span-6 w-full max-w-xl space-y-5 mx-auto">
        {user ? <PostUpload /> : null}
        {posts.map((post) => (
          <PostFeed key={post.id} post={post} userId={userId} />
        ))}
      </div>

      <div className="hidden xl:block xl:col-span-4 sticky top-5 self-start">
        <div className="space-y-5">
          <FollowSuggestions />
        </div>
      </div>
    </>
  );
}
