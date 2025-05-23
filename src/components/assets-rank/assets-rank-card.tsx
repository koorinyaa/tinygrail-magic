import { UserAssetRankItem } from '@/api/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  cn,
  decodeHTMLEntities,
  formatCurrency,
  getAvatarUrl,
} from '@/lib/utils';
import { useStore } from '@/store';

/**
 * 资产排名卡片
 */
export function AssetsRankCard({ data }: { data: UserAssetRankItem }) {
  const { setCurrentPage, closeCharacterDrawer } = useStore();
  const {
    Name: name = '',
    Nickname: nickname = '',
    TotalBalance: totalBalance = 0,
    Avatar: avatar = '',
    Assets: assets = 0,
    LastActiveDate: lastActiveDate = '',
    LastIndex: lastIndex = 0,
    Share: share = 0,
    State: state = 0,
  } = data;

  const infoItems = [
    {
      id: 'assets',
      label: '总资产₵',
      value: `${formatCurrency(assets, { useWUnit: true })}`,
    },
    {
      id: 'share',
      label: '每周股息₵',
      value: `${formatCurrency(share, { useWUnit: true })}`,
    },
    {
      id: 'totalBalance',
      label: '流动资金₵',
      value: `${formatCurrency(totalBalance, { useWUnit: true })}`,
    },
  ];

  /**
   * 跳转到用户的小圣杯
   */
  const goToUserTinygrail = () => {
    if (!name) return;

    setCurrentPage({
      main: {
        title: `${decodeHTMLEntities(nickname)}的小圣杯`,
        id: 'user-tinygrail',
      },
      data: {
        userName: name,
      },
    });
    closeCharacterDrawer();
  };

  return (
    <Card
      onClick={goToUserTinygrail}
      className={cn(
        'h-39.5 gap-y-2 border-0 rounded-md shadow p-0',
        'overflow-hidden cursor-pointer hover:shadow-md transition duration-300'
      )}
    >
      <div className="flex flex-col items-center gap-y-2 p-3">
        <div className="relative">
          <Avatar
            className={cn('size-16 rounded-full border-2 border-secondary', {
              'border-red-600': state === 666,
            })}
          >
            <AvatarImage
              className="object-cover object-top pointer-events-none"
              src={getAvatarUrl(avatar, 'medium')}
            />
            <AvatarFallback className="rounded-full">U</AvatarFallback>
          </Avatar>
          <Badge
            className="bg-yellow-500 dark:bg-yellow-600 text-white absolute -top-1 -left-2 size-7 rounded-full border-2 border-card px-1 scale-80"
            title="排名"
          >
            #{lastIndex}
          </Badge>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <div
            className="flex flex-row items-center justify-center text-md text-foreground font-semibold w-full overflow-hidden"
            title={state === 666 ? '已封禁' : undefined}
          >
            <span
              className={cn('truncate', {
                'text-red-600': state === 666,
              })}
            >
              {decodeHTMLEntities(nickname)}
            </span>
          </div>
        </div>
        <div className="flex flex-row w-full items-center gap-x-1 text-xs">
          {infoItems.map((item) => (
            <div key={item.id} className="flex flex-1 flex-col">
              <div className="flex justify-center text-foreground font-semibold">
                {item.value}
              </div>
              <div className="flex justify-center opacity-50 scale-80">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
