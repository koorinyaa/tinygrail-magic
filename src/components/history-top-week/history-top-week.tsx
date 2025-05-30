import { getTopWeekHistory, HistoryTopWeekItem } from '@/api/character';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CardDescription } from '@/components/ui/card';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Item } from './components/item';

/**
 * 历史萌王
 * @param onCloseDrawer 关闭抽屉
 */
export function HistoryTopWeek({
  onCloseDrawer,
}: {
  onCloseDrawer?: () => void;
}) {
  const isMobile = useIsMobile(448);
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 错误信息
  const [error, setError] = useState('');
  // 当前页
  const [currentPage, setCurrentPage] = useState(1);
  // 总页数
  const [totalPages, setTotalPages] = useState(1);
  // 周数
  const [weekInfo, setWeekInfo] = useState('-');
  // 历史萌王数据
  const [topWeekHistoryData, setTopWeekHistoryData] = useState<
    HistoryTopWeekItem[]
  >([]);
  // 滚动容器引用
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTopWeekHistoryData();
    // 页数变化时滚动到顶部
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  const fetchTopWeekHistoryData = async () => {
    try {
      setLoading(true);

      const response = await getTopWeekHistory(currentPage);

      if (response.State === 0) {
        setTopWeekHistoryData([...response.Value.Items].reverse());
        setTotalPages(response.Value.TotalPages);
        if (response.Value.Items.length > 0) {
          const createDate = new Date(response.Value.Items[0].Create);
          const year = createDate.getFullYear();
          const weekNumber = getWeekNumber(createDate);
          setWeekInfo(`${year}年第${weekNumber}周`);
        }
        setError('');
      } else {
        throw new Error(response.Message || '获取往期萌王数据失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求失败');
      console.error('获取往期萌王数据失败:', err);
      setTopWeekHistoryData([]);
    } finally {
      setLoading(false);
    }
  };

  // 获取周数
  const getWeekNumber = (date: Date): number => {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    // 将日期调整到本周的周四(ISO标准中周四所在的周即为该周)
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };

  return (
    <div
      className={cn('h-full flex flex-col px-4 md:px-6 py-3 overflow-hidden', {
        'pt-0': isMobile,
      })}
    >
      <div className="flex flex-col gap-y-1.5 mt-2 mb-3">
        <div className="font-semibold">往期萌王</div>
        {loading ? (
          <Skeleton className="h-5 w-24 rounded-sm" />
        ) : (
          <CardDescription>{weekInfo}</CardDescription>
        )}
      </div>
      <div
        ref={scrollContainerRef}
        className={cn('h-full overflow-y-auto', {
          'pr-2': isMobile,
        })}
      >
        {!error && (
          <div className="flex flex-col gap-y-1 divide-y divide-slate-100 dark:divide-slate-800/70">
            {loading ? (
              <>
                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className="py-1 cursor-pointer"
                  >
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                ))}
              </>
            ) : (
              <>
                {topWeekHistoryData.map((item, index) => (
                  <Item key={index} data={item} onCloseDrawer={onCloseDrawer} />
                ))}
              </>
            )}
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
      <PaginationWrapper
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        size={isMobile ? 'sm' : 'md'}
        className={cn('h-8 mt-2 mb-0.5', {
          'h-6': isMobile,
        })}
      />
    </div>
  );
}
