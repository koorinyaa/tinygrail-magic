import { CharacterDetail } from '@/api/character';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BadgeLevel from '@/components/ui/badge-level';
import { Card } from '@/components/ui/card';
import {
  decodeHTMLEntities,
  formatCurrency,
  formatInteger,
  getAvatarUrl,
} from '@/lib/utils';
import { useStore } from '@/store';

/**
 * 最高股息角色卡片
 * @param props
 * @param props.data 角色数据
 * @param props.type 排名类型
 */
export function RankCard({
  data,
  type,
}: {
  data: CharacterDetail;
  type: 'msrc' | 'mvc' | 'mrc' | 'mfc';
}) {
  const { openCharacterDrawer } = useStore();

  const {
    Name: name = '',
    CharacterId: characterId = 0,
    Icon: icon = '',
    Level: level = 0,
    ZeroCount: zeroCount = 0,
    Stars: stars = 0,
    Rank: rank = 0,
    Rate: rate = 0,
    Total: total = 0,
    MarketValue: marketValue = 0,
    Current: current = 0,
    Price: price = 0,
    Fluctuation: fluctuation = 0,
  } = data;
  const dividend = rank <= 500 ? rate * 0.005 * (601 - rank) : stars * 2;

  const infoItems = () => {
    switch (type) {
      case 'msrc':
        return [
          {
            id: 'rate',
            label: '基础股息₵',
            value: `${formatCurrency(rate, { useWUnit: true })}`,
          },
          {
            id: 'dividend',
            label: '股息₵',
            value: `${formatCurrency(dividend, { useWUnit: true })}`,
          },
          { id: 'rank', label: '通天塔', value: formatInteger(rank) },
        ];
      case 'mvc':
        return [
          {
            id: 'current',
            label: '现价₵',
            value: `${formatCurrency(current, { useWUnit: true })}`,
          },
          {
            id: 'total',
            label: '流通量',
            value: `${formatInteger(total, true)}`,
          },
          {
            id: 'marketValue',
            label: '市值',
            value: formatCurrency(marketValue, { useWUnit: true }),
          },
        ];
      case 'mrc':
      case 'mfc':
        return [
          {
            id: 'price',
            label: '评估价₵',
            value: `${formatCurrency(price, { useWUnit: true })}`,
          },
          {
            id: 'current',
            label: '现价₵',
            value: `${formatCurrency(current, { useWUnit: true })}`,
          },
          {
            id: 'marketValue',
            label: '价格波动',
            value: `${fluctuation >= 0 ? '+' : ''}${formatCurrency(
              fluctuation * 100,
              { maximumFractionDigits: 2 }
            )}%`,
          },
        ];
      default:
        return [];
    }
  };

  return (
    <Card
      className="gap-y-2 border-0 rounded-md shadow p-0 overflow-hidden cursor-pointer hover:shadow-md transition duration-300"
      onClick={() => {
        openCharacterDrawer(characterId);
      }}
    >
      <div className="h-42 flex flex-col items-center gap-y-2 p-4">
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
          {infoItems().map((item) => (
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
