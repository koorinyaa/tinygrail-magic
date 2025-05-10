import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { useState } from 'react';
import { fetchCharacterUsersPageData } from '../../service/character';
import { UserItem } from './user-item';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * 持股用户
 */
export function CharacterUsers() {
  const { characterDrawer, characterDrawerData, setCharacterDrawerData } =
    useStore();
  const {
    CurrentPage: currentPage = 1, // 当前页码
    TotalPages: totalPages = 1, // 总页数
    TotalItems: totalItems = 0, // 总条数
    Items: items = [], // 用户数据列表
  } = characterDrawerData.characterUsersPageData || {};
  // 流通量
  const { Total: characterTotal = 0 } =
    characterDrawerData.characterDetailData || {};
  // 加载中
  const [loading, setLoading] = useState(false);

  const onPageChange = async (page: number) => {
    if (!characterDrawer.characterId) return;

    setLoading(true);
    try {
      const characterUsersPageData = await fetchCharacterUsersPageData(
        characterDrawer.characterId,
        page
      );
      setCharacterDrawerData({
        characterUsersPageData,
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
    <div className="flex flex-col gap-y-2 px-2 bg-card">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] w-full gap-2">
        {loading ? (
          <>
            {Array.from({ length: 24 }).map((_, i) => (
              <div className="flex flex-row gap-x-1.5">
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
                characterTotal={characterTotal}
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
