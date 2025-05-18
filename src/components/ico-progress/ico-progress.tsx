import { cn } from '@/lib/utils';

/**
 * ico 进度条
 * @param props
 * @param {number} props.currentLevel 当前等级
 * @param {number} props.total 当前金额
 * @param {number} props.minAmount 当前等级最低金额
 * @param {number} props.nextAmount 下一级金额
 */
export function IcoProgress({
  currentLevel,
  total,
  minAmount,
  nextAmount,
}: {
  currentLevel: number;
  total: number;
  minAmount: number;
  nextAmount: number;
}) {
  return (
    <div className="w-full h-1 bg-gray-100 dark:bg-white/20 rounded-full overflow-hidden relative">
      {/* 等级当前金额百分比 */}
      <div
        className={cn(
          'absolute top-0 left-0 h-full bg-yellow-400/40 dark:bg-yellow-600/30 rounded-full',
          {
            'bg-slate-300/40 dark:bg-slate-500': currentLevel === 0,
            'bg-lime-400/40 dark:bg-lime-600/30': currentLevel === 1,
            'bg-green-400/40 dark:bg-green-600/30': currentLevel === 2,
            'bg-emerald-400/40 dark:bg-emerald-600/30': currentLevel === 3,
            'bg-teal-400/40 dark:bg-teal-600/30': currentLevel === 4,
            'bg-cyan-400/40 dark:bg-cyan-600/30': currentLevel === 5,
            'bg-sky-400/40 dark:bg-sky-600/30': currentLevel === 6,
            'bg-blue-400/40 dark:bg-blue-600/30': currentLevel === 7,
            'bg-indigo-400/40 dark:bg-indigo-600/30': currentLevel === 8,
            'bg-violet-400/40 dark:bg-violet-600/30': currentLevel === 9,
            'bg-purple-400/40 dark:bg-purple-600/30': currentLevel === 10,
            'bg-fuchsia-400/40 dark:bg-fuchsia-600/30': currentLevel === 11,
            'bg-pink-400/40 dark:bg-pink-600/30': currentLevel === 12,
            'bg-rose-400/40 dark:bg-rose-600/30': currentLevel === 13,
            'bg-orange-400/40 dark:bg-orange-600/30': currentLevel === 14,
            'bg-amber-400/40 dark:bg-amber-600/30': currentLevel === 15,
          }
        )}
        style={{ width: `${Math.min(100, (total / nextAmount) * 100)}%` }}
      />
      {/* 等级最低金额百分比 */}
      <div
        className={cn(
          'absolute top-0 left-0 h-full  bg-yellow-400 dark:bg-yellow-600 rounded-full',
          {
            hidden: currentLevel === 0,
            'bg-lime-400 dark:bg-lime-600': currentLevel === 1,
            'bg-green-400 dark:bg-green-600': currentLevel === 2,
            'bg-emerald-400 dark:bg-emerald-600': currentLevel === 3,
            'bg-teal-400 dark:bg-teal-600': currentLevel === 4,
            'bg-cyan-400 dark:bg-cyan-600': currentLevel === 5,
            'bg-sky-400 dark:bg-sky-600': currentLevel === 6,
            'bg-blue-400 dark:bg-blue-600': currentLevel === 7,
            'bg-indigo-400 dark:bg-indigo-600': currentLevel === 8,
            'bg-violet-400 dark:bg-violet-600': currentLevel === 9,
            'bg-purple-400 dark:bg-purple-600': currentLevel === 10,
            'bg-fuchsia-400 dark:bg-fuchsia-600': currentLevel === 11,
            'bg-pink-400 dark:bg-pink-600': currentLevel === 12,
            'bg-rose-400 dark:bg-rose-600': currentLevel === 13,
            'bg-orange-400 dark:bg-orange-600': currentLevel === 14,
            'bg-amber-400 dark:bg-amber-600': currentLevel === 15,
          }
        )}
        style={{
          width: `${Math.min(100, (minAmount / nextAmount) * 100)}%`,
        }}
      />
    </div>
  );
}
