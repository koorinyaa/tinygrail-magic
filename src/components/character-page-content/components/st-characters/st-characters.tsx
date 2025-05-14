import { getDelistCharacters, STCharacterPageValue } from '@/api/character';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useRef, useState } from 'react';
import { STCard } from './st-card';

/**
 * ST角色
 */
export function STCharacters() {
  const { toTop, characterDrawer } = useStore();
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 当前页数
  const [currentPage, setCurrentPage] = useState(1);
  // 分页数据
  const [stCharaPageData, setStCharaPageData] =
    useState<STCharacterPageValue>();

  // 记录上一次的值
  const prevStateRef = useRef({
    currentPage: 1,
    drawerOpen: characterDrawer.open,
  });

  // 监听页数和角色抽屉关闭变化
  useEffect(() => {
    const prevState = prevStateRef.current;

    // 页数变化
    if (currentPage !== prevState.currentPage) {
      fetchSTCharaPageData();
      toTop();
      prevState.currentPage = currentPage;
    }
    // 抽屉状态从打开变为关闭
    else if (prevState.drawerOpen && !characterDrawer.open) {
      fetchSTCharaPageData(false);
    }

    // 更新抽屉状态引用
    prevState.drawerOpen = characterDrawer.open;
  }, [currentPage, characterDrawer.open]);

  // 组件首次加载时获取数据
  useEffect(() => {
    fetchSTCharaPageData();
    toTop();
  }, []);

  /**
   * 获取分页数据
   * @param {boolean} [updateLoading=true] - 是否更新loading状态
   */
  const fetchSTCharaPageData = async (updateLoading: boolean = true) => {
    if (updateLoading) {
      setLoading(true);
    }

    try {
      const resp = await getDelistCharacters(currentPage);
      if (resp.State === 0) {
        setStCharaPageData(resp.Value);
      } else {
        throw new Error(resp.Message || '获取ST角色失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取ST角色失败';
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
            {stCharaPageData?.Items.map((item) => (
              <STCard key={item.CharacterId} data={item} />
            ))}
          </>
        )}
      </div>
      <PaginationWrapper
        currentPage={currentPage}
        totalPages={stCharaPageData?.TotalPages || 0}
        onPageChange={setCurrentPage}
        className="flex-1 justify-center mt-4"
      />
    </div>
  );
}
