import { CharacterICOItem } from '@/api/character';
import { IcoProgress } from '@/components/ico-progress';
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

/**
 * 计算剩余时间（小时）
 * @param endDateString 结束时间字符串
 * @returns 剩余小时数
 */
function getRemainingTimeInHours(endDateString: string): number {
  try {
    const endDate = new Date(endDateString);
    if (isNaN(endDate.getTime())) {
      return 0;
    }

    const now = new Date();
    const diffMs = endDate.getTime() - now.getTime();

    // 如果已经结束
    if (diffMs <= 0) {
      return 0;
    }

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = diffMinutes / 60;

    return diffHours;
  } catch (e) {
    console.error(e);
    return 0;
  }
}

/**
 * ico卡片
 * @param data ico数据
 * @param refresh 刷新回调
 */
export function ICOCard({
  data,
  refresh,
}: {
  data: CharacterICOItem;
  refresh: () => void;
}) {
  const { openCharacterDrawer, setCharacterDrawer } = useStore();
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

      // 检查是否已经结束
      const endTime = new Date(end);
      if (endTime <= new Date()) {
        refresh();
      }
    }, 1000);

    return () => {
      clearInterval(timeRefreshInterval);
    };
  }, [end, refresh]);

  const infoItems = [
    {
      id: 'users',
      label: '参与者',
      value: `${formatInteger(users)}/${formatInteger(
        (currentLevel + 1) * 5 + 10
      )}`,
      title: '已参与人数 / 升级所需人数',
    },
    {
      id: 'price',
      label: '发行价₵',
      value: formatCurrency(price, { useWUnit: true }),
    },
    {
      id: 'total',
      label: '发行量',
      value: formatInteger(10000 + (currentLevel - 1) * 7500),
    },
  ];

  return (
    <Card
      className="gap-y-2 border-0 rounded-md shadow p-0 overflow-hidden cursor-pointer hover:shadow-md transition duration-300"
      onClick={() => {
        openCharacterDrawer(characterId, 'ico');
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
            <BadgeLevel level={currentLevel} title="ico等级" />
            <ChevronsRight className="size-3 shrink-0 inline-block opacity-40" />
            <BadgeLevel level={realLevel} title="上市等级" />
          </div>
          <div className="flex items-center gap-1 mt-0.5 text-xs cursor-pointer opacity-60">
            #{characterId}
          </div>
        </div>
        <div className="flex flex-row w-full items-center gap-x-1 text-xs">
          {infoItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-1 flex-col"
              title={item.title ? item.title : undefined}
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
        <div className="flex flex-col w-full">
          <div className="flex flex-row items-center mb-0.5">
            <div
              className="flex-1 text-xs truncate opacity-60"
              title={`₵${formatCurrency(total)}`}
            >
              <span>
                已筹集
                <span className="text-green-400 dark:text-green-600 mx-1">
                  ₵{formatCurrency(total, { useWUnit: true })}
                </span>
              </span>
            </div>
            <div
              className="text-xs truncate opacity-60"
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
          <IcoProgress
            currentLevel={currentLevel}
            total={total}
            minAmount={minAmount}
            nextAmount={nextAmount}
          />
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="text-xs truncate opacity-60">
            <span
              className={`${
                getRemainingTimeInHours(end) < 1
                  ? 'text-amber-400 dark:text-amber-600'
                  : ''
              }`}
            >
              {calculateRemainingTime(end)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
