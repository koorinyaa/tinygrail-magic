import { BalanceLogPageValue, getBalanceLog } from '@/api/user';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import {
  cn,
  decodeHTMLEntities,
  formatCurrency,
  formatDateTime,
  notifyError,
} from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useRef, useState } from 'react';

/**
 * 资金日志弹窗
 * @param open 是否打开
 * @param onOpenChange 打开状态改变回调
 */
export function AssetsLogDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { openCharacterDrawer } = useStore();
  const contentRef = useRef<HTMLDivElement>(null);
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 当前页
  const [currentPage, setCurrentPage] = useState(1);
  // 分页数据
  const [pageValue, setPageValue] = useState<BalanceLogPageValue>({
    CurrentPage: 1,
    TotalPages: 0,
    TotalItems: 0,
    ItemsPerPage: 0,
    Items: [],
    Context: null,
  });

  useEffect(() => {
    if (open) {
      fatchBalanceLog();
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
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
    }
  }, [currentPage, open]);

  /**
   * 获取资金日志
   */
  const fatchBalanceLog = async () => {
    setLoading(true);

    try {
      const res = await getBalanceLog(currentPage);
      if (res.State === 0) {
        setPageValue(res.Value);
      } else {
        throw new Error(res.Message ?? '获取资金日志失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '获取资金日志失败';
      notifyError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
 * 处理文本中的ID
 * @param text 需要处理的文本
 * @returns 处理后的JSX元素数组
 */
const processIdsInText = (text: string) => {
  // 匹配#号开头但前面不是「字符，后面是数字的ID
  const regex = /(?<!「)(#\d+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // 获取完整匹配和ID
    const [id] = match;
    const matchIndex = match.index;

    // 添加ID前的文本
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    // 添加span标签
    parts.push(
      <span
        key={matchIndex}
        className="text-cyan-400 dark:text-cyan-600 hover:text-cyan-500 dark:hover:text-cyan-500 cursor-pointer"
        onClick={() => {
          const numericId = parseInt(id.substring(1), 10);
          openCharacterDrawer(numericId);
        }}
      >
        {id}
      </span>
    );

    // 更新lastIndex为当前匹配结束位置
    lastIndex = matchIndex + id.length;
  }

  // 添加剩余文本
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-4 rounded-xl">
        <div className="w-full h-fit flex flex-col gap-y-2">
          <div className="flex flex-row space-x-2">
            <h2 className="text-lg font-semibold">资金日志</h2>
          </div>
          <div className="flex flex-col">
            <div
              ref={contentRef}
              className="flex flex-col min-h-20 !max-h-[calc(80dvh-4.75rem)] !max-h-[calc(80vh-4.75rem)] relative overflow-auto"
            >
              {loading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              )}
              {pageValue.Items.map((item) => (
                <div
                  key={item.Id}
                  className="flex flex-row gap-x-1 p-1.5 odd:bg-muted/50 odd:hover:bg-muted/50"
                >
                  <div className="flex-1 flex flex-col">
                    <div>
                      <span className="text-sm font-semibold">
                        ₵{formatCurrency(item.Balance)}
                      </span>
                      {item.Change !== 0 && (
                        <span
                          className={cn('ml-1 text-xs', {
                            'text-pink-400 dark:text-pink-600': item.Change < 0,
                            'text-sky-400 dark:text-sky-600': item.Change >= 0,
                          })}
                        >
                          {item.Change < 0 ? '-' : '+'}₵
                          {formatCurrency(Math.abs(item.Change))}
                        </span>
                      )}
                    </div>
                    <div className="text-xs">
                      {processIdsInText(decodeHTMLEntities(item.Description))}
                    </div>
                  </div>
                  <div className="flex items-center text-xs opacity-60">
                    {formatDateTime(item.LogTime, 'simple', true)}
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
