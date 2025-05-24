import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, formatCurrency, getAvatarUrl } from '@/lib/utils';
import { useStore } from '@/store';
import {
  BadgeCent,
  DiamondMinus,
  DiamondPlus,
  DollarSign,
  LogOutIcon,
  Pencil,
  ScrollText,
  Ticket,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AssetsLogDialog } from './components/assets-log-dialog';
import { DailyBonusDialog } from './components/daily-bonus-dialog';
import { TopWeekBonusDialog } from './components/topweek-bonus-dialog';
import { UserAvatar } from './components/user-avatar';

export function UserAvatarDropdownMenu() {
  const { userAssets } = useStore();
  // 下拉菜单打开状态
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);
  // 每周分红弹窗打开状态
  const [topWeekBonusDialogOpen, setTopWeekBonusDialogOpen] = useState(false);
  // 每日签到弹窗打开状态
  const [dailyBonusDialogOpen, setDailyBonusDialogOpen] = useState(false);
  // 资金日志弹窗打开状态
  const [assetsLogDialogOpen, setAssetsLogDialogOpen] = useState(false);

  const dailyItems = [
    {
      icon: <Pencil size={16} className="opacity-60" aria-hidden="true" />,
      label: '签到奖励',
      onClick: () => {
        setDropdownMenuOpen(false);
        setDailyBonusDialogOpen(true);
      },
    },
    {
      icon: <Ticket size={16} className="opacity-60" aria-hidden="true" />,
      label: '刮刮乐',
      onClick: () => toast.warning('开发中'),
    },
    {
      icon: <DollarSign size={16} className="opacity-60" aria-hidden="true" />,
      label: '每周分红',
      onClick: () => {
        setDropdownMenuOpen(false);
        setTopWeekBonusDialogOpen(true);
      },
    },
  ];

  const assetsItems = [
    {
      icon: <ScrollText size={16} className="opacity-60" aria-hidden="true" />,
      label: '资金日志',
      onClick: () => {
        setDropdownMenuOpen(false);
        setAssetsLogDialogOpen(true);
      },
    },
    {
      icon: <BadgeCent size={16} className="opacity-60" aria-hidden="true" />,
      label: '我的拍卖',
      onClick: () => toast.warning('开发中'),
    },
    {
      icon: <DiamondPlus size={16} className="opacity-60" aria-hidden="true" />,
      label: '我的买单',
      onClick: () => toast.warning('开发中'),
    },
    {
      icon: (
        <DiamondMinus size={16} className="opacity-60" aria-hidden="true" />
      ),
      label: '我的卖单',
      onClick: () => toast.warning('开发中'),
    },
  ];

  const logoutItem = {
    icon: <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />,
    label: '退出登录',
    onClick: () => toast.warning('开发中'),
  };

  return (
    <>
      <DropdownMenu open={dropdownMenuOpen} onOpenChange={setDropdownMenuOpen}>
        <DropdownMenuTrigger className="size-8">
          <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
            <UserAvatar src={getAvatarUrl(userAssets?.avatar)} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-w-64 min-w-36">
          <DropdownMenuLabel className="flex min-w-0 flex-col">
            <span className="text-foreground truncate text-sm font-medium">
              {userAssets?.nickname}
            </span>
            <span className="text-muted-foreground truncate text-xs font-normal">
              余额：₵
              {formatCurrency(userAssets?.balance || 0, { useWUnit: true })}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {dailyItems.map((item, index) => (
              <DropdownMenuItem
                key={index}
                onClick={item.onClick}
                className="cursor-pointer"
              >
                {item.icon}
                <span>{item.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {assetsItems.map((item, index) => (
              <DropdownMenuItem
                key={index}
                onClick={item.onClick}
                className="cursor-pointer"
              >
                {item.icon}
                <span>{item.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={logoutItem.onClick}
              className={cn('cursor-pointer')}
            >
              {logoutItem.icon}
              <span>{logoutItem.label}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <TopWeekBonusDialog
        open={topWeekBonusDialogOpen}
        onOpenChange={setTopWeekBonusDialogOpen}
      />
      <DailyBonusDialog
        open={dailyBonusDialogOpen}
        onOpenChange={setDailyBonusDialogOpen}
      />
      <AssetsLogDialog
        open={assetsLogDialogOpen}
        onOpenChange={setAssetsLogDialogOpen}
      />
    </>
  );
}
