import { CharacterDetail, getBabel } from '@/api/character';
import { StarTowerLog } from '@/components/star-tower-log';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, notifyError } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const [containerWidth, setContainerWidth] = useState(0);
  const [characterItems, setCharacterItems] = useState<CharacterDetail[]>([]);
  const dataFetchedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [LogDrawerOpen, setLogDrawerOpen] = useState(false);

  /**
   * 获取通天塔角色数据
   */
  const fetchBabelData = useCallback(async () => {
    if (dataFetchedRef.current) return;

    try {
      dataFetchedRef.current = true;

      for (let page = 1; page <= 10; page++) {
        const resp = await getBabel(page, 50);
        if (resp.State == 0) {
          setCharacterItems((prev) => [...prev, ...resp.Value]);
        } else {
          throw new Error(resp.Message || '获取通天塔角色失败');
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取通天塔角色失败';
      notifyError(errorMessage);
      dataFetchedRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchBabelData();

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setContainerWidth(width);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchBabelData]);

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

  // 获取分组数量
  const groupCount = useMemo(() => {
    return Math.ceil(characterItems.length / 50);
  }, [characterItems.length]);

  // 创建分组索引数组，每5组显示一个索引
  const groupIndices = useMemo(() => {
    const indices = [];
    const step = 2; // 每100个数据显示一个索引（2个50数据的组）

    for (let i = 0; i < groupCount; i += step) {
      indices.push(i);
    }

    return indices;
  }, [groupCount]);

  // 跳转到指定分组
  const scrollToGroup = useCallback(
    (groupIndex: number) => {
      if (virtuosoRef.current) {
        // 计算该分组的起始项索引
        let startIndex = 0;
        for (let i = 0; i < groupIndex; i++) {
          startIndex += groupCounts[i] || 0;
        }

        // @ts-ignore
        virtuosoRef.current.scrollToIndex({
          index: startIndex,
          align: 'start',
          behavior: 'smooth',
        });

        setActiveIndex(groupIndex);

        // 1秒后重置活动索引
        setTimeout(() => {
          setActiveIndex(null);
        }, 1000);
      }
    },
    [groupCounts]
  );

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
        <div ref={containerRef} className="flex-1 h-full relative">
          {groupCounts.length > 0 && (
            <GroupedVirtuoso
              ref={virtuosoRef}
              style={{ height: '100%', width: '100%' }}
              groupCounts={groupCounts}
              groupContent={(index) => (
                <div className="p-1 bg-background text-sm text-foreground/60 font-medium">
                  {index * 50 + 1}-
                  {Math.min((index + 1) * 50, characterItems.length)}
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
          {groupIndices.length > 1 && (
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col items-center justify-center z-10">
              <div
                className="bg-secondary/40 rounded-full py-2 px-1 text-xs flex flex-col items-center shadow-md m-scrollbar-none"
                style={{
                  maxHeight: '70vh',
                  overflowY: groupIndices.length > 10 ? 'auto' : 'visible',
                }}
              >
                {groupIndices.map((groupIndex) => (
                  <button
                    key={groupIndex}
                    className={cn(
                      'w-6 h-6 flex items-center justify-center rounded-full my-0.5 transition-colors font-medium text-xs cursor-pointer',
                      activeIndex === groupIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary text-foreground/80'
                    )}
                    onClick={() => scrollToGroup(groupIndex)}
                    title={`跳转到 ${groupIndex * 50 + 1}-${Math.min(
                      (groupIndex + 2) * 50,
                      characterItems.length
                    )}`}
                  >
                    {Math.min((groupIndex + 2) * 50, characterItems.length)}
                  </button>
                ))}
              </div>
            </div>
          )}
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
          className={cn('bg-card border-none overflow-hidden h-full', {
            'max-w-96 rounded-l-md': !isMobile,
            '!max-h-[90dvh] max-h-[90vh]': isMobile,
          })}
        >
          <VisuallyHidden asChild>
            <DrawerTitle />
          </VisuallyHidden>
          <div className="h-full flex flex-col px-4 py-3">
            <div className="font-semibold mt-2 mb-4">
              通天塔日志
            </div>
            <div className='flex-1 pb-3 overflow-hidden'>
              <StarTowerLog onCloseDrawer={() => setLogDrawerOpen(false)} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
