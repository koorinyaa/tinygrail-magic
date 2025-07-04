import { GM_addStyle } from '$';
import { Tinygrail } from '@/components/icons';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { formatCurrency, getAvatarUrl, isEmpty } from '@/lib/utils';
import { useStore } from '@/store';
import {
  BadgeCent,
  ChartNoAxesColumn,
  CircleUserRound,
  ExternalLink,
  Images,
  Sparkles,
  TicketPlus,
  Trophy,
} from 'lucide-react';
import {
  NavFooter,
  NavProjects,
  NavSecondary,
  NavUpdate,
} from './sidebar-navigation';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userAssets, updateInfo } = useStore();
  const currentPath =
    typeof window !== 'undefined' ? window.location.pathname : '';

  const data = {
    navPages: {
      groupName: 'Pages',
      items: [
        {
          name: '每周萌王',
          id: 'topWeek',
          icon: Trophy,
        },
        {
          name: '通天塔',
          id: 'starTower',
          icon: Sparkles,
        },
        {
          name: '角色',
          id: 'character',
          icon: BadgeCent,
        },
        {
          name: 'ICO',
          id: 'ico',
          icon: TicketPlus,
        },
        {
          name: '排行榜',
          id: 'ranking',
          icon: ChartNoAxesColumn,
        },
        {
          name: '最新圣殿',
          id: 'lastTemples',
          icon: Images,
        },
      ],
    },
    navAccount: {
      groupName: 'Account',
      items: [
        {
          name: userAssets ? `${userAssets.nickname}的小圣杯` : '我的小圣杯',
          id: 'my-tinygrail',
          icon: CircleUserRound,
        },
        // {
        //   name: '设置',
        //   id: 'settings',
        //   icon: Settings,
        // },
      ],
    },
    navSecondary: [
      {
        title: 'fuyuake',
        url: 'https://fuyuake.top',
        target: '_blank',
        icon: ExternalLink,
      },
      {
        title: '返回bangumi',
        url: currentPath,
        icon: ExternalLink,
      },
    ],
    user: {
      name: userAssets?.name || '',
      nickname: userAssets?.nickname || '',
      balance: formatCurrency(userAssets?.balance || 0),
      avatar: getAvatarUrl(userAssets?.avatar || ''),
    },
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent active:bg-transparent"
              asChild
            >
              <div>
                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Tinygrail className="size-full" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">小圣杯</span>
                  <span className="truncate text-xs">
                    TinyGrail Exchange Plugin
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.navPages} />
        <NavProjects projects={data.navAccount} />
        <div className="mt-auto">
          <NavSecondary items={data.navSecondary} />
          {/* 只有油猴环境显示更新 */}
          {!isEmpty(GM_addStyle) && updateInfo?.hasUpdate && (
            <SidebarFooter>
              <NavUpdate />
            </SidebarFooter>
          )}
          <NavFooter />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
