import { CharacterDetail, getRankCharacters } from '@/api/character';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useRef, useState } from 'react';
import { RankCard } from './rank-card';

/**
 * 角色排名
 * @param props
 * @param {'msrc' | 'mvc' | 'mrc' | 'mfc'} props.type 排名类型
 */
export function RankCharacters({
  type,
}: {
  type: 'msrc' | 'mvc' | 'mrc' | 'mfc';
}) {
  const { toTop, characterDrawer } = useStore();
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 当前页数
  const [currentPage, setCurrentPage] = useState(1);
  // 分页数据
  const [msrcCharaPageItems, setMsrcCharaPageItems] = useState<
    CharacterDetail[]
  >([]);

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
      fetchRankCharaPageData();
      toTop();
      prevState.currentPage = currentPage;
    }
    // 抽屉状态从打开变为关闭
    else if (prevState.drawerOpen && !characterDrawer.open) {
      fetchRankCharaPageData(currentPage, false);
    }

    // 更新抽屉状态引用
    prevState.drawerOpen = characterDrawer.open;
  }, [currentPage, characterDrawer.open]);

  // 监听类型变化
  useEffect(() => {
    if (currentPage === 1) {
      fetchRankCharaPageData();
      toTop();
    } else {
      setCurrentPage(1);
    }
  }, [type]);

  /**
   * 获取分页数据
   * @param {number} [page] - 页数
   * @param {boolean} [updateLoading=true] - 是否更新loading状态
   */
  const fetchRankCharaPageData = async (
    page?: number,
    updateLoading: boolean = true
  ) => {
    if (updateLoading) {
      setLoading(true);
    }

    try {
      const resp = await getRankCharacters(type, page ? page : currentPage);
      if (resp.State === 0) {
        setMsrcCharaPageItems(resp.Value);
      } else {
        throw new Error(resp.Message || '获取最高股息角色失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取最高股息角色失败';
      notifyError(errorMessage);
    } finally {
      if (updateLoading) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(212px,1fr))] gap-2 w-full">
        {loading ? (
          <>
            {Array.from({ length: 24 }).map((_, index) => (
              <Skeleton key={index} className="h-42 w-full rounded-md" />
            ))}
          </>
        ) : (
          <>
            {msrcCharaPageItems.map((item) => (
              <RankCard key={item.CharacterId} data={item} type={type} />
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
