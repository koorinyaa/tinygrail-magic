import { UserTemplePageValue } from '@/api/user';
import BadgeLevel from '@/components/ui/badge-level';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { TempleCard } from '@/components/ui/temple-card';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, decodeHTMLEntities, isEmpty, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { ImageOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { fatchUserTemplePageData } from '../../service/service';

/**
 * 用户圣殿
 * @param props
 * @param props.userName 用户名
 * @param props.loading 加载状态
 * @param props.data 数据
 * @param props.setData 设置数据
 */
export function UserTemple({
  userName,
  loading: pageLoading,
  data,
  setData,
}: {
  userName: string;
  loading: boolean;
  data: UserTemplePageValue | undefined;
  setData: (data: UserTemplePageValue) => void;
}) {
  const { userAssets, toTop, openCharacterDrawer, characterDrawer } =
    useStore();
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
      let top = isMobile ? 104 : 152;
      if (userAssets?.name !== userName && isMobile) {
        top += 44;
      }
      toTop(top);

      const data = await fatchUserTemplePageData(userName, currentPage);
      setData(data);
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : '获取用户圣殿数据失败';
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
        <span className="text-sm">暂无圣殿</span>
      </div>
      <div
        className={cn(
          'grid gap-2 md:gap-4 grid-cols-[repeat(auto-fill,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(124px,1fr))]',
          { hidden: isEmpty(data?.Items) }
        )}
      >
        {loading || pageLoading ? (
          <>
            {Array.from({ length: 24 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-y-0.5">
                <Skeleton className="w-full aspect-3/4 rounded-md" />
                <div className="flex items-center gap-y-0.5 h-4.5">
                  <Skeleton className="w-16 h-3.5 rounded-sm" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {data?.Items.map((item) => (
              <div key={item.Id} className="flex flex-col gap-y-0.5">
                <TempleCard data={item} className="m-shadow-card" />
                <div className="flex flex-row items-center gap-x-1.5">
                  <div className="flex flex-col w-full overflow-hidden">
                    <div
                      className="flex items-center text-xs font-semibold cursor-pointer"
                      onClick={() => {
                        openCharacterDrawer(item.CharacterId);
                      }}
                    >
                      <span className="truncate">
                        {decodeHTMLEntities(item.Name || '')}
                      </span>
                      <BadgeLevel level={item.CharacterLevel} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <PaginationWrapper
        currentPage={data?.CurrentPage || 0}
        totalPages={data?.TotalPages || 0}
        onPageChange={setCurrentPage}
        className={cn('flex-1 justify-center mt-4', {
          hidden: (data?.TotalPages || 0) <= 1,
        })}
      />
    </div>
  );
}
