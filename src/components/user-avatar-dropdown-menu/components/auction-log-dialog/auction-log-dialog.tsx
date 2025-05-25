import {
  AuctionItem,
  getAuctionList,
  getUserAuctions,
  UserAuctionPageValue,
} from '@/api/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import {
  cn,
  decodeHTMLEntities,
  formatCurrency,
  formatDateTime,
  formatInteger,
  getAvatarUrl,
  notifyError,
} from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useRef, useState } from 'react';

/**
 * 拍卖日志弹窗
 * @param open 是否打开
 * @param onOpenChange 打开状态改变回调
 */
export function AuctionLogDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { characterDrawer, openCharacterDrawer } = useStore();
  const contentRef = useRef<HTMLDivElement>(null);
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 当前页
  const [currentPage, setCurrentPage] = useState(1);
  // 分页数据
  const [pageValue, setPageValue] = useState<UserAuctionPageValue>({
    CurrentPage: 1,
    TotalPages: 0,
    TotalItems: 0,
    ItemsPerPage: 0,
    Items: [],
    Context: null,
  });
  // 拍卖信息
  const [auctionItems, setAuctionItems] = useState<{
    [key: number]: AuctionItem;
  }>({});

  // 记录上一次的值
  const prevStateRef = useRef({
    drawerOpen: characterDrawer.open,
  });

  useEffect(() => {
    // 只有弹窗打开才请求数据
    if (open) {
      fatchUserAuctions();
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
      return;
    }
    // 弹窗关闭
    if (!open) {
      setCurrentPage(1);
      setPageValue({
        CurrentPage: 1,
        TotalPages: 0,
        TotalItems: 0,
        ItemsPerPage: 0,
        Items: [],
        Context: null,
      });
      return;
    }
  }, [currentPage, open]);

  useEffect(() => {
    const prevState = prevStateRef.current;

    // 抽屉状态从打开变为关闭
    if (prevState.drawerOpen && !characterDrawer.open) {
      fatchUserAuctions(false);
      return;
    }
    // 记录上一次的抽屉状态
    prevState.drawerOpen = characterDrawer.open;
  }, [characterDrawer.open]);

  /**
   * 获取拍卖记录
   * @param {boolean} [updateLoading=true] - 是否更新loading状态
   */
  const fatchUserAuctions = async (updateLoading: boolean = true) => {
    if (updateLoading) {
      setLoading(true);
    }

    try {
      const res = await getUserAuctions(currentPage);
      if (res.State === 0) {
        setPageValue(res.Value);
        const characterIds = res.Value.Items.map((item) => item.CharacterId);
        fatchAuctionList(characterIds);
      } else {
        throw new Error(res.Message ?? '获取拍卖记录失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '获取拍卖记录失败';
      notifyError(errMsg);
    } finally {
      if (updateLoading) {
        setLoading(false);
      }
    }
  };

  /**
   * 获取拍卖数据
   */
  const fatchAuctionList = async (ids: number[]) => {
    if (ids.length <= 0) return;

    try {
      const resp = await getAuctionList(ids);
      if (resp.State === 0) {
        const auctionInfo: {
          [key: number]: AuctionItem;
        } = {};
        resp.Value.forEach((item) => {
          auctionInfo[item.CharacterId] = item;
        });
        setAuctionItems(auctionInfo);
      } else {
        throw new Error(resp.Message || '获取拍卖数据失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取拍卖数据失败';
      console.error(errorMessage);
    }
  };

  /**
   * 竞拍结果Badge
   * @param result 竞拍结果
   */
  const RenderAuctionResultBadge = ({ result }: { result: number }) => {
    switch (result) {
      case 1:
        return (
          <Badge
            variant="secondary"
            className="bg-green-500 dark:bg-green-600 text-white font-bold px-1 py-0 rounded-sm scale-75"
          >
            成功
          </Badge>
        );
      case 0:
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-500 dark:bg-yellow-600 text-white font-bold px-1 py-0 -mx-0.5 rounded-sm scale-75"
          >
            竞拍中
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-slate-400 dark:bg-slate-600 text-white font-bold px-1 py-0 rounded-sm scale-75"
          >
            失败
          </Badge>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-4 rounded-xl">
        <div className="w-full h-fit flex flex-col gap-y-2 overflow-hidden">
          <div className="flex flex-row space-x-2">
            <h2 className="text-lg font-semibold">我的拍卖</h2>
          </div>
          <div className="flex flex-col w-full overflow-hidden">
            <div
              ref={contentRef}
              className={cn(
                'flex flex-col min-h-20 !max-h-[calc(80dvh-6.875rem)] !max-h-[calc(80vh-6.875rem)] relative overflow-auto',
                {
                  'overflow-hidden': loading,
                }
              )}
            >
              {loading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              )}
              {pageValue.Items.map((item) => (
                <div
                  key={item.Id}
                  className="flex flex-row gap-x-1 p-1.5 odd:bg-muted/50 odd:hover:bg-muted/50 w-full cursor-pointer"
                  onClick={() => openCharacterDrawer(item.CharacterId)}
                >
                  <div className="flex-1 flex flex-row gap-x-1 w-full">
                    <div>
                      <Avatar className="size-10 rounded-full border-2 border-secondary">
                        <AvatarImage
                          className="object-cover object-top pointer-events-none"
                          src={getAvatarUrl(item.Icon)}
                        />
                        <AvatarFallback className="rounded-full">
                          C
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="flex flex-row flex-wrap items-end gap-x-1">
                        <span className="text-sm font-semibold truncate">
                          {decodeHTMLEntities(item.Name || '')}
                        </span>
                        <span className="text-xs text-nowrap text-foreground/60">
                          {formatDateTime(item.Bid, 'simple', true)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center text-xs">
                        <span className="text-nowrap">
                          出价
                          <span className="ml-1 text-green-400 dark:text-green-600">
                            ₵{formatCurrency(item.Price)}
                          </span>
                        </span>
                        <span className="mx-1 opacity-80">·</span>
                        <span className="text-nowrap">
                          数量
                          <span className="ml-1 text-green-400 dark:text-green-600">
                            {formatInteger(item.Amount)}
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center text-xs">
                        <span className="text-nowrap">
                          竞拍人数
                          <span className="ml-1 text-green-400 dark:text-green-600">
                            {formatInteger(
                              auctionItems[item.CharacterId]?.State || 0
                            )}
                          </span>
                        </span>
                        <span className="mx-1 opacity-80">·</span>
                        <span className="text-nowrap">
                          竞拍数量
                          <span className="ml-1 text-green-400 dark:text-green-600">
                            {formatInteger(
                              auctionItems[item.CharacterId]?.Type || 0
                            )}
                          </span>
                        </span>
                        <span className="mx-1 opacity-80">·</span>
                        <span className="text-nowrap">
                          英灵殿
                          <span className="ml-1 text-green-400 dark:text-green-600">
                            {formatInteger(item.Type)}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <RenderAuctionResultBadge result={item.State} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <PaginationWrapper
              currentPage={currentPage}
              totalPages={pageValue.TotalPages}
              onPageChange={setCurrentPage}
              size="sm"
              className="h-6.5 mt-2"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
