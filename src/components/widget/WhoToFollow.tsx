import Link from "next/link";
import { getSuggestedUsers } from "@/actions/user.action";
import UserAvatar from "@/components/common/UserAvatar";
import FollowButton from "@/components/common/FollowButton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

async function WhoToFollow() {
  const users = await getSuggestedUsers();

  if (users.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary/75">Suggested for you</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex gap-2 items-center justify-between ">
              <div className="flex items-center gap-3">
                <Link href={`/profile/${user.username}`}>
                  <UserAvatar size={9} src={user.image || ""} fallback={(user.name?.charAt(0) ?? "").trim() || "U"} />
                </Link>
                <div className="text-xs">
                  <Link href={`/profile/${user.username}`} className="font-medium cursor-pointer">
                    {user.name}
                  </Link>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <p className="text-muted-foreground">{user._count.followers} followers</p>
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
export default WhoToFollow;
