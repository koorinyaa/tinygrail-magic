import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaginationWrapper } from "@/components/ui/pagination-wrapper";
import { AlertCircle, UsersRound } from "lucide-react";
import { useEffect, useState } from 'react';
import { getTopWeekHistory, HistoryTopWeekItem } from '@/api/character';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatInteger, getAvatarUrl } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAppState } from "@/components/app-state-provider";
import BadgeLevel from "../ui/badge-level";

/**
 * 历史萌王
 */
export function HistoryTopWeek () {
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 错误信息
  const [error, setError] = useState('');
  // 当前页
  const [currentPage, setCurrentPage] = useState(1);
  // 总页数
  const [totalPages, setTotalPages] = useState(1);
  // 周数
  const [weekInfo, setWeekInfo] = useState('');
  // 历史萌王数据
  const [topWeekHistoryData, setTopWeekHistoryData] = useState<HistoryTopWeekItem[]>([]);

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
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };

  useEffect(() => {
    fetchTopWeekHistoryData();
  }, [currentPage]);

  return (
    <div className="xl:w-100 xl:min-w-100 w-full xl:ml-6 mt-6 xl:mt-0">
      <Card className="p-0 gap-0">
        <CardHeader className="pt-6 pb-4">
          <CardTitle>往期萌王</CardTitle>
          <CardDescription>{weekInfo}</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-4">
          {!error && (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {loading ?
                Array.from({ length: 12 }).map((_, index) => (
                  <TopWeekHistoryItemSkeleton key={index} />
                )) :
                topWeekHistoryData.map((item, index) => (
                  <TopWeekHistoryItem
                    key={index}
                    data={item}
                  />
                ))}
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="px-6 pb-4 pt-0">
          <PaginationWrapper
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardFooter>
      </Card>
    </div>
  )
}


interface TopWeekHistoryItemProps {
  data: HistoryTopWeekItem;
}
/**
 * 历史萌王item
 * @param {TopWeekHistoryItemProps} props
 * @param {HistoryTopWeekItem} props.data - 历史萌王项数据
 */
const TopWeekHistoryItem = ({ data }: TopWeekHistoryItemProps) => {
  const { dispatch } = useAppState();
  const {
    CharacterId,
    CharacterLevel,
    Name,
    Level,
    Price,
    Extra,
    Assets,
    Avatar: characterAvatar
  } = data;

  const handleItemClick = () => dispatch({
    type: "SET_CHARACTER_DRAWER",
    payload: { open: true, characterId: CharacterId }
  });
  return (
    <div
      className="flex flex-row py-2.5 first:pt-0 last:pb-0 cursor-pointer"
      onClick={handleItemClick}
    >
      <div className="w-11 text-4xl font-mono tabular-nums flex justify-center opacity-30" title="排名">
        {Level < 10 ? `0${Level}` : Level}
      </div>
      <Avatar className="size-10 ml-2 rounded-full border-2 border-secondary">
        <AvatarImage
          className="object-cover object-top"
          src={getAvatarUrl(characterAvatar)}
          alt={Name || ''}
        />
        <AvatarFallback className="rounded-lg">C</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-y-1 ml-3 flex-1 overflow-hidden">
        <div className="flex items-center text-sm">
          <span className="truncate">{Name}</span>
          <BadgeLevel level={CharacterLevel} zeroCount={CharacterLevel} />
        </div>
        {/* <div
          className="text-xs opacity-60 truncate"
          title="角色ID"
        >
          #{CharacterId}
        </div> */}
        <div
          className="text-xs opacity-60 truncate"
          title="溢出金额 / 拍卖总金额"
        >
          +₵{formatCurrency(Extra, { maximumFractionDigits: 0 })} / ₵{formatCurrency(Price, { maximumFractionDigits: 0 })}
        </div>
      </div>
      <div
        className="flex items-center opacity-30 gap-1 pl-2 ml-auto"
        title="参与人数"
      >
        <UsersRound className="size-4" />
        <span className="text-sm">{formatInteger(Assets)}</span>
      </div>
    </div>
  )
}

/**
 * 历史萌王项骨架
 */
const TopWeekHistoryItemSkeleton = () => {
  return (
    <div className="flex flex-row py-2.5 items-center first:pt-0 last:pb-0">
      <Skeleton className="h-10 w-11" />
      <Skeleton className="size-10 ml-2 rounded-full" />
      <div className="ml-3 space-y-2 flex-1">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      <Skeleton className="h-4 w-8 ml-auto" />
    </div>
  )
}
