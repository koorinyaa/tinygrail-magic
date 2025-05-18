import { CharacterICOItem, getCharacterICO } from '@/api/character';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BadgeLevel from '@/components/ui/badge-level';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import {
  calculateICOInfo,
  decodeHTMLEntities,
  formatCurrency,
  formatDateTime,
  formatInteger,
  getAvatarUrl,
  notifyError,
} from '@/lib/utils';
import { useStore } from '@/store';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { ChevronsRight } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * 最近活跃ICO
 */
export function RecentICOLog() {
  const { openCharacterDrawer } = useStore();
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 页数
  const [currentPage, setCurrentPage] = useState(1);
  // 最近活跃角色数据项
  // 数据项
  const [icoItems, setIcoItems] = useState<CharacterICOItem[]>([]);
  // 用于强制刷新时间显示的计数器
  const [timeRefreshCounter, setTimeRefreshCounter] = useState(0);

  useEffect(() => {
    fetchCharacterICOData();

    const stop = initializeRealtimeConnection();

    // 设置每3秒更新一次时间格式化的定时器
    const timeRefreshInterval = setInterval(() => {
      setTimeRefreshCounter((prev) => prev + 1);
    }, 3000);

    return () => {
      clearInterval(timeRefreshInterval);

      if (stop) {
        stop
          .then((cleanup) => {
            if (typeof cleanup === 'function') {
              cleanup();
            }
          })
          .catch((error) => {
            console.error('清理连接时发生异常:', error);
          });
      }
    };
  }, []);

  /**
   * 初始化订阅
   * @returns stop
   */
  const initializeRealtimeConnection = async (): Promise<
    (() => void) | undefined
  > => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl('https://tinygrail.com/actionhub')
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            const delay = Math.min(
              retryContext.previousRetryCount * 1000,
              5000
            );
            console.error(
              `连接中断，正在第${
                retryContext.previousRetryCount + 1
              }次重连 (${delay}ms)`
            );
            return delay;
          },
        })
        .build();

      connection.onclose((error) => {
        if (error) {
          console.error('SignalR连接异常断开:', error);
        }
      });

      connection.on('ReceiveCharacterInitial', (update: CharacterICOItem) => {
        if (!loading && currentPage === 1) {
          setIcoItems((prevItems) => {
            const existingIndex = prevItems.findIndex(
              (item) => item.CharacterId === update.CharacterId
            );
            const newItems = [...prevItems];

            if (existingIndex !== -1) {
              newItems.splice(existingIndex, 1);
            }

            return [update, ...newItems];
          });
        }
      });

      await connection.start();
      return () => {
        if (connection) {
          connection.stop().catch((stopError) => {
            console.error('断开连接时发生异常:', stopError.message);
          });
        }
      };
    } catch (error) {
      console.error('连接异常:', error);
    }
  };

  /**
   * 获取ICO数据
   */
  const fetchCharacterICOData = async () => {
    setLoading(true);

    try {
      const resp = await getCharacterICO('rai');
      if (resp.State === 0) {
        setIcoItems(resp.Value);
      } else {
        throw new Error(resp.Message || '获取ICO列表数据失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取ICO列表数据失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="xl:w-90 xl:min-w-90 w-full mt-6 xl:mt-0">
      <Card className="p-0 gap-0">
        <CardHeader className="px-4 md:px-6 pt-6 pb-2">
          <CardTitle>最近活跃</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4">
          <div className="flex flex-col gap-y-1 divide-y divide-slate-100 dark:divide-slate-800/70">
            {loading ? (
              <>
                {Array.from({ length: 12 }).map((_, index) => (
                  <>
                    <div
                      key={index}
                      className="flex flex-row items-center gap-1.5 py-1"
                    >
                      <Skeleton className="size-10 rounded-full" />
                      <div className="flex-1 flex flex-col justify-center gap-y-0.5">
                        <Skeleton className="w-20 h-4 rounded-sm" />
                        <Skeleton className="w-32 h-4 rounded-sm" />
                      </div>
                    </div>
                  </>
                ))}
              </>
            ) : (
              <>
                {icoItems
                  .slice()
                  .slice((currentPage - 1) * 12, currentPage * 12)
                  .map((ico) => {
                    const { currentLevel, realLevel } = calculateICOInfo(ico);
                    return (
                      <div
                        key={ico.CharacterId}
                        className="flex flex-row gap-1.5 cursor-pointer py-1"
                        onClick={() => {
                          openCharacterDrawer(ico.CharacterId, 'ico');
                        }}
                      >
                        <Avatar className="size-10 rounded-full border-2 border-secondary">
                          <AvatarImage
                            className="object-cover object-top pointer-events-none"
                            src={getAvatarUrl(ico.Icon)}
                          />
                          <AvatarFallback className="rounded-full">
                            C
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex flex-col justify-center gap-y-0.5 overflow-hidden">
                          <div className="flex items-center text-sm font-bold overflow-hidden">
                            <span className="truncate">
                              {decodeHTMLEntities(ico.Name)}
                            </span>
                            <BadgeLevel level={currentLevel} title="ico等级" />
                            <ChevronsRight className="size-3 shrink-0 inline-block opacity-40" />
                            <BadgeLevel level={realLevel} title="上市等级" />
                          </div>
                          <div className="flex flex-row flex-wrap gap-x-1 gap-y-0.5 text-xs opacity-60 truncate">
                            <span>
                              人数
                              <span className="mx-0.5 text-green-400 dark:text-green-600">
                                {formatInteger(ico.Users)}
                              </span>
                            </span>
                            <span>
                              已筹集
                              <span className="mx-0.5 text-green-400 dark:text-green-600">
                                {formatCurrency(ico.Total, { useWUnit: true })}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-center text-xs opacity-60">
                          {formatDateTime(ico.Last, 'simple', true)}
                        </div>
                      </div>
                    );
                  })}
              </>
            )}
          </div>
          <PaginationWrapper
            currentPage={currentPage}
            totalPages={Math.ceil(icoItems.length / 12) || 0}
            onPageChange={setCurrentPage}
            className="flex-1 mt-2"
          />
        </CardContent>
      </Card>
    </div>
  );
}
