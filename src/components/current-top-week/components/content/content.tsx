import { TopWeekResponse } from '@/api/character';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, getCoverUrl } from '@/lib/utils';
import { useStore } from '@/store';
import { toast } from 'sonner';
import { TopWeekCard } from '../top-week-card';

interface ContentProps {
  loading: boolean;
  topWeekData: TopWeekResponse | undefined;
  scoreMultiplier: number;
  setIsPhotoSliderOpen: (isOpen: boolean) => void;
  setPhotoSliderSrc: (src: string) => void;
}

/**
 * 内容区域组件
 * @param {ContentSectionProps} props
 * @param {boolean} props.loading - 加载状态
 * @param {TopWeekResponse} props.topWeekData - 萌王投票数据
 * @param {number} props.scoreMultiplier - 评分倍率
 * @param {(isOpen: boolean) => void} props.setIsPhotoSliderOpen - 设置照片查看器是否打开
 * @param {(src: string) => void} props.setPhotoSliderSrc - 设置照片查看器图片地址
 */
export function Content({
  loading,
  topWeekData,
  scoreMultiplier,
  setIsPhotoSliderOpen,
  setPhotoSliderSrc,
}: ContentProps) {
  const { setCharacterDrawer } = useStore();

  return (
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
                toast.warning('开发中');
              }}
            />
          ))}
    </div>
  );
}
