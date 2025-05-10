import { CharacterAuctionItem, getCharacterAuctionList } from '@/api/character';
import { Badge } from '@/components/ui/badge';
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
import { ChevronDown, LoaderCircleIcon, NotepadText } from 'lucide-react';
import { useEffect, useState } from 'react';

// 排序类型
type SortType = 'price' | 'amount' | 'time' | 'state';
// 排序方向
type SortDirection = 'asc' | 'desc';

/**
 * 竞拍历史记录
 */
export function AuctionHistory() {
  const { characterDrawer } = useStore();
  const { characterId } = characterDrawer;
  // 是否正在加载
  const [loading, setLoading] = useState(false);
  // 当前页码
  const [currentPage, setCurrentPage] = useState(1);
  // 拍卖历史记录
  const [auctionHistory, setAuctionHistory] = useState<CharacterAuctionItem[]>(
    []
  );
  // 排序类型
  const [sortType, setSortType] = useState<SortType>('price');
  // 排序方向
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    fetchCharacterAuctionList();
  }, [characterId, currentPage]);

  useEffect(() => {
    setAuctionHistory(getSortedData(auctionHistory));
  }, [sortType, sortDirection]);

  /**
   * 获取拍卖历史记录
   */
  const fetchCharacterAuctionList = async () => {
    if (!characterId) return;
    setLoading(true);

    try {
      const resp = await getCharacterAuctionList(characterId, currentPage);
      if (resp.State == 0) {
        setAuctionHistory(getSortedData(resp.Value));
      } else {
        throw new Error(resp.Message || '获取拍卖历史记录失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取拍卖历史记录失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
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
  };

  /**
   * 获取排序后的数据
   * @param auctionHistory 拍卖历史记录
   */
  const getSortedData = (auctionHistory: CharacterAuctionItem[]) => {
    return [...auctionHistory].sort((a, b) => {
      let compareResult = 0;
      switch (sortType) {
        case 'price':
          compareResult = a.Price - b.Price;
          break;
        case 'amount':
          compareResult = a.Amount - b.Amount;
          break;
        case 'state':
          compareResult = b.State - a.State;
          break;
        case 'time':
          compareResult = new Date(a.Bid).getTime() - new Date(b.Bid).getTime();
          break;
      }
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
  };

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
        className={cn(
          '!h-[calc(60dvh+2.125rem)] h-[calc(60vh+2.125rem)] flex items-center justify-center',
          { hidden: !loading }
        )}
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
        <div className="!h-[60dvh] h-[60vh] p-1 overflow-auto">
          <Table className="text-xs">
            <TableHeader className="bg-popover sticky -top-1.5 z-10">
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
                <TableHead className="h-6 max-w-20 px-1 opacity-60">
                  <div className="flex flex-row items-center gap-x-1">
                    拍卖人
                  </div>
                </TableHead>
                <TableHead
                  className="h-6 px-1 opacity-60 hover:opacity-80 cursor-pointer"
                  onClick={() => handleSort('state')}
                >
                  <div className="flex flex-row items-center gap-x-1">
                    结果
                    {renderSortIcon('state')}
                  </div>
                </TableHead>
                <TableHead
                  className="h-6 px-1 opacity-60 hover:opacity-80 cursor-pointer text-right"
                  onClick={() => handleSort('time')}
                >
                  <div className="flex flex-row items-center justify-end gap-x-1">
                    拍卖时间
                    {renderSortIcon('time')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_td:first-child]:rounded-l-sm [&_td:last-child]:rounded-r-sm">
              {auctionHistory.length > 0 ? (
                auctionHistory.map((item) => (
                  <TableRow
                    key={item.Id}
                    className="border-none odd:bg-muted/50 odd:hover:bg-muted/50"
                  >
                    <TableCell className="p-1">
                      {formatCurrency(item.Price)}
                    </TableCell>
                    <TableCell className="p-1">
                      {formatInteger(item.Amount)}
                    </TableCell>
                    <TableCell className="p-1 max-w-20 truncate">
                      {item.Nickname}
                    </TableCell>
                    <TableCell className="p-1">
                      <Badge
                        variant="secondary"
                        className={cn(
                          'font-bold px-1 py-0 text-white rounded-sm scale-75',
                          {
                            'bg-green-500 dark:bg-green-600': item.State === 1,
                            'bg-slate-400 dark:bg-slate-600': item.State !== 1,
                          }
                        )}
                      >
                        {item.State === 1 ? '成功' : '失败'}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-1 text-right">
                      <div className="flex flex-col items-end">
                        <div className="text-xs">
                          {new Date(item.Bid)
                            .toLocaleDateString('zh-CN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })
                            .replace(/\//g, '-')}
                        </div>
                        <div className="text-xs opacity-70">
                          {new Date(item.Bid).toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false,
                          })}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={5}
                    className="!h-[40dvh] h-[40vh] p-0 border-none"
                  >
                    <div className="flex flex-col items-center justify-center h-full gap-y-1 opacity-60">
                      <NotepadText className="size-12" />
                      <span className="text-sm">暂无数据</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <PaginationWrapper
          currentPage={currentPage}
          totalPages={Math.ceil(
            (Date.now() - new Date('2019-09-03').getTime()) /
              (7 * 24 * 60 * 60 * 1000)
          )}
          onPageChange={setCurrentPage}
          size="sm"
          className="h-6.5 mt-2"
        />
      </div>
    </div>
  );
}
