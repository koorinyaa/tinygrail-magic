import {
  AuctionItem,
  getAuctionList,
  getUserCharaList,
  UserCharaPageValue,
} from '@/api/user';
import { AuctionDialog } from '@/components/auction-dialog';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useRef, useState } from 'react';
import { TinygrailCard } from './tinygrail-card';

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
  // 拍卖弹窗打开状态
  const [auctionDialogOpen, setAuctionDialogOpen] = useState(false);
  // 当前拍卖弹窗的角色信息
  const [
    currentAuctionDialogCharacterInfo,
    setCurrentAuctionDialogCharacterInfo,
  ] = useState({
    id: 0,
    name: '',
  });

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
      fetchTinygrailCharaPageData();
      toTop();
      prevState.currentPage = currentPage;
    }
    // 抽屉状态从打开变为关闭
    else if (prevState.drawerOpen && !characterDrawer.open) {
      fetchTinygrailCharaPageData(false);
    }

    // 更新抽屉状态引用
    prevState.drawerOpen = characterDrawer.open;
  }, [currentPage, characterDrawer.open]);

  // 组件首次加载时获取数据
  useEffect(() => {
    fetchTinygrailCharaPageData();
    toTop();
  }, []);

  /**
   * 获取分页数据
   * @param {boolean} [updateLoading=true] - 是否更新loading状态
   */
  const fetchTinygrailCharaPageData = async (updateLoading: boolean = true) => {
    if (updateLoading) {
      setLoading(true);
    }

    try {
      const resp = await getUserCharaList('tinygrail', currentPage);
      if (resp.State === 0) {
        setTinygrailCharaPageData(resp.Value);
        // 更新拍卖信息
        const characterIds = resp.Value.Items.map((item) => item.CharacterId);
        if (characterIds.length > 0) {
          fatchAuctionList(characterIds);
        }
      } else {
        throw new Error(resp.Message || '获取英灵殿角色失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取英灵殿角色失败';
      notifyError(errorMessage);
    } finally {
      if (updateLoading) {
        setLoading(false);
      }
    }
  };

  /**
   * 获取拍卖数据
   */
  const fatchAuctionList = async (ids: number[]) => {
    if (ids.length <= 0) return;

    try {
      const resp = await getAuctionList(ids);
      if (resp.State === 0) {
        const auctionInfo: {
          [key: number]: AuctionItem;
        } = {};
        resp.Value.forEach((item) => {
          auctionInfo[item.CharacterId] = item;
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

  /**
   * 拍卖
   * @param {number} characterId - 角色ID
   * @param {string} characterName - 角色名称
   */
  const handleAuction = (characterId: number, characterName: string) => {
    setCurrentAuctionDialogCharacterInfo({
      id: characterId,
      name: characterName,
    });
    setAuctionDialogOpen(true);
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2 w-full">
        {loading ? (
          <>
            {Array.from({ length: 24 }).map((_, index) => (
              <Skeleton key={index} className="h-47 w-full rounded-md" />
            ))}
          </>
        ) : (
          <>
            {tinygrailCharaPageData?.Items.map((item) => (
              <TinygrailCard
                key={item.CharacterId}
                data={item}
                auctionInfo={auctionItems[item.CharacterId]}
                handleAuction={() => {
                  handleAuction(item.CharacterId, item.Name);
                }}
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
      {auctionDialogOpen && (
        <AuctionDialog
          characterInfo={currentAuctionDialogCharacterInfo}
          open={auctionDialogOpen}
          onOpenChange={(open) => {
            setAuctionDialogOpen(open);
            setCurrentAuctionDialogCharacterInfo({
              id: 0,
              name: '',
            });
            if (!open) {
              fetchTinygrailCharaPageData(false);
            }
          }}
        />
      )}
    </div>
  );
}
