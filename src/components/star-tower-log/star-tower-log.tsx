import { getStarLog, StarLogItem } from '@/api/character';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import {
  cn,
  decodeHTMLEntities,
  formatDateTime,
  formatInteger,
  getAvatarUrl,
  notifyError,
} from '@/lib/utils';
import { useStore } from '@/store';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useState } from 'react';

/**
 * 通天塔日志
 */
export function StarTowerLog() {
  const { openCharacterDrawer } = useStore();
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 页数
  const [page, setPage] = useState(1);
  // 总页数
  const [pageTotal, setPageTotal] = useState(0);
  // 通天塔日志数据项
  const [starLogItems, setStarLogItems] = useState<StarLogItem[]>([]);

  useEffect(() => {
    const stop = initializeRealtimeConnection();

    return () => {
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

  useEffect(() => {
    fetchStarLog();
  }, [page]);

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

      connection.on('ReceiveStarLog', (log: StarLogItem) => {
        setStarLogItems((prevItems) => {
          const newItems = [log, ...prevItems].slice(0, 12);
          return newItems;
        });
      });

      // connection.on('ReceiveCharacterInitial', (data: any) => {
      //   console.log('[ico]', data);
      // });

      // connection.on('ReceiveCharacter', (update: any) => {
      //   console.log('[最近活跃]', update);
      // });

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
   * 获取通天塔日志
   */
  const fetchStarLog = async () => {
    setLoading(true);
    try {
      const resp = await getStarLog(page);
      if (resp.State === 0) {
        setStarLogItems(resp.Value.Items);
        setPageTotal(resp.Value.TotalPages);
      } else {
        throw new Error(resp.Message || '获取通天塔日志失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取通天塔日志失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取日志消息
   * @param log
   * @returns
   */
  const getLogMessage = (log: StarLogItem) => {
    switch (log.Type) {
      case 0:
        return (
          <span className="text-pink-500 truncate">
            星之力 @{decodeHTMLEntities(log.Nickname)} +
            {formatInteger(log.Amount)}
          </span>
        );
      case 2:
        return (
          <span className="text-pink-500 truncate">
            鲤鱼之眼 @{decodeHTMLEntities(log.Nickname)} -
            {formatInteger(log.Amount)}
          </span>
        );
      case 3:
        return (
          <span className="text-pink-500 truncate">
            精炼成功 @{decodeHTMLEntities(log.Nickname)} +
            {formatInteger(log.Amount)}
          </span>
        );
      case 4:
        return (
          <span className="text-sky-500 truncate">
            精炼失败 @{decodeHTMLEntities(log.Nickname)} +
            {formatInteger(log.Amount)}
          </span>
        );
      default:
        return (
          <span className="text-sky-500 truncate">
            受到攻击 -{formatInteger(log.Amount)}
          </span>
        );
    }
  };

  return (
    <div className="xl:w-80 xl:min-w-80 w-full mt-6 xl:mt-0">
      <Card className="p-0 gap-0">
        <CardHeader className="pt-6 pb-2">
          <CardTitle>通天塔日志</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-4">
          <div className="flex flex-col gap-y-1 divide-y divide-slate-100 dark:divide-slate-800/70">
            {loading ? (
              <>
                {Array.from({ length: 12 }).map((_, index) => (
                  <>
                    <div key={index} className="flex flex-row items-center gap-1.5 py-1">
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
                {starLogItems.map((log) => (
                  <div
                    className="flex flex-row items-center gap-1.5 cursor-pointer py-1"
                    onClick={() => {
                      openCharacterDrawer(log.CharacterId);
                    }}
                  >
                    <Avatar className="size-10 rounded-full border-2 border-secondary">
                      <AvatarImage
                        className="object-cover object-top pointer-events-none"
                        src={getAvatarUrl(log.Icon)}
                      />
                      <AvatarFallback className="rounded-full">
                        C
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex flex-col justify-center gap-y-0.5 overflow-hidden">
                      <div className="flex items-center text-sm font-bold overflow-hidden">
                        <span className="truncate">{log.CharacterName}</span>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'bg-slate-400 dark:bg-slate-600 text-white font-bold font-mono px-1 py-0 rounded-sm scale-80',
                            {
                              'bg-violet-500 dark:bg-violet-600':
                                log.Rank <= 500,
                            }
                          )}
                        >
                          #{log.Rank}
                        </Badge>
                        {log.Rank !== log.OldRank && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              'bg-slate-400 dark:bg-slate-600 text-white font-bold font-mono px-1 py-0 -ml-0.5 gap-x-px rounded-sm scale-80',
                              {
                                'bg-pink-500 dark:bg-pink-600':
                                  log.OldRank > log.Rank,
                                'bg-sky-500 dark:bg-sky-600':
                                  log.OldRank < log.Rank,
                              }
                            )}
                          >
                            <span>{log.OldRank > log.Rank ? '↑' : '↓'}</span>
                            <span>{Math.abs(log.OldRank - log.Rank)}</span>
                          </Badge>
                        )}
                      </div>
                      <div className="h-4 text-xs opacity-60 overflow-hidden">
                        {getLogMessage(log)}
                      </div>
                    </div>
                    <div className="flex items-center text-xs opacity-60">
                      {formatDateTime(log.LogTime, 'simple', true)}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <PaginationWrapper
            currentPage={page}
            totalPages={pageTotal}
            onPageChange={setPage}
            className="flex-1 mt-2"
          />
        </CardContent>
      </Card>
    </div>
  );
}
