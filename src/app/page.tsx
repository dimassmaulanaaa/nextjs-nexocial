import { currentUser } from "@clerk/nextjs/server";
import { syncUser, getCurrentUserId } from "@/actions/user.action";
import { getPosts } from "@/actions/post.action";
import PostFeed from "@/components/post/PostFeed";
import PostUpload from "@/components/post/PostUpload";
import WhoToFollow from "@/components/widget/WhoToFollow";

export default async function Home() {
  const user = await currentUser();

  if (user) await syncUser();

  const userId = await getCurrentUserId();
  const posts = await getPosts();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-10 gap-5">
      <div className="xl:col-span-6 pb-16 md:pb-0">
        {user ? <PostUpload /> : null}

        <div className="space-y-5">
          {posts.map((post) => (
            <PostFeed key={post.id} post={post} userId={userId} />
          ))}
        </div>
      </div>

      <div className="hidden xl:block xl:col-span-4 sticky top-5 self-start">
        <div className="space-y-5">
          <WhoToFollow />
        </div>
      </div>
    </div>
  );
}
