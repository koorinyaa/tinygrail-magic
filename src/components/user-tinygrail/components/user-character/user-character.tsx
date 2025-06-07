import { UserCharaPageValue } from '@/api/user';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { fatchUserCharaPageData } from '@/components/user-tinygrail/service/service';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, isEmpty, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { ImageOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CharacterCard } from './character-card';

/**
 * 用户角色
 * @param props
 * @param props.userName 用户名
 * @param props.loading 加载状态
 * @param props.data 数据
 * @param props.setData 设置数据
 */
export function UserCharacter({
  userName,
  loading: pageLoading,
  data,
  setData,
}: {
  userName: string;
  loading: boolean;
  data: UserCharaPageValue | undefined;
  setData: (data: UserCharaPageValue) => void;
}) {
  const { userAssets, toTop, characterDrawer } = useStore();
  const isMobile = useIsMobile();
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 当前页数
  const [currentPage, setCurrentPage] = useState(1);
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
      fatchPageData();
      let top = isMobile ? 104 : 152;
      if (userAssets?.name !== userName && isMobile) {
        top += 44;
      }
      toTop(top);
      prevState.currentPage = currentPage;
    }
    // 抽屉状态从打开变为关闭
    else if (prevState.drawerOpen && !characterDrawer.open) {
      fatchPageData(false);
    }

    // 更新抽屉状态引用
    prevState.drawerOpen = characterDrawer.open;
  }, [currentPage, characterDrawer.open]);

  /**
   * 获取分页数据
   * @param updateLoading 是否更新加载状态
   */
  const fatchPageData = async (updateLoading: boolean = true) => {
    if (loading || pageLoading) return;
    if (updateLoading) {
      setLoading(true);
    }

    try {
      const data = await fatchUserCharaPageData(userName, currentPage);
      setData(data);
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : '获取用户角色数据失败';
      notifyError(errMsg);
    } finally {
      if (updateLoading) {
        setLoading(false);
      }
    }
  };

  if (!data?.Items) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          'flex-1 flex flex-col items-center justify-center gap-y-1 py-8 opacity-60',
          { hidden: !isEmpty(data?.Items) }
        )}
      >
        <ImageOff className="size-12" />
        <span className="text-sm">暂无角色</span>
      </div>
      <div
        className={cn(
          'grid grid-cols-[repeat(auto-fill,minmax(196px,1fr))] gap-2 w-full',
          { hidden: isEmpty(data?.Items) }
        )}
      >
        {loading || pageLoading ? (
          <>
            {Array.from({ length: 24 }).map((_, index) => (
              <Skeleton key={index} className="h-40 w-full rounded-md" />
            ))}
          </>
        ) : (
          <>
            {data?.Items.map((item) => (
              <CharacterCard
                key={item.CharacterId}
                data={item}
                userName={userName}
              />
            ))}
          </>
        )}
      </div>
      <PaginationWrapper
        currentPage={data?.CurrentPage || 1}
        totalPages={data?.TotalPages || 0}
        onPageChange={setCurrentPage}
        className={cn('flex-1 justify-center mt-2', {
          hidden: (data?.TotalPages || 0) <= 1,
        })}
      />
    </div>
  );
}
