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
 * 用户角色卡片
 * @param props
 * @param props.data 角色数据
 */
export function CharacterCard({ data }: { data: CharacterDetail }) {
  const { openCharacterDrawer } = useStore();

  const {
    Name: name = '',
    CharacterId: characterId = 0,
    Icon: icon = '',
    Level: level = 0,
    ZeroCount: zeroCount = 0,
    Stars: stars = 0,
    Rank: rank = 0,
    UserTotal: userTotal = 0,
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
    { id: 'userTotal', label: '持股', value: formatInteger(userTotal) },
    {
      id: 'sacrifices',
      label: '圣殿',
      value: `${formatInteger(sacrifices)}`,
    },
  ];

  return (
    <Card
      className="gap-y-2 border-0 rounded-md shadow p-0 overflow-hidden cursor-pointer hover:shadow-md transition duration-300"
      onClick={() => {
        openCharacterDrawer(characterId);
      }}
    >
      <div className="h-40 flex flex-col items-center gap-y-2 p-3">
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
    </Card>
  );
}
