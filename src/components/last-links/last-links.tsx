import { getRecentLinks, RecentLinkValue } from '@/api/temple';
import { Link } from '@/components/link';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { decodeHTMLEntities, formatInteger, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useState } from 'react';

export function LastLinks() {
  const {
    toTop,
    setCurrentPage: setCurrentPageData,
    closeCharacterDrawer,
  } = useStore();
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
    for (let i = 0; i < pageData.Items.length - 1; i++) {
      const currentItem = pageData.Items[i];
      const nextItem = pageData.Items[i + 1];

      if (currentItem.LinkId === nextItem.CharacterId) {
        pairs.push([currentItem, nextItem]);
        i++;
      }
    }
    return pairs;
  };

  /**
   * 跳转到用户的小圣杯
   */
  const goToUserTinygrail = (name: string, nickName: string) => {
    if (!name) return;

    setCurrentPageData({
      main: {
        title: `${decodeHTMLEntities(nickName)}的小圣杯`,
        id: 'user-tinygrail',
      },
      data: {
        userName: name,
      },
    });
    closeCharacterDrawer();
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(188px,1fr))] gap-2 w-full">
        {loading ? (
          <>
            {Array.from({ length: 24 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center w-full"
              >
                <div className="flex flex-col justify-center h-[132px] sm:h-[164px]">
                  <Skeleton className="h-[114px] sm:h-[145px] w-[150px] sm:w-[188px] rounded-md" />
                  <Skeleton className="h-4 w-20 mt-1 rounded-sm" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {getPairedItems().map((pair) => {
              if (!pair || !pair[0] || !pair[1]) return;
              return (
                <div
                  key={pair[0].Id}
                  className="flex items-center justify-center w-full h-[132px] sm:h-[164px] overflow-hidden"
                >
                  <div className="flex flex-col w-[188px] scale-80 sm:scale-100">
                    <Link
                      link1={pair[0]}
                      link2={pair.length > 1 ? pair[1] : pair[0]}
                      jumpable
                    />
                    <div
                      onClick={() => {
                        goToUserTinygrail(
                          pair[0].Name || '',
                          pair[0].Nickname || ''
                        );
                      }}
                      className="text-xs opacity-60 hover:opacity-80 w-full -mt-0.5 truncate cursor-pointer"
                    >
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
