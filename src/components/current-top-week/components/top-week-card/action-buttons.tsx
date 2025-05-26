import { CurrentTopWeekItem } from '@/api/character';
import { AuctionItem } from '@/api/user';
import { cn } from '@/lib/utils';
import { Image, Plus, SquareArrowOutUpRight } from 'lucide-react';

/**
 * 操作按钮区域组件
 * @param {ActionButtonsProps} props
 * @param {CurrentTopWeekItem} props.data - 角色数据
 * @param {AuctionItem} props.auctionInfo - 拍卖信息
 * @param {() => void} props.handleCoverPreview - 封面预览事件
 * @param {(characterId: number) => void} props.handleCharacterDrawer - 打开角色抽屉事件
 * @param {(characterId: number) => void} props.handleAuction - 拍卖事件
 */
export function ActionButtons({
  data,
  auctionInfo,
  handleCoverPreview,
  handleCharacterDrawer,
  handleAuction,
}: {
  data: CurrentTopWeekItem;
  auctionInfo: AuctionItem;
  handleCoverPreview: () => void;
  handleCharacterDrawer: (characterId: number) => void;
  handleAuction: (characterId: number) => void;
}) {
  return (
    <div className="absolute top-2 right-2 flex flex-col gap-y-1 text-white z-10">
      <div className="flex flex-row gap-x-1">
        <div
          className={cn(
            'flex items-center justify-center',
            'size-6 rounded-full cursor-pointer',
            'opacity-80 hover:opacity-100',
            'bg-gray-800/50 backdrop-blur-xs',
            {
              'bg-green-800/50':
                auctionInfo &&
                auctionInfo.Id > 0 &&
                auctionInfo.Price > 0 &&
                auctionInfo.Amount > 0,
            }
          )}
          title={
            auctionInfo &&
            auctionInfo.Id > 0 &&
            auctionInfo.Price > 0 &&
            auctionInfo.Amount > 0
              ? '已参与竞拍'
              : '参与竞拍'
          }
          onClick={(e) => {
            e.stopPropagation();
            handleAuction(data.CharacterId);
          }}
        >
          <Plus
            className={cn('size-4', {
              'text-green-400':
                auctionInfo &&
                auctionInfo.Id > 0 &&
                auctionInfo.Price > 0 &&
                auctionInfo.Amount > 0,
            })}
          />
        </div>
        <div
          className={cn(
            'flex items-center justify-center',
            'size-6 rounded-full cursor-pointer',
            'opacity-80 hover:opacity-100',
            'bg-gray-800/50 backdrop-blur-xs'
          )}
          title="打开角色面板"
          onClick={(e) => {
            e.stopPropagation();
            handleCharacterDrawer(data.CharacterId);
          }}
        >
          <SquareArrowOutUpRight className="size-4" />
        </div>
      </div>
      <div className="flex flex-row justify-end gap-x-1">
        {data.Cover && (
          <div
            className={cn(
              'flex items-center justify-center',
              'size-6 rounded-full cursor-pointer',
              'opacity-80 hover:opacity-100',
              'bg-gray-800/50 backdrop-blur-xs'
            )}
            title="查看大图"
            onClick={(e) => {
              e.stopPropagation();
              handleCoverPreview();
            }}
          >
            <Image className="size-4" />
          </div>
        )}
      </div>
    </div>
  );
}
