import { IcoProgress } from '@/components/ico-progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BadgeLevel from '@/components/ui/badge-level';
import { Skeleton } from '@/components/ui/skeleton';
import {
  calculateICOInfo,
  calculateRemainingTime,
  cn,
  decodeHTMLEntities,
  formatCurrency,
  formatDateTime,
  formatInteger,
  getAvatarUrl,
  ICOInfoResult,
} from '@/lib/utils';
import { useStore } from '@/store';
import { ChevronsRight, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MoreAction } from './more-action';

/**
 * ico信息
 */
export function IcoInfo() {
  const { characterDrawer, icoDrawerData } = useStore();
  const { icoDetailData } = icoDrawerData;
  const { characterId, loading = false } = characterDrawer;
  const {
    Icon: icon = '',
    Name: name = '',
    Users: users = 0,
    Total: total = 0,
    End: end = '',
  } = icoDetailData || {};
  const [icoInfo, setIcoInfo] = useState<ICOInfoResult>();
  const {
    currentLevel = 0,
    realLevel = 0,
    nextAmount = 0,
    minAmount = 0,
    price = 0,
  } = icoInfo || {};
  // 用于强制刷新时间显示的计数器
  const [timeRefreshCounter, setTimeRefreshCounter] = useState(0);

  useEffect(() => {
    if (!icoDetailData) return;
    const icoInfo = calculateICOInfo(icoDetailData);
    setIcoInfo(icoInfo);
  }, [icoDetailData]);

  useEffect(() => {
    // 设置每1秒更新一次时间格式化的定时器
    const timeRefreshInterval = setInterval(() => {
      setTimeRefreshCounter((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timeRefreshInterval);
    };
  }, [end]);

  /**
   * 复制角色ID
   */
  const coypCharacterId = () => {
    if (!characterId) return;
    navigator.clipboard
      .writeText(`#${characterId.toString()}`)
      .then(() => {
        toast.success('复制成功');
      })
      .catch((err) => {
        console.error('复制失败: ', err);
      });
  };

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

  const icoDetail = [
    {
      id: 'users',
      label: '参与者',
      value: `${formatInteger(users)}/${formatInteger(
        (currentLevel + 1) * 5 + 10
      )}`,
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

  if (loading) {
    return (
      <div className="mt-20 p-3 bg-card rounded-md relative">
        <div className="absolute -top-6 left-4 z-10">
          <div className="size-16 rounded-full bg-card">
            <Skeleton className="size-16 rounded-full border-2 border-secondary" />
          </div>
        </div>
        <div className="h-12" />
        <div className="flex flex-row">
          <div className="flex flex-1 flex-col">
            <Skeleton className="h-5 w-24 rounded-sm" />
            <Skeleton className="h-4 w-12 mt-1.5 rounded-sm" />
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-y-1.5">
          <div className="flex flex-row items-center gap-x-1">
            <Skeleton className="flex-1 rounded-sm h-12.5" />
            <Skeleton className="flex-1 rounded-sm h-12.5" />
            <Skeleton className="flex-1 rounded-sm h-12.5" />
          </div>
          <Skeleton className="h-10 rounded-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 p-3 bg-card rounded-t-md relative">
      <div className="absolute -top-6 left-4">
        <div
          className="relative flex size-16 shrink-0 items-center justify-center rounded-full z-10"
          aria-hidden="true"
          id="avatar"
        >
          <Avatar className="size-16 rounded-full border-2 border-secondary">
            <AvatarImage
              className="object-cover object-top pointer-events-none"
              src={getAvatarUrl(icon)}
              alt={name}
            />
            <AvatarFallback className="rounded-full">C</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="h-12 relative">
        <MoreAction />
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-row gap-x-8">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex flex-row items-center text-md text-foreground font-semibold">
              <a
                href={`/character/${characterId}`}
                target="_black"
                className="truncate"
              >
                {decodeHTMLEntities(name)}
              </a>
              {icoInfo && (
                <>
                  <BadgeLevel level={currentLevel} title="ico等级" />
                  <ChevronsRight className="size-3 shrink-0 inline-block opacity-40" />
                  <BadgeLevel level={realLevel} title="上市等级" />
                </>
              )}
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
        </div>
        <div className="flex flex-col text-xs gap-y-1.5">
          <div className="flex flex-row items-center gap-x-1">
            {icoDetail.map((item) => (
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
        </div>
        <div className="flex flex-col gap-y-0.5 w-full">
          <div className="flex flex-row items-center">
            <div className="flex-1 text-xs truncate opacity-60">
              <span>
                已筹集
                <span
                  className="text-green-400 dark:text-green-600 mx-1"
                  title={`₵${formatCurrency(total)}`}
                >
                  ₵{formatCurrency(total, { useWUnit: true })}
                </span>
                升级还需
                <span className="text-green-400 dark:text-green-600 mx-1">
                  ₵{formatCurrency(Math.max(0, nextAmount - total))}
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
          <div
            className="flex items-center justify-center w-full text-xs overflow-hidden opacity-60"
            title="结束时间"
          >
            <span
              className={cn('truncate', {
                'text-amber-400 dark:text-amber-600':
                  getRemainingTimeInHours(end) < 1,
              })}
            >
              {formatDateTime(end, 'simple')}（{calculateRemainingTime(end)}）
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
