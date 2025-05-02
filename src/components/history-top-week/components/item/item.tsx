import { HistoryTopWeekItem } from '@/api/character';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BadgeLevel from '@/components/ui/badge-level';
import { formatCurrency, formatInteger, getAvatarUrl } from '@/lib/utils';
import { useStore } from '@/store';
import { UsersRound } from 'lucide-react';

/**
 * 历史萌王item
 * @param  props
 * @param {HistoryTopWeekItem} props.data - 历史萌王项数据
 */
export function Item({ data }: { data: HistoryTopWeekItem }) {
  const { setCharacterDrawer } = useStore();
  const {
    CharacterId,
    CharacterLevel,
    Name,
    Level,
    Price,
    Extra,
    Assets,
    Avatar: characterAvatar,
  } = data;

  const handleItemClick = () => {
    setCharacterDrawer({ open: true, characterId: CharacterId });
  };
  return (
    <div
      className="py-2.5 first:pt-0 last:pb-0 cursor-pointer"
      onClick={handleItemClick}
    >
      <div className="flex flex-row items-center gap-x-2 h-10">
        <div
          className="text-2xl font-mono tabular-nums flex justify-center opacity-30"
          title="排名"
        >
          {Level < 10 ? `0${Level}` : Level}
        </div>
        <Avatar className="size-10 rounded-full border-2 border-secondary">
          <AvatarImage
            className="object-cover object-top"
            src={getAvatarUrl(characterAvatar)}
            alt={Name || ''}
          />
          <AvatarFallback className="rounded-lg">C</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-y-1 flex-1 overflow-hidden">
          <div className="flex items-center text-sm">
            <span className="truncate">{Name}</span>
            <BadgeLevel level={CharacterLevel} />
          </div>
          {/* <div
          className="text-xs opacity-60 truncate"
          title="角色ID"
        >
          #{CharacterId}
        </div> */}
          <div
            className="text-xs opacity-60 truncate"
            title="溢出金额 / 拍卖总金额"
          >
            +₵{formatCurrency(Extra, { maximumFractionDigits: 0 })} / ₵
            {formatCurrency(Price, { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div
          className="flex items-center opacity-30 gap-1 pl-2 ml-auto"
          title="参与人数"
        >
          <UsersRound className="size-4" />
          <span className="text-sm">{formatInteger(Assets)}</span>
        </div>
      </div>
    </div>
  );
}
