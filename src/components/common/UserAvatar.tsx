import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  src?: string;
  fallback: string;
  size?: number;
}

function UserAvatar({ src, fallback, size = 4 }: UserAvatarProps) {
  return (
    <Avatar className={`w-${size} h-${size}`}>
      <AvatarImage src={src || ""} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
