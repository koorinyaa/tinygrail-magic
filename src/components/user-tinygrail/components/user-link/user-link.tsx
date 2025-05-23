import { TempleItem } from '@/api/character';
import { UserLinkPageValue } from '@/api/user';
import { Link } from '@/components/link';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, formatInteger, isEmpty, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { ImageOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { fatchUserLinkPageData } from '../../service/service';

/**
 * 用户LINK
 * @param props
 * @param props.userName 用户名称
 * @param props.loading 加载状态
 * @param props.data 数据
 * @param props.setData 设置数据
 */
export function UserLink({
  userName,
  loading: pageLoading,
  data,
  setData,
}: {
  userName: string;
  loading: boolean;
  data: UserLinkPageValue | undefined;
  setData: (data: UserLinkPageValue) => void;
}) {
  const { userAssets, toTop, characterDrawer } = useStore();
  const isMobile = useIsMobile();
  // 过滤掉无效的LINK
  const filteredLinks = data?.Items?.filter((item) => item && item.Link);
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
      const data = await fatchUserLinkPageData(userName, currentPage);
      setData(data);
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : '获取用户LINK数据失败';
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
          {
            hidden: !isEmpty(filteredLinks),
          }
        )}
      >
        <ImageOff className="size-12" />
        <span className="text-sm">暂无LINK</span>
      </div>
      <div
        className={cn(
          'grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(188px,1fr))] gap-2 w-full',
          {
            hidden: isEmpty(filteredLinks),
          }
        )}
      >
        {loading || pageLoading ? (
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
            {filteredLinks?.map((item) => {
              if (!item || !item.Link) return;
              const link1: TempleItem = {
                ...item,
                CharacterName: item.Name || '',
              };
              const link2: TempleItem = {
                ...item.Link,
                CharacterName: item.Link.Name || '',
              };
              return (
                <div
                  key={item.Id}
                  className="flex items-center justify-center w-full h-[132px] sm:h-[164px] overflow-hidden"
                >
                  <div className="flex flex-col w-[188px] scale-80 sm:scale-100">
                    <Link link1={link1} link2={link2} jumpable />
                    <div className="text-xs opacity-60 w-full -mt-0.5 truncate">
                      +
                      {formatInteger(
                        link1.Assets < link2.Assets
                          ? link1.Assets
                          : link2.Assets
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
        currentPage={data?.CurrentPage || 0}
        totalPages={data?.TotalPages || 0}
        onPageChange={setCurrentPage}
        className={cn('flex-1 justify-center mt-1', {
          hidden: (data?.TotalPages || 0) <= 1,
        })}
      />
    </div>
  );
}
