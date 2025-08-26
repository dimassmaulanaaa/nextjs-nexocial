import { currentUser } from "@clerk/nextjs/server";
import { syncUser, getCurrentUserId } from "@/actions/user.action";
import { getPosts } from "@/actions/post.action";
import PostList from "@/components/post/PostList";
import PostUpload from "@/components/post/PostUpload";
import FollowSuggestions from "@/components/widget/FollowSuggestions";

export default async function Home() {
  const user = await currentUser();

  if (user) await syncUser();

  const userId = await getCurrentUserId();
  const initialPosts = await getPosts(1, 5);

  return (
    <>
      <div className="xl:col-span-6 w-full max-w-xl space-y-5 mx-auto">
        {user ? <PostUpload /> : null}

        <PostList userId={userId} fetcher={getPosts} initialPosts={initialPosts} />
      </div>

      <div className="hidden xl:block xl:col-span-4 sticky top-5 self-start">
        <div className="space-y-5">
          <FollowSuggestions />
        </div>
      </div>
    </>
  );
}
