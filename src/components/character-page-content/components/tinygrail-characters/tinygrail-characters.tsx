import {
  AuctionItem,
  getAuctionList,
  getUserCharaList,
  UserCharaPageValue,
} from '@/api/user';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { notifyError } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { TinygrailCard } from './tinygrail-card';
import { useStore } from '@/store';

/**
 * 英灵殿角色
 */
export function TinygrailCharacters() {
  const { toTop, characterDrawer } = useStore();
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 当前页数
  const [currentPage, setCurrentPage] = useState(1);
  // 分页数据
  const [tinygrailCharaPageData, setTinygrailCharaPageData] =
    useState<UserCharaPageValue>();
  // 拍卖信息
  const [auctionItems, setAuctionItems] = useState<{
    [key: number]: AuctionItem;
  }>({});

  // 监听页数变化
  useEffect(() => {
    fetchTinygrailCharaPageData();
    toTop();
  }, [currentPage]);

  useEffect(() => {
    if (tinygrailCharaPageData && !characterDrawer.open) {
      fatchAuctionList();
    }
  }, [tinygrailCharaPageData, characterDrawer.open]);
  /**
   * 获取分页数据
   */
  const fetchTinygrailCharaPageData = async () => {
    setLoading(true);

    try {
      const resp = await getUserCharaList('tinygrail', currentPage);
      if (resp.State === 0) {
        setTinygrailCharaPageData(resp.Value);
      } else {
        throw new Error(resp.Message || '获取英灵殿角色失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取英灵殿角色失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取拍卖数据
   */
  const fatchAuctionList = async () => {
    if (!tinygrailCharaPageData) return;

    try {
      const characterIds = tinygrailCharaPageData.Items.map(
        (item) => item.CharacterId
      );
      if (characterIds.length === 0) return;
      
      const resp = await getAuctionList(characterIds);
      if (resp.State === 0) {
        const auctionInfo: {
          [key: number]: AuctionItem;
        } = {};
        resp.Value.forEach((item) => {
          if (item.Id > 0 && item.Price > 0 && item.Amount > 0) {
            auctionInfo[item.CharacterId] = item;
          }
        });
        setAuctionItems(auctionInfo);
      } else {
        throw new Error(resp.Message || '获取拍卖数据失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取拍卖数据失败';
      console.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2 w-full">
        {loading ? (
          <>
            {Array.from({ length: 24 }).map((_, index) => (
              <Skeleton key={index} className="h-50 w-full rounded-md" />
            ))}
          </>
        ) : (
          <>
            {tinygrailCharaPageData?.Items.map((item) => (
              <TinygrailCard
                key={item.CharacterId}
                data={item}
                auctionInfo={auctionItems[item.CharacterId]}
              />
            ))}
          </>
        )}
      </div>
      <PaginationWrapper
        currentPage={currentPage}
        totalPages={tinygrailCharaPageData?.TotalPages || 0}
        onPageChange={setCurrentPage}
        className="flex-1 justify-center mt-4"
      />
    </div>
  );
}
