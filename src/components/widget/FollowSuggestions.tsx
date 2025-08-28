import Link from "next/link";
import { getSuggestedUsers } from "@/actions/user.action";
import UserAvatar from "@/components/common/UserAvatar";
import FollowButton from "@/components/common/FollowButton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

async function FollowSuggestions() {
  const users = await getSuggestedUsers();

  if (users.length === 0) return null;

  return (
    <section aria-labelledby="follow-suggestions-heading">
      <h2 id="follow-suggestions-heading" className="sr-only">
        Follow Suggestions
      </h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Suggested for you</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href={`/${user.username}`}>
                  <UserAvatar
                    className="size-10"
                    src={user.image || ""}
                    fallback={(user.username?.charAt(0).toUpperCase() ?? "").trim() || "U"}
                  />
                </Link>

                <div className="space-y-1">
                  <Link href={`/${user.username}`} className="text-sm font-medium cursor-pointer">
                    {user.username}
                  </Link>

                  <p className="text-xs text-muted-foreground">{user.name}</p>
                </div>
              </div>

              <FollowButton targetUserId={user.id} initialIsFollowing={false} />
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
export default FollowSuggestions;
