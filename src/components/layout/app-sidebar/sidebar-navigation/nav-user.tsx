import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { isEmpty } from '@/lib/utils';

interface NavUserProps {
  user: {
    name: string;
    nickname: string;
    balance: string;
    avatar: string;
  };
}
/**
 * 侧边栏用户信息组件
 * @param {NavUserProps} props
 * @param {string} props.user.name - 用户ID
 * @param {string} props.user.nickname - 用户昵称
 * @param {string} props.user.balance - 用户余额
 * @param {string} props.user.avatar - 用户头像
 */
export function NavUser({ user }: NavUserProps) {
  const { name, nickname, balance, avatar } = user;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={avatar} alt={nickname} />
            <AvatarFallback className="rounded-lg">U</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            {isEmpty(name) ? (
              <span className="truncate font-medium">未登录</span>
            ) : (
              <>
                <span className="truncate font-medium">{nickname}</span>
                <span className="truncate text-xs">余额：₵{balance}</span>
              </>
            )}
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
