import { MoreInfoButton } from './more-info-button';
import { formatCurrency, formatInteger } from '@/lib/utils';
import { useStore } from '@/store';

/**
 * 角色详情信息
 */
export function CharacterDetailInfo() {
  const { characterDrawerData } = useStore();

  const {
    Rank: rank = 0,
    Stars: stars = 0,
    Current: current = 0,
    Price: price = 0,
    Total: total = 0,
    Rate: rate = 0,
  } = characterDrawerData.characterDetailData || {};
  const dividend = rank <= 500 ? rate * 0.005 * (601 - rank) : stars * 2;

  const data = [
    {
      id: 'current',
      label: '现价₵',
      value: `${formatCurrency(current, { maximumFractionDigits: 2 })}`,
    },
    {
      id: 'price',
      label: '评估价₵',
      value: `${formatCurrency(price, { maximumFractionDigits: 2 })}`,
    },
    {
      id: 'dividend',
      label: '股息₵',
      value: `${formatCurrency(dividend, { maximumFractionDigits: 2 })}`,
    },
    { id: 'total', label: '流通', value: formatInteger(total) },
  ];

  return (
    <div className="mt-2">
      <div className="flex flex-col text-xs gap-y-1.5">
        <div className="flex flex-row items-center gap-x-1">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex flex-1 flex-col p-2 pt-2.5 bg-slate-100/80 dark:bg-slate-800/60 rounded-sm"
            >
              <div className="flex justify-center text-foreground font-semibold">
                {item.value}
              </div>
              <div className="flex justify-center opacity-50 scale-80">
                {item.label}
              </div>
            </div>
          ))}
        </div>
        <MoreInfoButton />
      </div>
    </div>
  );
}
