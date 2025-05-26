import { TopWeekResponse } from '@/api/character';
import { AuctionItem, getAuctionList } from '@/api/user';
import { AuctionDialog } from '@/components/auction-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, getCoverUrl } from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useState } from 'react';
import { TopWeekCard } from '../top-week-card';

interface ContentProps {
  loading: boolean;
  topWeekData: TopWeekResponse | undefined;
  scoreMultiplier: number;
  setIsPhotoSliderOpen: (isOpen: boolean) => void;
  setPhotoSliderSrc: (src: string) => void;
  fetchTopWeekData: (
    isInit?: boolean,
    autoUpdate?: boolean,
    callback?: () => void
  ) => void;
}

/**
 * 内容区域组件
 * @param {ContentSectionProps} props
 * @param {boolean} props.loading - 加载状态
 * @param {TopWeekResponse} props.topWeekData - 萌王投票数据
 * @param {number} props.scoreMultiplier - 评分倍率
 * @param {(isOpen: boolean) => void} props.setIsPhotoSliderOpen - 设置照片查看器是否打开
 * @param {(src: string) => void} props.setPhotoSliderSrc - 设置照片查看器图片地址
 * @param {(isInit?: boolean, autoUpdate?: boolean, callback?: () => void) => void} props.fetchTopWeekData - 加载当前萌王数据
 */
export function Content({
  loading,
  topWeekData,
  scoreMultiplier,
  setIsPhotoSliderOpen,
  setPhotoSliderSrc,
  fetchTopWeekData,
}: ContentProps) {
  const { setCharacterDrawer } = useStore();
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
  // 拍卖信息
  const [auctionItems, setAuctionItems] = useState<{
    [key: number]: AuctionItem;
  }>({});

  useEffect(() => {
    fatchAuctionList();
  }, [topWeekData]);

  /**
   * 获取拍卖数据
   */
  const fatchAuctionList = async () => {
    if (!topWeekData) return;

    try {
      const characterIds = topWeekData.Value.map((item) => item.CharacterId);
      const resp = await getAuctionList(characterIds);
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

  return (
    <>
      <div
        className={cn(
          'grid w-full flex-1 gap-4 2xl:gap-x-6',
          'grid-cols-[repeat(auto-fill,minmax(136px,1fr))]',
          'lg:grid-cols-[repeat(auto-fill,minmax(176px,1fr))]',
          'xl:grid-cols-[repeat(auto-fill,minmax(172px,1fr))]',
          '2xl:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]'
        )}
      >
        {loading || !topWeekData
          ? Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="w-full aspect-[3/4] group">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
            ))
          : topWeekData?.Value.map((item, index) => (
              <TopWeekCard
                key={item.CharacterId}
                className="min-w-32 max-w-60"
                rank={index + 1}
                scoreMultiplier={scoreMultiplier}
                data={item}
                handleCoverPreview={() => {
                  if (item.Cover) {
                    setIsPhotoSliderOpen(true);
                    setPhotoSliderSrc(getCoverUrl(item.Cover, 'large'));
                  }
                }}
                handleCharacterDrawer={(characterId) => {
                  setCharacterDrawer({ open: true, characterId: characterId });
                }}
                handleAuction={() => {
                  setCurrentAuctionDialogCharacterInfo({
                    id: item.CharacterId,
                    name: item.CharacterName || '',
                  });
                  setAuctionDialogOpen(true);
                }}
                auctionInfo={auctionItems[item.CharacterId]}
              />
            ))}
      </div>
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
              fetchTopWeekData(false, true);
            }
          }}
        />
      )}
    </>
  );
}
