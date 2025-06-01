import { CharacterDetail, getBabel } from '@/api/character';
import { StarTowerLog } from '@/components/star-tower-log';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, notifyError } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GroupedVirtuoso } from 'react-virtuoso';
import { StarTowerItem } from './star-tower-item';

/**
 * 通天塔角色列表
 */
export function StarTowerList() {
  const isMobile = useIsMobile(448);
  const showLogDrawer = useIsMobile(1280);
  const containerRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [characterItems, setCharacterItems] = useState<CharacterDetail[]>([]);
  const [LogDrawerOpen, setLogDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * 获取通天塔角色数据
   */
  const fetchBabelData = async () => {
    setLoading(true);
    try {
      const resp = await getBabel(currentPage, 100);
      if (resp.State == 0) {
        setCharacterItems(resp.Value);
      } else {
        throw new Error(resp.Message || '获取通天塔角色失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取通天塔角色失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setContainerWidth(width);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (loading) return;
    fetchBabelData();
    if (virtuosoRef.current) {
      // @ts-ignore
      virtuosoRef.current.scrollToIndex({
        index: 0,
        align: 'start',
        behavior: 'smooth',
      });
    }
  }, [currentPage]);

  useEffect(() => {
    if (!showLogDrawer) {
      setLogDrawerOpen(false);
    }
  }, [showLogDrawer]);

  // 根据容器宽度确定每行显示的角色数量
  const columnsPerRow = useMemo(() => {
    return containerWidth >= 640 ? 10 : 5;
  }, [containerWidth]);

  const rows = useMemo(() => {
    const result: CharacterDetail[][][] = [];

    // 每组50个分组
    const groups: CharacterDetail[][] = [];
    for (let i = 0; i < characterItems.length; i += 50) {
      groups.push(characterItems.slice(i, i + 50));
    }

    // 按照columnsPerRow拆分成多行
    groups.forEach((group) => {
      const groupRows: CharacterDetail[][] = [];
      for (let i = 0; i < group.length; i += columnsPerRow) {
        groupRows.push(group.slice(i, i + columnsPerRow));
      }
      result.push(groupRows);
    });

    return result;
  }, [characterItems, columnsPerRow]);

  // 计算每个分组中的行数
  const groupCounts = useMemo(() => {
    return rows.map((groupRows) => groupRows.length);
  }, [rows]);

  return (
    <div className="flex flex-col w-full h-full relative">
      <div className="mb-2 flex flex-wrap flex-row items-center justify-between">
        <h2 className="text-xl font-bold flex-1 w-22">通天塔(β)</h2>
        <Badge
          variant="outline"
          className="flex xl:hidden rounded-full gap-x-0.5 pl-3 cursor-pointer"
          onClick={() => setLogDrawerOpen(true)}
        >
          通天塔日志
          <ChevronRight />
        </Badge>
      </div>
      <div className="flex flex-1 h-full">
        <div
          ref={containerRef}
          className={cn('flex-1 h-full relative', {
            'overflow-hidden': loading,
          })}
        >
          {loading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}
          {groupCounts.length > 0 && (
            <GroupedVirtuoso
              ref={virtuosoRef}
              style={{ height: '100%', width: '100%' }}
              groupCounts={groupCounts}
              groupContent={(index) => (
                <div className="p-1 bg-background text-sm text-foreground/60 font-medium">
                  {(currentPage - 1) * 100 + index * 50 + 1}-
                  {(currentPage - 1) * 100 + (index + 1) * 50}
                </div>
              )}
              itemContent={(index, groupIndex) => {
                // 计算当前行在当前组中的索引
                const rowIndexInGroup =
                  index - groupIndex * groupCounts[groupIndex];
                // 获取当前行的所有角色
                const rowCharacters = rows[groupIndex][rowIndexInGroup];

                return (
                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns: `repeat(${columnsPerRow}, 1fr)`,
                    }}
                  >
                    {rowCharacters.map((character: CharacterDetail) => (
                      <StarTowerItem
                        key={character.CharacterId}
                        data={character}
                      />
                    ))}
                  </div>
                );
              }}
            />
          )}

          {/* 侧边索引条 */}
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col items-center justify-center z-10">
            <div className="bg-secondary/40 rounded-full py-2 px-1 text-xs flex flex-col items-center max-h-[70vh] overflow-y-auto shadow-md m-scrollbar-none">
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      'w-6 h-6 flex items-center justify-center rounded-full my-0.5 transition-colors font-medium text-xs hover:bg-secondary text-foreground/80 cursor-pointer'
                    )}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {(index + 1) * 100}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Drawer
        open={LogDrawerOpen}
        onOpenChange={setLogDrawerOpen}
        direction={isMobile ? 'bottom' : 'right'}
        repositionInputs={false}
      >
        <DrawerContent
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
          }}
          className={cn('bg-card border-none overflow-hidden', {
            'max-w-96 rounded-l-md': !isMobile,
            '!max-h-[90dvh] max-h-[90vh]': isMobile,
          })}
        >
          <VisuallyHidden asChild>
            <DrawerTitle />
          </VisuallyHidden>
          <StarTowerLog onCloseDrawer={() => setLogDrawerOpen(false)} />
        </DrawerContent>
      </Drawer>
    </div>
  );
}
