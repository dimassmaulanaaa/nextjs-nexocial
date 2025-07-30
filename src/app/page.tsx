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
    <section className="grid grid-cols-1 xl:grid-cols-10 gap-5 mb-3">
      <div className="xl:col-span-6">
        {user ? <PostUpload /> : null}

        <div className="space-y-5">
          {posts.map((post) => (
            <PostFeed key={post.id} post={post} userId={userId} />
          ))}
        </div>
      </div>

      <div className="hidden xl:block xl:col-span-4 sticky top-5 self-start">
        <div className="space-y-5">
          <FollowSuggestions />
        </div>
      </div>
    </section>
  );
}
