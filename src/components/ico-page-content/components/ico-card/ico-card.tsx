import { CharacterICOItem } from '@/api/character';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BadgeLevel from '@/components/ui/badge-level';
import { Card } from '@/components/ui/card';
import {
  calculateICOInfo,
  calculateRemainingTime,
  cn,
  decodeHTMLEntities,
  formatCurrency,
  formatInteger,
  getAvatarUrl,
} from '@/lib/utils';
import { useStore } from '@/store';
import { ChevronsRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ICOCard({ data }: { data: CharacterICOItem }) {
  const { openCharacterDrawer } = useStore();
  // 用于强制刷新时间显示的计数器
  const [timeRefreshCounter, setTimeRefreshCounter] = useState(0);

  const {
    CharacterId: characterId,
    Name: name,
    Icon: icon,
    End: end,
    Total: total,
    Users: users,
  } = data;

  const { currentLevel, realLevel, nextAmount, minAmount, price } =
    calculateICOInfo(data);

  useEffect(() => {
    // 设置每1秒更新一次时间格式化的定时器
    const timeRefreshInterval = setInterval(() => {
      setTimeRefreshCounter((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timeRefreshInterval);
    };
  }, []);

  const infoItems = [
    {
      id: 'users',
      label: '人数',
      value: formatInteger(users),
    },
    {
      id: 'total',
      label: '已筹集₵',
      value: formatCurrency(total, { useWUnit: true }),
    },
    {
      id: 'price',
      label: '发行价₵',
      value: formatCurrency(price, { useWUnit: true }),
    },
  ];

  return (
    <Card
      className="gap-y-2 border-0 rounded-md shadow p-0 overflow-hidden cursor-pointer hover:shadow-md transition duration-300"
      onClick={() => {
        // openCharacterDrawer(characterId);
      }}
    >
      <div className="flex flex-col items-center gap-y-2 h-56 p-4">
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
            {/* <BadgeLevel level={level} zeroCount={zeroCount} /> */}
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
        <div className="flex flex-col w-full">
          <div className="flex flex-row items-center mb-0.5">
            <div className="flex-1 text-xs truncate">
              <BadgeLevel level={currentLevel} title="ico等级" />
              <ChevronsRight className="size-3 shrink-0 inline-block opacity-40" />
              <BadgeLevel level={realLevel} title="上市等级" />
            </div>
            <div
              className="mr-1 text-xs truncate opacity-60"
              title={
                (total - minAmount) / nextAmount >= 0
                  ? `溢出${formatInteger(
                      ((total - minAmount) / nextAmount) * 100
                    )}%`
                  : '未满足上市条件'
              }
            >
              <span>{formatInteger((total / nextAmount) * 100)}%</span>
            </div>
          </div>
          <div className="w-full h-1 bg-gray-100 dark:bg-white/20 rounded-full overflow-hidden relative">
            {/* 等级当前金额百分比 */}
            <div
              className={cn(
                'absolute top-0 left-0 h-full bg-yellow-400/40 dark:bg-yellow-600/30 rounded-full',
                {
                  'bg-slate-300/40 dark:bg-slate-500': currentLevel === 0,
                  'bg-lime-400/40 dark:bg-lime-600/30': currentLevel === 1,
                  'bg-green-400/40 dark:bg-green-600/30': currentLevel === 2,
                  'bg-emerald-400/40 dark:bg-emerald-600/30':
                    currentLevel === 3,
                  'bg-teal-400/40 dark:bg-teal-600/30': currentLevel === 4,
                  'bg-cyan-400/40 dark:bg-cyan-600/30': currentLevel === 5,
                  'bg-sky-400/40 dark:bg-sky-600/30': currentLevel === 6,
                  'bg-blue-400/40 dark:bg-blue-600/30': currentLevel === 7,
                  'bg-indigo-400/40 dark:bg-indigo-600/30': currentLevel === 8,
                  'bg-violet-400/40 dark:bg-violet-600/30': currentLevel === 9,
                  'bg-purple-400/40 dark:bg-purple-600/30': currentLevel === 10,
                  'bg-fuchsia-400/40 dark:bg-fuchsia-600/30':
                    currentLevel === 11,
                  'bg-pink-400/40 dark:bg-pink-600/30': currentLevel === 12,
                  'bg-rose-400/40 dark:bg-rose-600/30': currentLevel === 13,
                  'bg-orange-400/40 dark:bg-orange-600/30': currentLevel === 14,
                  'bg-amber-400/40 dark:bg-amber-600/30': currentLevel === 15,
                }
              )}
              style={{ width: `${Math.min(100, (total / nextAmount) * 100)}%` }}
            ></div>
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
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="text-xs truncate opacity-60">
            {calculateRemainingTime(end)}
          </div>
        </div>
      </div>
    </Card>
  );
}
