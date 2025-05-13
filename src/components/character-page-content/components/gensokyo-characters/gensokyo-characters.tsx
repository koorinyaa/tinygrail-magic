import { getUserCharaList, UserCharaPageValue } from '@/api/user';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useState } from 'react';
import { GensokyoCard } from './gensokyo-card';

/**
 * 幻想乡角色
 */
export function GensokyoCharacters() {
  const { toTop, characterDrawer } = useStore();
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 当前页数
  const [currentPage, setCurrentPage] = useState(1);
  // 分页数据
  const [gensokyoCharaPageData, setGensokyoCharaPageData] =
    useState<UserCharaPageValue>();

  // 监听页数变化
  useEffect(() => {
    fetchGensokyoCharaPageData();
    toTop();
  }, [currentPage]);

  // 监听角色抽屉关闭变化
  useEffect(() => {
    if (!characterDrawer.open) {
      fetchGensokyoCharaPageData(false);
    }
  }, [characterDrawer.open]);

  /**
   * 获取分页数据
   * @param {boolean} [updateLoading=true] - 是否更新loading状态
   */
  const fetchGensokyoCharaPageData = async (updateLoading: boolean = true) => {
    if (updateLoading) {
      setLoading(true);
    }

    try {
      const resp = await getUserCharaList('blueleaf', currentPage);
      if (resp.State === 0) {
        setGensokyoCharaPageData(resp.Value);
      } else {
        throw new Error(resp.Message || '获取幻想乡角色失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取幻想乡角色失败';
      notifyError(errorMessage);
    } finally {
      if (updateLoading) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2 w-full">
        {loading ? (
          <>
            {Array.from({ length: 24 }).map((_, index) => (
              <Skeleton key={index} className="h-42 w-full rounded-md" />
            ))}
          </>
        ) : (
          <>
            {gensokyoCharaPageData?.Items.map((item) => (
              <GensokyoCard key={item.CharacterId} data={item} />
            ))}
          </>
        )}
      </div>
      <PaginationWrapper
        currentPage={currentPage}
        totalPages={gensokyoCharaPageData?.TotalPages || 0}
        onPageChange={setCurrentPage}
        className="flex-1 justify-center mt-4"
      />
    </div>
  );
}
