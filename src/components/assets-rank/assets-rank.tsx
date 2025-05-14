import { getUserAssetRank, UserAssetRankItem } from '@/api/user';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useState } from 'react';
import { AssetsRankCard } from './assets-rank-card';

export function AssetsRank() {
  const { toTop } = useStore();
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 当前页数
  const [currentPage, setCurrentPage] = useState(1);
  // 分页数据
  const [userAssetRankItems, setUserAssetRankItems] = useState<
    UserAssetRankItem[]
  >([]);

  // 页数变化时获取数据
  useEffect(() => {
    fetchUserAssetRankData();
    toTop();
  }, [currentPage]);

  /**
   * 获取资产排名数据
   */
  const fetchUserAssetRankData = async () => {
    setLoading(true);

    try {
      const resp = await getUserAssetRank(currentPage);
      if (resp.State === 0) {
        setUserAssetRankItems(resp.Value);
      } else {
        throw new Error(resp.Message || '获取资产排名数据失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取资产排名数据失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2 lg:gap-4 w-full">
        {loading ? (
          <>
            {Array.from({ length: 20 }).map((_, index) => (
              <Skeleton key={index} className="h-41.5 w-full rounded-md" />
            ))}
          </>
        ) : (
          <>
            {userAssetRankItems.map((item) => (
              <AssetsRankCard key={item.Name} data={item} />
            ))}
          </>
        )}
      </div>
      <PaginationWrapper
        currentPage={currentPage}
        totalPages={5}
        onPageChange={setCurrentPage}
        className="flex-1 justify-center mt-4"
      />
    </div>
  );
}
