import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type UserAvatarProps = {
  className?: string;
  src?: string;
  fallback?: string;
};

function UserAvatar({ className = "size-8", src, fallback = "U" }: UserAvatarProps) {
  return (
    <Avatar className={`${className}`}>
      <AvatarImage src={src || ""} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
