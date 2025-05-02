import {
  DrawerContent,
  DrawerNested,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, formatCurrency, formatDateTime, formatInteger } from '@/lib/utils';
import { useStore } from '@/store';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { HelpCircle } from 'lucide-react';
import { TbCaretRightFilled } from 'react-icons/tb';

/**
 * 更多信息按钮
 */
export function MoreInfoButton() {
  const isMobile = useIsMobile(448);
  const { characterDrawerData } = useStore();
  const {
    characterDetail,
    tinygrailCharacterData,
    gensokyoCharacterData,
    characterPoolAmount,
  } = characterDrawerData;

  const {
    Level: level = 0,
    ZeroCount: zeroCount = 0,
    Crown: crown = 0,
    Bonus: bonus = 0,
    Rank: rank = 0,
    Stars: stars = 0,
    Current: current = 0,
    Price: price = 0,
    Total: total = 0,
    Rate: rate = 0,
    StarForces: starForces = 0,
    ListedDate: listedDate = '',
  } = characterDetail || {};
  const dividend = rank <= 500 ? rate * 0.005 * (601 - rank) : stars * 2;

  const data = [
    {
      id: 'level',
      label: '等级',
      value: level > 0 ? `Lv${level}` : `ST${zeroCount}`,
    },
    {
      id: 'stars',
      label: '星级',
      value: stars,
    },
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
      id: 'rate',
      label: '基础股息₵',
      value: `${formatCurrency(rate, { maximumFractionDigits: 2 })}`,
    },
    {
      id: 'dividend',
      label: (
        <span className="flex items-center gap-1">
          股息₵
          <Popover>
            <PopoverTrigger>
              <HelpCircle className="size-3 opacity-60 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent
              className="px-3 py-2 w-fit"
              onOpenAutoFocus={(e) => {
                e.preventDefault();
              }}
            >
              <span className="text-xs">
                {rank <= 500
                  ? '基础股息 × 0.005 × (601 - 通天塔排名)'
                  : '星级 × 2'}
              </span>
            </PopoverContent>
          </Popover>
        </span>
      ),
      value:
        rank <= 500
          ? `${formatCurrency(rate, {
              maximumFractionDigits: 2,
            })} × 0.005 × (601 - ${rank}) = ${formatCurrency(dividend, {
              maximumFractionDigits: 2,
            })}`
          : `${stars} × 2 = ${formatCurrency(dividend, {
              maximumFractionDigits: 2,
            })}`,
    },
    {
      id: 'total',
      label: '流通',
      value: formatCurrency(total),
    },
    {
      id: 'rank',
      label: '通天塔排名',
      value: `${formatInteger(rank)}`,
    },
    {
      id: 'starForces',
      label: '星之力',
      value:
        starForces < 10000
          ? formatInteger(starForces)
          : `${formatCurrency(starForces / 10000, {
              maximumFractionDigits: 1,
            })}w`,
      title: formatInteger(starForces),
    },
    {
      id: 'valhalla',
      label: '英灵殿',
      value: formatInteger(tinygrailCharacterData?.Total || 0),
    },
    {
      id: 'gensokyo',
      label: '幻想乡',
      value: formatInteger(gensokyoCharacterData?.Total || 0),
    },
    {
      id: 'pool',
      label: '奖池',
      value: formatInteger(characterPoolAmount || 0),
    },
    {
      id: 'crown',
      label: '萌王次数',
      value: crown,
    },
    {
      id: 'bonus',
      label: '新番加成剩余期数',
      value: bonus,
    },
    {
      id: 'listedDate',
      label: '上市日期',
      value: formatDateTime(listedDate),
    },
  ];

  return (
    <DrawerNested direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <div className="flex items-center justify-center p-1.5 bg-slate-100/80 dark:bg-slate-800/60 rounded-sm cursor-pointer">
          <span className="opacity-50">
            查看详细数据
            <TbCaretRightFilled className="inline-block" />
          </span>
        </div>
      </DrawerTrigger>
      <DrawerContent
        className={cn('bg-card border-none overflow-hidden outline-none', {
          'max-w-96 rounded-l-md': !isMobile,
          '!max-h-[90dvh]': isMobile,
        })}
        aria-describedby={undefined}
      >
        <VisuallyHidden asChild>
          <DrawerTitle />
        </VisuallyHidden>
        <div
          className={cn('flex items-center justify-center h-8 px-4 py-2', {
            'pt-0': isMobile,
          })}
        >
          <span className="text-xs text-foreground font-semibold">
            角色详细数据
          </span>
        </div>
        <div className="flex flex-col px-3 gap-y-1 text-xs divide-y divide-slate-300/30 dark:divide-slate-800/70 overflow-y-auto">
          {data.map((item) => (
            <div key={item.id} className="flex flex-row py-2 gap-x-1">
              <div className="text-left opacity-50">{item.label}</div>
              <div
                className="flex-1 text-right truncate"
                title={
                  item.title?.toString() ? item.title : item.value?.toString()
                }
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </DrawerContent>
    </DrawerNested>
  );
}
