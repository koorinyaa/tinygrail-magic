import { CurrentTopWeekItem } from '@/api/character';
import { cn } from '@/lib/utils';
import { Image, Plus, SquareArrowOutUpRight } from 'lucide-react';

/**
 * 操作按钮区域组件
 * @param {ActionButtonsProps} props
 * @param {CurrentTopWeekItem} props.data - 角色数据
 * @param {() => void} props.handleCoverPreview - 封面预览事件
 * @param {(characterId: number) => void} props.handleCharacterDrawer - 打开角色抽屉事件
 * @param {(characterId: number) => void} props.handleAuction - 拍卖事件
 */
export function ActionButtons({
  data,
  handleCoverPreview,
  handleCharacterDrawer,
  handleAuction,
}: {
  data: CurrentTopWeekItem;
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
            'bg-gray-800/50 backdrop-blur-xs'
          )}
          title="参与拍卖"
          onClick={(e) => {
            e.stopPropagation();
            handleAuction(data.CharacterId);
          }}
        >
          <Plus className="size-4" />
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
