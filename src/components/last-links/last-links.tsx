import { getRecentLinks, RecentLinkValue } from '@/api/temple';
import { Link } from '@/components/link';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import {
  cn,
  decodeHTMLEntities,
  formatInteger,
  notifyError,
} from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useRef, useState } from 'react';

export function LastLinks() {
  const { toTop } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  // 容器宽度
  const [containerWidth, setContainerWidth] = useState(0);
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 当前页数
  const [currentPage, setCurrentPage] = useState(1);
  // 分页数据
  const [pageData, setPageData] = useState<RecentLinkValue>();

  useEffect(() => {
    fetchRecentLinksPageData();
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
  const fetchRecentLinksPageData = async () => {
    setLoading(true);

    try {
      const resp = await getRecentLinks(currentPage);
      if (resp.State === 0) {
        setPageData(resp.Value);
      } else {
        throw new Error(resp.Message || '获取LINK分页数据失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取LINK分页数据失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 将数据两两分组
  const getPairedItems = () => {
    if (!pageData?.Items || pageData.Items.length === 0) return [];

    const pairs = [];
    for (let i = 0; i < pageData.Items.length; i += 2) {
      if (i + 1 < pageData.Items.length) {
        pairs.push([pageData.Items[i], pageData.Items[i + 1]]);
      } else {
        pairs.push([pageData.Items[i]]);
      }
    }
    return pairs;
  };

  return (
    <div className="flex flex-col">
      <div
        ref={containerRef}
        className={cn(
          'grid grid-cols-[repeat(auto-fill,minmax(214px,1fr))] gap-x-2 gap-y-4 w-full',
          {
            'grid-cols-4': containerWidth >= 900,
          }
        )}
      >
        {loading ? (
          <>
            {Array.from({ length: 12 }).map((_, index) => (
              <div className="flex items-center justify-center w-full">
                <Skeleton
                  key={index}
                  className="h-[164px] w-[214px] rounded-md"
                />
              </div>
            ))}
          </>
        ) : (
          <>
            {getPairedItems().map((pair) => {
              return (
                <div
                  key={pair[0].Id}
                  className="flex items-center justify-center w-full"
                >
                  <div className="flex flex-col gap-y-1 w-[214px]">
                    <Link
                      link1={pair[0]}
                      link2={pair.length > 1 ? pair[1] : pair[0]}
                      jumpable
                    />
                    <div className="text-xs opacity-60 hover:opacity-80 w-full truncate cursor-pointer">
                      @{decodeHTMLEntities(pair[0].Nickname || '')} +
                      {formatInteger(
                        pair[0].Assets < pair[1].Assets
                          ? pair[0].Assets
                          : pair[1].Assets
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
      <PaginationWrapper
        currentPage={currentPage}
        totalPages={pageData?.TotalPages || 0}
        onPageChange={setCurrentPage}
        className="flex-1 justify-center mt-4"
      />
    </div>
  );
}
