import { CharacterDetail } from '@/api/character';
import { getUserCharacterData } from '@/api/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BadgeLevel from '@/components/ui/badge-level';
import { Card } from '@/components/ui/card';
import {
  cn,
  decodeHTMLEntities,
  formatCurrency,
  formatInteger,
  getAvatarUrl,
  notifyError,
} from '@/lib/utils';
import { useStore } from '@/store';
import { LoaderCircleIcon } from 'lucide-react';
import { useState } from 'react';

/**
 * 用户角色卡片
 * @param props
 * @param props.data 角色数据
 * @param props.isCurrentUser 是否是当前用户本人
 */
export function CharacterCard({
  data,
  userName,
}: {
  data: CharacterDetail;
  userName: string;
}) {
  const { openCharacterDrawer, userAssets } = useStore();
  const [loading, setLoading] = useState(false);
  const [showUserTotal, setShowUserTotal] = useState(
    userAssets?.name === userName
  );
  const [userTotal, setUserTotal] = useState<number>(data.UserTotal || 0);

  const {
    Name: name = '',
    CharacterId: characterId = 0,
    Icon: icon = '',
    Level: level = 0,
    ZeroCount: zeroCount = 0,
    Stars: stars = 0,
    Rank: rank = 0,
    Rate: rate = 0,
    Sacrifices: sacrifices = 0,
  } = data;
  const dividend = rank <= 500 ? rate * 0.005 * (601 - rank) : stars * 2;

  const infoItems = [
    {
      id: 'dividend',
      label: '股息₵',
      value: `${formatCurrency(dividend, { maximumFractionDigits: 2 })}`,
    },
    {
      id: 'sacrifices',
      label: '圣殿',
      value: `${formatInteger(sacrifices)}`,
    },
  ];

  /**
   * 点击查看用户持股数
   */
  const fatchUserCharacterData = async () => {
    if (!characterId || !userName) return;

    setLoading(true);
    try {
      const resp = await getUserCharacterData(characterId, userName);
      if (resp.State === 0) {
        setUserTotal(resp.Value.Total);
        setShowUserTotal(true);
      } else {
        throw new Error(resp.Message || '获取用户持股数失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取用户持股数失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className="gap-y-2 border-0 rounded-md shadow p-0 overflow-hidden cursor-pointer hover:shadow-md transition duration-300"
      onClick={() => {
        openCharacterDrawer(characterId);
      }}
    >
      <div className="h-40 flex flex-col items-center gap-y-2 p-3 pb-0">
        <Avatar className="size-12 rounded-full border-2 border-secondary">
          <AvatarImage
            className="object-cover object-top pointer-events-none"
            src={getAvatarUrl(icon)}
          />
          <AvatarFallback className="rounded-full">C</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <div className="flex flex-row items-center justify-center text-md text-foreground font-semibold w-full overflow-hidden">
            <span className="truncate">{decodeHTMLEntities(name)}</span>
            <BadgeLevel level={level} zeroCount={zeroCount} />
          </div>
          <div className="flex items-center gap-1 mt-0.5 text-xs cursor-pointer opacity-60">
            #{characterId}
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
      <div
        className={cn(
          'flex items-center justify-center w-full h-8 text-sm font-medium border-t rounded-none'
        )}
        onClick={(e) => {
          if (!showUserTotal) {
            e.stopPropagation();
            fatchUserCharacterData();
          }
        }}
      >
        {showUserTotal ? (
          <span>持股：{formatInteger(userTotal)}</span>
        ) : (
          <>
            <LoaderCircleIcon
              className={cn('-ms-1 animate-spin', { hidden: !loading })}
              size={12}
              aria-hidden="true"
            />
            <span
              className={cn({
                hidden: loading,
              })}
            >
              查看持股
            </span>
          </>
        )}
      </div>
    </Card>
  );
}
