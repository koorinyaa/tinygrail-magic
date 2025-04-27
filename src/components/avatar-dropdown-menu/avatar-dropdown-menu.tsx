import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, getAvatarUrl } from "@/lib/utils";
import { useStore } from "@/store";
import {
  DollarSign,
  LogOutIcon,
  Pencil,
  Ticket
} from "lucide-react";
import { toast } from "sonner";
import { UserAvatar } from "./components/user-avatar";

export function AvatarDropdownMenu() {
  const { userAssets } = useStore();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="size-8">
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <UserAvatar src={getAvatarUrl(userAssets?.avatar)} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 min-w-36">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {userAssets?.nickname}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            余额：₵{formatCurrency(userAssets?.balance || 0)}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => toast.warning("开发中")}>
          <Pencil size={16} className="opacity-60" aria-hidden="true" />
            <span>签到奖励</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.warning("开发中")}>
          <Ticket size={16} className="opacity-60" aria-hidden="true" />
            <span>刮刮乐</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.warning("开发中")}>
          <DollarSign size={16} className="opacity-60" aria-hidden="true" />
            <span>每周分红</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toast.warning("开发中")}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
