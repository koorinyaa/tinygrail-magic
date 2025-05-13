import { CurrentTopWeekItem } from '@/api/character';
import BadgeLevel from '@/components/ui/badge-level';
import {
  cn,
  decodeHTMLEntities,
  formatCurrency,
  formatInteger,
} from '@/lib/utils';

/**
 * 简要信息区域组件
 * @param props
 * @param {CurrentTopWeekItem} props.data - 角色数据
 */
export function BriefInfo({ data }: { data: CurrentTopWeekItem }) {
  return (
    <div
      className={cn(
        'absolute bottom-0 left-0 right-0 h-18 text-white',
        'bg-gradient-to-b from-[#00000000]/0 to-[#000000cc] group'
      )}
    >
      <div className="absolute bottom-0 w-full px-3 pt-4 pb-1.5">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <span className="text-xs font-bold truncate">
              {decodeHTMLEntities(data.CharacterName)}
            </span>
            <BadgeLevel level={data.CharacterLevel} />
          </div>
          <div className="text-xs truncate">
            +₵{formatCurrency(data.Extra, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs truncate">
            {formatInteger(data.Type)} / {formatInteger(data.Assets)} /{' '}
            {formatInteger(data.Sacrifices)}
          </div>
        </div>
      </div>
    </div>
  );
}
