import { StarLevel } from '@/components/star-level';
import { TowerRankBadge } from '@/components/tower-rank-badge';
import { Badge } from '@/components/ui/badge';
import BadgeLevel from '@/components/ui/badge-level';
import { cn, decodeHTMLEntities, formatCurrency } from '@/lib/utils';
import { useStore } from '@/store';
import { Copy, Crown } from 'lucide-react';
import { TbX } from 'react-icons/tb';
import { toast } from 'sonner';

/**
 * 角色属性
 */
export function CharacterAttribute() {
  const { characterDrawerData } = useStore();
  const {
    Name: name = '',
    CharacterId: characterId = 0,
    Level: level = 0,
    ZeroCount: zeroCount = 0,
    Crown: crown = 0,
    Bonus: bonus = 0,
    Fluctuation: fluctuation = 0,
    Stars: stars = 0,
    Rank: rank = 0,
    StarForces: starForces = 0,
  } = characterDrawerData.characterDetailData || {};

  /**
   * 复制角色ID
   */
  const coypCharacterId = () => {
    navigator.clipboard
      .writeText(`#${characterId.toString()}`)
      .then(() => {
        toast.success('复制成功');
      })
      .catch((err) => {
        console.error('复制失败: ', err);
      });
  };

  const badgeList = [
    {
      color: {
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-500':
          fluctuation > 0,
        'bg-red-100 text-red-800 dark:bg-red-400/20 dark:text-red-500':
          fluctuation < 0,
      },
      title: '价格波动',
      children: (
        <>
          {fluctuation >= 0 && '+'}
          {formatCurrency(fluctuation * 100, { maximumFractionDigits: 2 })}%
        </>
      ),
      show: true,
    },
    {
      color:
        'bg-amber-300 text-amber-800 dark:bg-amber-400/20 dark:text-amber-500',
      title: '萌王次数',
      children: (
        <>
          <Crown className="size-3" />
          <span>{crown}</span>
        </>
      ),
      show: crown > 0,
    },
    {
      color:
        'bg-green-300 text-green-800 dark:bg-green-400/20 dark:text-green-500',
      title: `新番加成剩余${bonus}期`,
      children: (
        <span>
          <TbX className="size-3 inline-block" />
          {bonus}
        </span>
      ),
      show: bonus > 0,
    },
  ];

  return (
    <>
      <div className="flex flex-row gap-x-8">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-row items-center text-md text-foreground font-semibold">
            <span className="truncate">{decodeHTMLEntities(name)}</span>
            <BadgeLevel level={level} zeroCount={zeroCount} />
          </div>
          <div
            className="flex items-center gap-1 mt-0.5 text-xs cursor-pointer opacity-60"
            title="复制ID"
            onClick={coypCharacterId}
          >
            #{characterId}
            <Copy className="size-3" />
          </div>
        </div>
        <TowerRankBadge rank={rank} starForces={starForces} />
      </div>
      <div className="flex flex-row flex-wrap items-center mt-1.5 gap-2">
        <div className="flex flex-wrap items-center md:justify-start gap-1">
          {badgeList.map((item, index) => {
            if (item.show) {
              return (
                <Badge
                  key={index}
                  variant="secondary"
                  className={cn(
                    'flex flex-row items-center justify-center gap-1 rounded-sm',
                    item.color
                  )}
                  title={item.title}
                >
                  {item.children}
                </Badge>
              );
            }
          })}
        </div>
        <div
          className="flex flex-wrap items-center justify-start gap-0.5 text-amber-300 dark:text-amber-500"
          title={`星级: ${stars}`}
        >
          <StarLevel level={stars} />
        </div>
      </div>
    </>
  );
}
