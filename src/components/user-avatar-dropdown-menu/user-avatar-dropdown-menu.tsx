import { claimHolidayBonus, holidayCheck } from '@/api/user';
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
import { LogoutDialog } from '@/components/user-avatar-dropdown-menu/components/logout-dialog';
import { verifyAuth } from '@/lib/auth';
import {
  cn,
  formatCurrency,
  getAvatarUrl,
  isEmpty,
  notifyError,
} from '@/lib/utils';
import { useStore } from '@/store';
import {
  BadgeCent,
  Candy,
  DiamondMinus,
  DiamondPlus,
  DollarSign,
  LogOutIcon,
  Pencil,
  ScrollText,
  Ticket,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AssetsLogDialog } from './components/assets-log-dialog';
import { AuctionLogDialog } from './components/auction-log-dialog';
import { DailyBonusDialog } from './components/daily-bonus-dialog';
import { MyBuyOrderDialog } from './components/my-buy-order-dialog';
import { MySellOrderDialog } from './components/my-sell-order-dialog';
import { TopWeekBonusDialog } from './components/topweek-bonus-dialog';
import { UserAvatar } from './components/user-avatar';

export function UserAvatarDropdownMenu() {
  const { userAssets, setUserAssets } = useStore();
  // 下拉菜单打开状态
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);
  // 每周分红弹窗打开状态
  const [topWeekBonusDialogOpen, setTopWeekBonusDialogOpen] = useState(false);
  // 每日签到弹窗打开状态
  const [dailyBonusDialogOpen, setDailyBonusDialogOpen] = useState(false);
  // 资金日志弹窗打开状态
  const [assetsLogDialogOpen, setAssetsLogDialogOpen] = useState(false);
  // 拍卖日志弹窗打开状态
  const [auctionLogDialogOpen, setAuctionLogDialogOpen] = useState(false);
  // 我的买单弹窗打开状态
  const [myBuyOrderDialogOpen, setMyBuyOrderDialogOpen] = useState(false);
  // 我的卖单弹窗打开状态
  const [mySellOrderDialogOpen, setMySellOrderDialogOpen] = useState(false);
  // 退出登录弹窗打开状态
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [holidayName, setHolidayName] = useState('');

  useEffect(() => {
    fatchHolidayCheck();
  }, []);

  /**
   * 节日检查
   */
  const fatchHolidayCheck = async () => {
    try {
      const res = await holidayCheck();
      if (res.State === 0) {
        setHolidayName(res.Value);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '节日检查失败';
      console.error(errorMsg);
    }
  };

  /**
   * 领取节日奖励
   */
  const handleClaimHolidayBonus = async () => {
    try {
      verifyAuth(setUserAssets);
      const res = await claimHolidayBonus();
      if (res.State === 0) {
        toast.success('领取成功', {
          duration: Infinity,
          cancel: {
            label: '关闭',
            onClick: () => {},
          },
          description: res.Value || '',
        });
        verifyAuth(setUserAssets);
      } else {
        throw new Error(res.Message ?? '领取节日奖励失败');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '领取节日奖励失败';
      notifyError(errorMsg);
    }
  };

  const dailyItems = [
    {
      icon: <Pencil size={16} className="opacity-60" aria-hidden="true" />,
      label: userAssets?.showDaily ? '签到奖励' : '已领取',
      onClick: () => {
        setDropdownMenuOpen(false);
        setDailyBonusDialogOpen(true);
      },
      show: true,
    },
    {
      icon: <Ticket size={16} className="opacity-60" aria-hidden="true" />,
      label: '刮刮乐',
      onClick: () => toast.warning('开发中'),
      show: true,
    },
    {
      icon: <DollarSign size={16} className="opacity-60" aria-hidden="true" />,
      label: userAssets?.showWeekly ? '每周分红' : '已领取',
      onClick: () => {
        setDropdownMenuOpen(false);
        setTopWeekBonusDialogOpen(true);
      },
      show: true,
    },
    {
      icon: <Candy size={16} className="opacity-60" aria-hidden="true" />,
      label: `${holidayName}福利`,
      onClick: () => {
        handleClaimHolidayBonus();
        setDropdownMenuOpen(false);
      },
      show: !isEmpty(holidayName),
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
      show: true,
    },
    {
      icon: <BadgeCent size={16} className="opacity-60" aria-hidden="true" />,
      label: '我的拍卖',
      onClick: () => {
        setDropdownMenuOpen(false);
        setAuctionLogDialogOpen(true);
      },
    },
    {
      icon: <DiamondPlus size={16} className="opacity-60" aria-hidden="true" />,
      label: '我的买单',
      onClick: () => {
        setDropdownMenuOpen(false);
        setMyBuyOrderDialogOpen(true);
      },
    },
    {
      icon: (
        <DiamondMinus size={16} className="opacity-60" aria-hidden="true" />
      ),
      label: '我的卖单',
      onClick: () => {
        setDropdownMenuOpen(false);
        setMySellOrderDialogOpen(true);
      },
    },
  ];

  const logoutItem = {
    icon: <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />,
    label: '退出登录',
    onClick: () => {
      setDropdownMenuOpen(false);
      setLogoutDialogOpen(true);
    },
  };

  return (
    <>
      <DropdownMenu open={dropdownMenuOpen} onOpenChange={setDropdownMenuOpen}>
        <DropdownMenuTrigger className="size-8" asChild>
          <div>
            <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
              <UserAvatar src={getAvatarUrl(userAssets?.avatar)} />
            </Button>
          </div>
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
            {dailyItems.map((item, index) => {
              if (!item.show) return null;

              return (
                <DropdownMenuItem
                  key={index}
                  onClick={item.onClick}
                  className="cursor-pointer"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </DropdownMenuItem>
              );
            })}
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
      {topWeekBonusDialogOpen && (
        <TopWeekBonusDialog
          open={topWeekBonusDialogOpen}
          onOpenChange={setTopWeekBonusDialogOpen}
        />
      )}
      {dailyBonusDialogOpen && (
        <DailyBonusDialog
          open={dailyBonusDialogOpen}
          onOpenChange={setDailyBonusDialogOpen}
        />
      )}
      {assetsLogDialogOpen && (
        <AssetsLogDialog
          open={assetsLogDialogOpen}
          onOpenChange={setAssetsLogDialogOpen}
        />
      )}
      {auctionLogDialogOpen && (
        <AuctionLogDialog
          open={auctionLogDialogOpen}
          onOpenChange={setAuctionLogDialogOpen}
        />
      )}
      {myBuyOrderDialogOpen && (
        <MyBuyOrderDialog
          open={myBuyOrderDialogOpen}
          onOpenChange={setMyBuyOrderDialogOpen}
        />
      )}
      {mySellOrderDialogOpen && (
        <MySellOrderDialog
          open={mySellOrderDialogOpen}
          onOpenChange={setMySellOrderDialogOpen}
        />
      )}
      {logoutDialogOpen && (
        <LogoutDialog
          open={logoutDialogOpen}
          onOpenChange={setLogoutDialogOpen}
        />
      )}
    </>
  );
}
