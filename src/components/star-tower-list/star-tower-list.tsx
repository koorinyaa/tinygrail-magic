import { CharacterDetail, getBabel } from '@/api/character';
import { StarTowerItem } from './star-tower-item';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { cn, notifyError } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * 通天塔角色列表
 */
export function StarTowerList() {
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [characterItems, setCharacterItems] = useState<CharacterDetail[]>([]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setContainerWidth(width);
      if (width >= 640) {
        setPageSize(100);
      } else {
        setPageSize(50);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchBabelData();
  }, [page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  /**
   * 获取通天塔角色数据
   */
  const fetchBabelData = async () => {
    setLoading(true);
    try {
      const resp = await getBabel(page, pageSize);
      if (resp.State === 0) {
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

  return (
    <div className="w-full">
      <Card className="p-0 gap-0">
        <CardHeader className="px-3 md:px-6 pt-6 pb-4 flex flex-row flex-wrap items-center justify-between">
          <div className="text-xl font-bold w-22">通天塔(β)</div>
          <PaginationWrapper
            currentPage={page}
            totalPages={Math.max(1, Math.ceil(500 / pageSize))}
            onPageChange={setPage}
            size="sm"
            className="flex-1 justify-end"
          />
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-4">
          <div
            ref={containerRef}
            className={cn('grid', {
              'grid-cols-10': containerWidth >= 640,
              'grid-cols-5': containerWidth < 640,
            })}
          >
            {loading ? (
              <>
                {Array.from({ length: pageSize }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="w-full aspect-square rounded-none border"
                  />
                ))}
              </>
            ) : (
              <>
                {characterItems.map((character) => (
                  <StarTowerItem key={character.CharacterId} data={character} />
                ))}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
