import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { useState } from 'react';
import { fatchIcoUsersPageData } from '../../service/character';
import { UserItem } from './user-item';

export function IcoUsers() {
  const { characterDrawer, icoDrawerData, setIcoDrawerData } = useStore();
  const {
    CurrentPage: currentPage = 1, // 当前页码
    TotalPages: totalPages = 1, // 总页数
    Items: items = [], // 用户数据列表
  } = icoDrawerData.icoUsersPageData || {};
  const {
    Id: icoId = 0, // ico id
  } = icoDrawerData.icoDetailData || {};
  // 加载中
  const [loading, setLoading] = useState(false);

  const onPageChange = async (page: number) => {
    if (!characterDrawer.characterId) return;

    setLoading(true);
    try {
      const icoUsersPageData = await fatchIcoUsersPageData(icoId, page);
      setIcoDrawerData({
        icoUsersPageData,
        currentICOUsersPage: page,
      });
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : '获取用户分页数据失败';
      notifyError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-2 px-3 pb-3 mt-2 bg-card">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] w-full gap-2">
        {loading || characterDrawer.loading ? (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="flex flex-row gap-x-1.5">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex flex-col justify-center gap-y-0.5">
                  <Skeleton className="h-4 w-12 rounded-sm" />
                  <Skeleton className="h-4 w-16 rounded-sm" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {items.map((item, index) => (
              <UserItem
                key={item.Id}
                data={item}
                index={(currentPage - 1) * 24 + index + 1}
              />
            ))}
          </>
        )}
      </div>
      <PaginationWrapper
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        size="sm"
        className="h-6.5"
      />
    </div>
  );
}
