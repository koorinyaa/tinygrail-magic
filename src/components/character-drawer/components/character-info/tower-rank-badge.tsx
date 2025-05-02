import { formatCurrency, formatInteger } from '@/lib/utils';
import { useStore } from '@/store';
import { ChartNoAxesColumn } from 'lucide-react';
import { BsStars } from 'react-icons/bs';

export function TowerRankBadge() {
  const { characterDrawerData } = useStore();
  const { Rank: rank = 0, StarForces: starForces = 0 } =
    characterDrawerData.characterDetail || {};

  return (
    <div className="flex flex-col h-full min-w-11 rounded-md overflow-hidden bg-secondary text-secondary-foreground">
      <div
        className={
          rank <= 500
            ? 'bg-violet-400 text-violet-800 dark:bg-violet-600/40 dark:text-violet-200'
            : 'bg-slate-300 text-slate-800 dark:bg-slate-400/20 dark:text-slate-200'
        }
        title="通天塔排名"
      >
        <div className="flex items-center justify-center h-3/4 text-md font-semibold scale-80">
          <ChartNoAxesColumn className="inline-block size-4" />
          {rank}
        </div>
      </div>
      <div
        className="flex items-center justify-center h-1/4 text-xs opacity-60 scale-80"
        title={`角色星之力：${starForces}`}
      >
        <BsStars className="inline-block size-3" />
        {starForces < 10000
          ? formatInteger(starForces)
          : `${formatCurrency(starForces / 10000, {
              maximumFractionDigits: 1,
            })}w`}
      </div>
    </div>
  );
}
