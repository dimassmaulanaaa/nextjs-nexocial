import PostUploadSkeleton from "@/components/post/PostUploadSkeleton";
import PostFeedSkeleton from "@/components/post/PostFeedSkeleton";

function loading() {
  return (
    <div className="xl:col-span-6 w-full max-w-xl space-y-5 mx-auto">
      <PostUploadSkeleton />
      <PostFeedSkeleton />
    </div>
  );
}

export default loading;
