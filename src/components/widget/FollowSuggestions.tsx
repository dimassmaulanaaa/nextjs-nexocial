import Link from "next/link";
import { getSuggestedUsers } from "@/actions/user.action";
import UserAvatar from "@/components/common/UserAvatar";
import FollowButton from "@/components/common/FollowButton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

async function FollowSuggestions() {
  const users = await getSuggestedUsers();

  if (users.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Suggested for you</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5 pb-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between ">
              <div className="flex items-center gap-4">
                <Link href={`/profile/${user.username}`}>
                  <UserAvatar
                    className="size-10"
                    src={user.image || ""}
                    fallback={(user.name?.charAt(0) ?? "").trim() || "U"}
                  />
                </Link>
                <div className="space-y-1">
                  <Link href={`/profile/${user.username}`} className="text-sm font-medium cursor-pointer">
                    {user.username}
                  </Link>
                  <p className="text-xs text-muted-foreground">{user.name}</p>
                </div>
              </div>
              <FollowButton userId={user.id} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
export default FollowSuggestions;
