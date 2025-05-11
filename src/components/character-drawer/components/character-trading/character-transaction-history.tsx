import { CharacterChartItem, getCharacterCharts } from '@/api/character';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn, formatCurrency, formatInteger, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { ChevronDown, LoaderCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

// 排序类型
type SortType = 'price' | 'amount' | 'total' | 'time';
// 排序方向
type SortDirection = 'asc' | 'desc';

/**
 * 角色交易记录
 */
export function CharacterTransactionHistory() {
  const { characterDrawer } = useStore();
  const { characterId } = characterDrawer;
  // 是否正在加载
  const [loading, setLoading] = useState(false);
  // 当前页码
  const [currentPage, setCurrentPage] = useState(1);
  // 角色交易记录
  const [transactionHistory, setTransactionHistory] = useState<
    CharacterChartItem[]
  >([]);
  // 排序类型
  const [sortType, setSortType] = useState<SortType>('time');
  // 排序方向
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    fetchCharacterCharts();
  }, [characterId]);

  /**
   * 获取角色交易记录
   */
  const fetchCharacterCharts = async () => {
    if (!characterId) return;
    setLoading(true);

    try {
      const resp = await getCharacterCharts(characterId);
      if (resp.State == 0) {
        setTransactionHistory(resp.Value.slice().reverse());
      } else {
        throw new Error(resp.Message || '获取角色交易记录失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取角色交易记录失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 渲染日期
   */
  const renderDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return null;
      }

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      // 1分钟内显示秒数
      if (diffSeconds < 60) {
        return `${diffSeconds}秒前`;
      }
      // 1小时内显示分钟
      else if (diffMinutes < 60) {
        return `${diffMinutes}分钟前`;
      }
      // 24小时内显示小时
      else if (diffHours < 24) {
        return `${diffHours}小时前`;
      }
      // 7天内显示天数
      else if (diffDays < 7) {
        return `${diffDays}天前`;
      }

      return (
        <div className="flex flex-col items-end">
          <div className="text-xs">
            {date
              .toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
              .replace(/\//g, '-')}
          </div>
        </div>
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  /**
   * 处理排序
   */
  const handleSort = (type: SortType) => {
    // 如果点击的是当前排序类型，则切换排序方向
    if (type === sortType) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 否则设置新的排序类型，默认降序
      setSortType(type);
      setSortDirection('desc');
    }
    // 重置页码
    setCurrentPage(1);
  };

  /**
   * 获取排序后的数据
   */
  const getSortedData = () => {
    return [...transactionHistory].sort((a, b) => {
      let compareResult = 0;
      switch (sortType) {
        case 'price':
          compareResult = a.Price / a.Amount - b.Price / b.Amount;
          break;
        case 'amount':
          compareResult = a.Amount - b.Amount;
          break;
        case 'total':
          compareResult = a.Price - b.Price;
          break;
        case 'time':
          compareResult =
            new Date(a.Time).getTime() - new Date(b.Time).getTime();
          break;
      }
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
  };

  // 获取排序后的数据
  const sortedData = getSortedData();
  // 分页数据
  const pageSize = 10;
  const currentPageData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 渲染排序图标
  const renderSortIcon = (type: SortType) => {
    // 如果当前排序字段不是自己所在的字段则不显示图标
    if (type !== sortType) return null;

    return (
      <ChevronDown
        className={cn('size-3 transition-transform', {
          'rotate-180': sortDirection === 'asc',
        })}
      />
    );
  };

  return (
    <div className="w-full h-fit flex flex-col">
      <div
        className={cn('flex-1 flex items-center justify-center', {
          hidden: !loading,
        })}
      >
        <LoaderCircleIcon
          className="animate-spin"
          size={16}
          aria-hidden="true"
        />
      </div>
      <div
        className={cn({
          hidden: loading,
        })}
      >
        <div className="overflow-auto">
          <Table className="text-xs">
            <TableHeader className="bg-transparent">
              <TableRow className="hover:bg-transparent">
                <TableHead
                  className="h-6 px-1 opacity-60 hover:opacity-80 cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex flex-row items-center gap-x-1">
                    价格
                    {renderSortIcon('price')}
                  </div>
                </TableHead>
                <TableHead
                  className="h-6 px-1 opacity-60 hover:opacity-80 cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex flex-row items-center gap-x-1">
                    数量
                    {renderSortIcon('amount')}
                  </div>
                </TableHead>
                <TableHead
                  className="h-6 px-1 opacity-60 hover:opacity-80 cursor-pointer"
                  onClick={() => handleSort('total')}
                >
                  <div className="flex flex-row items-center gap-x-1">
                    金额
                    {renderSortIcon('total')}
                  </div>
                </TableHead>
                <TableHead
                  className="h-6 px-1 opacity-60 hover:opacity-80 cursor-pointer text-right"
                  onClick={() => handleSort('time')}
                >
                  <div className="flex flex-row items-center justify-end gap-x-1">
                    交易时间
                    {renderSortIcon('time')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_td:first-child]:rounded-l-sm [&_td:last-child]:rounded-r-sm">
              {currentPageData.map((item) => (
                <TableRow
                  key={item.Id}
                  className="border-none odd:bg-muted/50 odd:hover:bg-muted/50"
                >
                  <TableCell className="p-1">
                    {formatCurrency(item.Price / item.Amount)}
                  </TableCell>
                  <TableCell className="p-1">
                    {formatInteger(item.Amount)}
                  </TableCell>
                  <TableCell className="p-1">
                    {formatCurrency(item.Price, {useWUnit: true})}
                  </TableCell>
                  <TableCell className="p-1 text-right">
                    {renderDateTime(item.Time)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <PaginationWrapper
          currentPage={currentPage}
          totalPages={Math.ceil(sortedData.length / pageSize) || 0}
          onPageChange={setCurrentPage}
          size="sm"
          className="h-6.5 mt-2"
        />
      </div>
    </div>
  );
}
