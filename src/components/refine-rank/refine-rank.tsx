import { getRefineRank, RefineRankValue } from '@/api/temple';
import BadgeLevel from '@/components/ui/badge-level';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { TempleCard } from '@/components/ui/temple-card';
import { cn, decodeHTMLEntities, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useRef, useState } from 'react';

/**
 * 精炼排行
 */
export function RefineRank() {
  const { toTop, openCharacterDrawer } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  // 容器宽度
  const [containerWidth, setContainerWidth] = useState(0);
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 当前页数
  const [currentPage, setCurrentPage] = useState(1);
  // 分页数据
  const [refineRankPageData, setRefineRankPageData] =
    useState<RefineRankValue>();

  // 组件首次加载时获取数据
  useEffect(() => {
    fetchRefineRankPageData();
    toTop();
  }, [currentPage]);

  // 更新容器宽度
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

  /**
   * 获取分页数据
   */
  const fetchRefineRankPageData = async () => {
    setLoading(true);

    try {
      const resp = await getRefineRank(currentPage);
      if (resp.State === 0) {
        setRefineRankPageData(resp.Value);
      } else {
        throw new Error(resp.Message || '获取精炼排行数据失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取精炼排行数据失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div
        ref={containerRef}
        className={cn('grid gap-4 grid-cols-1', {
          'grid-cols-6': containerWidth > 210 * 4 + 3 * 16,
          'grid-cols-4':
            containerWidth > 210 * 3 + 2 * 16 &&
            containerWidth <= 210 * 4 + 3 * 16,
          'grid-cols-3':
            containerWidth > 210 * 2 + 1 * 16 &&
            containerWidth <= 210 * 3 + 2 * 16,
          'grid-cols-2':
            containerWidth > 240 && containerWidth <= 210 * 2 + 1 * 16,
        })}
      >
        {loading ? (
          <>
            {Array.from({ length: 24 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-y-0.5">
                <Skeleton className="w-full aspect-3/4 rounded-md" />
                <div className="flex flex-col gap-y-0.5 h-9">
                  <Skeleton className="w-16 h-4 rounded-sm" />
                  <Skeleton className="w-20 h-4 rounded-sm" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {refineRankPageData?.Items.map((item, index) => (
              <div key={item.Id} className="flex flex-col gap-y-0.5">
                <TempleCard data={item} className="m-shadow-card" />
                <div className="flex flex-row items-center gap-x-1.5">
                  <div
                    className="text-3xl font-mono tabular-nums flex justify-center opacity-30"
                    title="排名"
                  >
                    {Math.max(0, (currentPage - 1) * 24 + index + 1) < 10
                      ? `0${Math.max(0, (currentPage - 1) * 24 + index + 1)}`
                      : Math.max(0, (currentPage - 1) * 24 + index + 1)}
                  </div>
                  <div className="flex flex-col gap-y-0.5 w-full overflow-hidden">
                    <div
                      className="flex items-center text-xs font-semibold cursor-pointer"
                      onClick={() => {
                        openCharacterDrawer(item.CharacterId);
                      }}
                    >
                      <span className="truncate">
                        {decodeHTMLEntities(item.CharacterName)}
                      </span>
                      <BadgeLevel level={item.CharacterLevel} />
                    </div>
                    <div className="flex items-center text-xs opacity-60 cursor-pointer">
                      <span className="truncate">
                        @{decodeHTMLEntities(item.Nickname || '')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <PaginationWrapper
        currentPage={currentPage}
        totalPages={10}
        onPageChange={setCurrentPage}
        className="flex-1 justify-center mt-4"
      />
    </div>
  );
}
