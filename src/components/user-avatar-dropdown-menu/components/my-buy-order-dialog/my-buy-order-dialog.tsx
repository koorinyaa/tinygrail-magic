import { getUserBids, UserBidsPageValue } from '@/api/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BadgeLevel from '@/components/ui/badge-level';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import {
  cn,
  decodeHTMLEntities,
  formatDateTime,
  formatInteger,
  getAvatarUrl,
  notifyError,
} from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useRef, useState } from 'react';

/**
 * 我的买单
 * @param open 是否打开
 * @param onOpenChange 打开状态改变回调
 */
export function MyBuyOrderDialog({
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
  const [pageValue, setPageValue] = useState<UserBidsPageValue>({
    CurrentPage: 1,
    TotalPages: 0,
    TotalItems: 0,
    ItemsPerPage: 0,
    Items: [],
    Context: null,
  });

  // 记录上一次的值
  const prevStateRef = useRef({
    drawerOpen: characterDrawer.open,
  });

  useEffect(() => {
    // 只有弹窗打开才请求数据
    if (open) {
      fatchUserBids();
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
      fatchUserBids(false);
      return;
    }
    // 记录上一次的抽屉状态
    prevState.drawerOpen = characterDrawer.open;
  }, [characterDrawer.open]);

  /**
   * 获取买单
   * @param {boolean} [updateLoading=true] - 是否更新loading状态
   */
  const fatchUserBids = async (updateLoading: boolean = true) => {
    if (updateLoading) {
      setLoading(true);
    }

    try {
      const res = await getUserBids(currentPage);
      if (res.State === 0) {
        setPageValue(res.Value);
      } else {
        throw new Error(res.Message ?? '获取买单失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '获取买单失败';
      notifyError(errMsg);
    } finally {
      if (updateLoading) {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-4 rounded-xl">
        <div className="w-full h-fit flex flex-col gap-y-2 overflow-hidden">
          <div className="flex flex-row space-x-2">
            <h2 className="text-lg font-semibold">我的买单</h2>
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
              {pageValue.Items.map((item, index) => (
                <div
                  key={index}
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
                      <div className="flex flex-row items-center gap-x-1">
                        <span className="text-sm font-semibold truncate">
                          {decodeHTMLEntities(item.Name || '')}
                        </span>
                        <BadgeLevel
                          level={item.Level}
                          zeroCount={item.ZeroCount}
                        />
                      </div>
                      <div className="flex flex-wrap items-center text-xs">
                        <span className="text-nowrap">
                          数量
                          <span className="ml-1 text-green-400 dark:text-green-600">
                            {formatInteger(item.State)}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-xs opacity-60">
                      {formatDateTime(item.LastOrder, 'simple', true)}
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
