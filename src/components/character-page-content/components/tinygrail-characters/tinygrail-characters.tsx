import { getUserCharaList, UserCharaPageValue } from '@/api/user';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { notifyError } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { TinygrailCard } from './tinygrail-card';
import { useStore } from '@/store';

/**
 * 英灵殿角色
 */
export function TinygrailCharacters() {
  const { toTop } = useStore();
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 当前页数
  const [currentPage, setCurrentPage] = useState(1);
  // 分页数据
  const [tinygrailCharaPageData, setTinygrailCharaPageData] =
    useState<UserCharaPageValue>();

  // 监听页数变化
  useEffect(() => {
    fetchTinygrailCharaPageData();
    toTop();
  }, [currentPage]);

  /**
   * 获取分页数据
   */
  const fetchTinygrailCharaPageData = async () => {
    setLoading(true);

    try {
      const resp = await getUserCharaList('tinygrail', currentPage);
      if (resp.State === 0) {
        setTinygrailCharaPageData(resp.Value);
      } else {
        throw new Error(resp.Message || '获取英灵殿角色失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取英灵殿角色失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2 w-full">
        {loading ? (
          <>
            {Array.from({ length: 24 }).map((_, index) => (
              <Skeleton key={index} className="h-50 w-full rounded-md" />
            ))}
          </>
        ) : (
          <>
            {tinygrailCharaPageData?.Items.map((item) => (
              <TinygrailCard key={item.CharacterId} data={item} />
            ))}
          </>
        )}
      </div>
      <PaginationWrapper
        currentPage={currentPage}
        totalPages={tinygrailCharaPageData?.TotalPages || 0}
        onPageChange={setCurrentPage}
        className="flex-1 justify-center mt-4"
      />
    </div>
  );
}
