import { getTopWeekHistory, HistoryTopWeekItem } from '@/api/character';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Item } from './components/item';

/**
 * 历史萌王
 */
export function HistoryTopWeek() {
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

  useEffect(() => {
    fetchTopWeekHistoryData();
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
    <div className="xl:w-90 xl:min-w-90 w-full mt-6 xl:mt-0">
      <Card className="p-0 gap-0">
        <CardHeader className="pt-6 pb-4">
          <CardTitle>往期萌王</CardTitle>
          {loading ? (
            <Skeleton className="h-5 w-24 rounded-sm" />
          ) : (
            <CardDescription>{weekInfo}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="px-6 pb-4">
          {!error && (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {loading ? (
                <div>
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div
                      key={index}
                      className="py-2.5 first:pt-0 last:pb-0 cursor-pointer"
                    >
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {topWeekHistoryData.map((item, index) => (
                    <Item key={index} data={item} />
                  ))}
                </div>
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
        </CardContent>
        <CardFooter className="px-6 pb-3 pt-0">
          <PaginationWrapper
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
