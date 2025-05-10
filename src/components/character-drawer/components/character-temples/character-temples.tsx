import { Link } from '@/components/link';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { TempleCard } from '@/components/ui/temple-card';
import { decodeHTMLEntities, formatInteger } from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useMemo, useState } from 'react';

export function CharacterTemples() {
  const { characterDrawerData } = useStore();
  const {
    characterDetailData,
    characterLinkItems = [],
    characterTempleItems = [],
  } = characterDrawerData;
  const [templeCurrentPage, setTempleCurrentPage] = useState(1);
  const [linkCurrentPage, setLinkCurrentPage] = useState(1);

  // 合并圣殿和链接数据
  const allTempleItems = useMemo(() => {
    return [...characterTempleItems, ...characterLinkItems].sort(
      (a, b) => b.Sacrifices - a.Sacrifices
    );
  }, [characterTempleItems, characterLinkItems]);

  // 计算圣殿总页数
  const templeTotalPages = useMemo(() => {
    const itemsPerPage = 12;
    return Math.max(1, Math.ceil(allTempleItems.length / itemsPerPage));
  }, [allTempleItems]);

  // 获取圣殿当前页的数据
  const currentTemplePageItems = useMemo(() => {
    const itemsPerPage = 12;
    const startIndex = (templeCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allTempleItems.slice(startIndex, endIndex);
  }, [allTempleItems, templeCurrentPage]);

  // 计算LINK总页数
  const linkTotalPages = useMemo(() => {
    const itemsPerPage = 3;
    return Math.max(1, Math.ceil(characterLinkItems.length / itemsPerPage));
  }, [characterLinkItems]);

  // 获取LINK当前页的数据
  const currentLinkPageItems = useMemo(() => {
    const itemsPerPage = 3;
    const startIndex = (linkCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return characterLinkItems.slice(startIndex, endIndex);
  }, [characterLinkItems, linkCurrentPage]);

  // 当数据变化时重置页码
  useEffect(() => {
    setTempleCurrentPage(1);
    setLinkCurrentPage(1);
  }, [characterTempleItems, characterLinkItems]);

  // 圣殿页面切换处理函数
  const handleTemplePageChange = (page: number) => {
    setTempleCurrentPage(page);
  };

  // LINK页面切换处理函数
  const handleLinkPageChange = (page: number) => {
    setLinkCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-y-2 px-2 bg-card">
      <div className="w-full bg-slate-200/50 dark:bg-slate-800/60 rounded-sm p-2">
        <div className="text-xs mb-1.5 opacity-70">LINK</div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(214px,1fr))] gap-2 w-full">
          {currentLinkPageItems.map((item) => {
            if (!item || !item.Link) return null;
            return (
              <div
                key={item.UserId}
                className="flex items-center justify-center w-full"
              >
                <div className="flex flex-col gap-y-1 w-[214px]">
                  <Link
                    link1={{
                      ...item,
                      CharacterName: characterDetailData?.Name || '',
                      CharacterId: characterDetailData?.CharacterId || 0,
                    }}
                    link2={{
                      ...item.Link,
                      CharacterName: item.Link.Name || '',
                    }}
                    jumpable
                  />
                  <div className="text-xs opacity-60 hover:opacity-80 w-full cursor-pointer">
                    @{decodeHTMLEntities(item.Nickname || '')} +
                    {formatInteger(
                      item.Assets < item.Link.Assets
                        ? item.Assets
                        : item.Link.Assets
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {characterLinkItems.length > 3 && (
          <PaginationWrapper
            currentPage={linkCurrentPage}
            totalPages={linkTotalPages}
            onPageChange={handleLinkPageChange}
            size="sm"
            className="h-6.5 mt-2"
          />
        )}
      </div>
      <div className="w-full bg-slate-200/50 dark:bg-slate-800/60 rounded-sm p-2">
        <div className="text-xs mb-1.5 opacity-70">圣殿</div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2 w-full">
          {currentTemplePageItems.map((item) => {
            return (
              <div className="flex flex-col gap-y-1">
                <TempleCard key={item.UserId} data={item} className="w-full" />
                <div className="text-xs opacity-60 hover:opacity-80 w-full cursor-pointer">
                  @{decodeHTMLEntities(item.Nickname || '')}
                </div>
              </div>
            );
          })}
        </div>
        <PaginationWrapper
          currentPage={templeCurrentPage}
          totalPages={templeTotalPages}
          onPageChange={handleTemplePageChange}
          size="sm"
          className="h-6.5 mt-2"
        />
      </div>
    </div>
  );
}
