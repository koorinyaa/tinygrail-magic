import { CurrentTopWeekItem } from '@/api/character';
import { AuctionItem } from '@/api/user';
import { GlowEffect } from '@/components/glow-effect';
import { cn } from '@/lib/utils';
import { ComponentProps, useEffect, useState } from 'react';
import { ActionButtons } from './action-buttons';
import { BriefInfo } from './brief-info';
import { Cover } from './cover';
import { DetailInfo } from './detail-info';

interface TopWeekCardProps extends ComponentProps<'div'> {
  rank: number;
  scoreMultiplier: number;
  data: CurrentTopWeekItem;
  auctionInfo: AuctionItem;
  handleCoverPreview: () => void;
  handleCharacterDrawer: (characterId: number) => void;
  handleAuction: (characterId: number) => void;
}
/**
 * 每周萌王卡片组件
 * @param {TopWeekCardProps} props
 * @param {number} props.rank - 排名
 * @param {number} props.scoreMultiplier - 评分倍率
 * @param {CurrentTopWeekItem} props.data - 角色数据
 * @param {AuctionItem} props.auctionInfo - 拍卖信息
 * @param {() => void} props.handleCoverPreview - 封面预览事件
 * @param {(characterId: number) => void} props.handleCharacterDrawer - 打开角色抽屉事件
 * @param {(characterId: number) => void} props.handleAuction - 拍卖事件
 */
export function TopWeekCard({
  rank,
  scoreMultiplier,
  data,
  auctionInfo,
  handleCoverPreview,
  handleCharacterDrawer,
  handleAuction,
  className,
  ...props
}: TopWeekCardProps) {
  // 控制信息区域的显示状态
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  // 使用sessionStorage保存卡片展开状态，以便在页面刷新后保持状态
  const storageKey = `topWeekCard-isExpanded-${data.CharacterId}`;

  // 初始化时从sessionStorage读取状态
  useEffect(() => {
    const savedState = sessionStorage.getItem(storageKey);
    if (savedState) {
      setIsInfoExpanded(savedState === 'true');
    }
  }, [storageKey]);

  // 切换信息区域的显示状态
  const toggleInfoSection = () => {
    const newState = !isInfoExpanded;
    setIsInfoExpanded(newState);
    sessionStorage.setItem(storageKey, String(newState));
  };

  return (
    <div
      className={cn('relative w-full aspect-[3/4] group', className)}
      onClick={toggleInfoSection}
      {...props}
    >
      {rank <= 3 && (
        <GlowEffect
          colors={['#0894FF', '#C959DD', '#FF2E54', '#FF9004']}
          mode="static"
          blur="softest"
          className="rounded-lg"
        />
      )}
      <div className="absolute w-full bg-slate-50 shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:bg-slate-800 overflow-hidden rounded-lg">
        <Cover rank={rank} data={data} />
        <BriefInfo data={data} />
      </div>
      <DetailInfo
        data={data}
        scoreMultiplier={scoreMultiplier}
        className={cn(
          'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
          {
            'opacity-0': !isInfoExpanded,
            'opacity-100': isInfoExpanded,
          }
        )}
      />
      <ActionButtons
        data={data}
        auctionInfo={auctionInfo}
        handleCoverPreview={handleCoverPreview}
        handleCharacterDrawer={handleCharacterDrawer}
        handleAuction={handleAuction}
      />
    </div>
  );
}
