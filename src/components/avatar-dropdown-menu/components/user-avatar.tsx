import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

/**
 * 头像
 * @param src 头像地址
 * @returns
 */
export function UserAvatar({src}: {src: string}) {
  return (
    <Avatar>
      <AvatarImage src={src} alt="avatar" />
      <AvatarFallback>u</AvatarFallback>
    </Avatar>
  )
}