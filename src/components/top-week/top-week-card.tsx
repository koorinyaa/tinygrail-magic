import { CurrentTopWeekItem } from "@/api/character";
import { GlowEffect } from "@/components/glow-effect";
import BadgeLevel from "@/components/ui/badge-level";
import { cn, formatCurrency, formatInteger, getAvatarUrl, getCoverUrl, isEmpty } from "@/lib/utils";
import { Image, Maximize2, X } from "lucide-react";
import { ComponentProps, useEffect, useState } from "react";

interface TopWeekCardProps extends ComponentProps<"div"> {
  rank: number;
  scoreMultiplier: number;
  data: CurrentTopWeekItem;
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
 * @param {() => void} props.handleCoverPreview - 封面预览事件
 * @param {(characterId: number) => void} props.handleCharacterDrawer - 打开角色抽屉事件
 * @param {(characterId: number) => void} props.handleAuction - 拍卖事件
 */
export function TopWeekCard({
  rank,
  scoreMultiplier,
  data,
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
      className={cn("relative w-full aspect-[3/4] group", className)}
      onClick={toggleInfoSection}
      {...props}
    >
      {rank <= 3 && (
        <GlowEffect
          colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
          mode="static"
          blur="softest"
          className="rounded-lg"
        />
      )}
      <div className="absolute w-full bg-slate-50 shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:bg-slate-800 overflow-hidden rounded-lg">
        <CoverSection
          rank={rank}
          data={data}
        />
        <BriefInfo data={data} />
      </div>
      <DetailInfo
        data={data}
        scoreMultiplier={scoreMultiplier}
        className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          {
            "opacity-0": !isInfoExpanded,
            "opacity-100": isInfoExpanded,
          }
        )}
      />
      <ActionButtons
        data={data}
        handleCoverPreview={handleCoverPreview}
        handleCharacterDrawer={handleCharacterDrawer}
        handleAuction={handleAuction}
      />
    </div>
  );
}

interface CoverSectionProps {
  data: CurrentTopWeekItem;
  rank: number;
}
/**
 * 封面区域组件
 * @param {CoverSectionProps} props
 * @param {CurrentTopWeekItem} props.data - 角色数据
 * @param {number} props.rank - 排名
 */
function CoverSection({ data, rank }: CoverSectionProps) {
  const {
    Avatar: avatar,
    Cover: cover,
  } = data;

  return (
    <div className={cn("w-full", cover && "cursor-pointer")} >
      <img
        src={cover ? getCoverUrl(cover, "medium") : getAvatarUrl(avatar)}
        className={cn("w-full aspect-[3/4] object-cover pointer-events-none", { "blur-lg": isEmpty(cover) })}
      />
      {!cover && (
        <div
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-2/3 justify-center items-center 
                w-1/2 min-w-16 aspect-square rounded-full overflow-hidden bg-cover bg-top"
          style={{ backgroundImage: `url('${getAvatarUrl(avatar)}')` }}
        />
      )}
      <div
        className={cn(
          "absolute left-0 top-0 flex items-center justify-center size-6 pb-0.5 pr-0.5",
          "text-white text-xs font-bold font-mono",
          "rounded-br-full",
          {
            "bg-amber-500 dark:bg-amber-600": rank <= 3,
            "bg-cyan-500 dark:bg-cyan-600": rank > 3 && rank <= 6,
            "bg-green-500 dark:bg-green-600": rank > 6,
          }
        )}
      >
        {rank}
      </div>
    </div>
  )
}

interface BriefInfoProps {
  data: CurrentTopWeekItem;
}
/**
 * 简要信息区域组件
 * @param {BriefInfoProps} props
 * @param {CurrentTopWeekItem} props.data - 角色数据
 */
function BriefInfo({ data }: BriefInfoProps) {
  return (
    <div className={cn(
      "absolute bottom-0 left-0 right-0 h-18 text-white",
      "bg-gradient-to-b from-[#00000000]/0 to-[#000000cc] group"
    )}>
      <div className="absolute bottom-0 w-full px-3 pt-4 pb-1.5">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <span className="text-xs font-bold truncate">{data.CharacterName}</span>
            <BadgeLevel level={data.CharacterLevel} />
          </div>
          <div className="text-xs truncate">
            +₵{formatCurrency(data.Extra, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs truncate">
            {formatInteger(data.Type)} / {formatInteger(data.Assets)} / {formatInteger(data.Sacrifices)}
          </div>
        </div>
      </div>
    </div>
  )
}

interface DetailInfoProps {
  data: CurrentTopWeekItem;
  scoreMultiplier: number;
  className?: string;
}
/**
 * 详细信息区域组件
 * @param {DetailInfoProps} props
 * @param {CurrentTopWeekItem} props.data - 角色数据
 * @param {number} props.scoreMultiplier - 评分倍率
 */
function DetailInfo({ data, scoreMultiplier, className }: DetailInfoProps) {
  const {
    Type: userCount,
    Assets: auctionCount,
    Extra: extra,
    Price: price,
    Sacrifices: valhalla,
  } = data;

  const score = (extra + userCount * scoreMultiplier) / 100;
  const infoData = [
    { id: "userCount", label: "人数", value: formatInteger(userCount) },
    { id: "avgPrice", label: "均价₵", value: formatCurrency((extra + price * valhalla) / auctionCount) },
    { id: "auctionCount", label: "拍卖数", value: formatInteger(auctionCount) },
    { id: "valhalla", label: "英灵殿", value: formatInteger(valhalla) },
    { id: "score", label: "评分", value: formatCurrency(score, {maximumFractionDigits: 0}) },
  ]

  return (
    <div className={cn(
      "flex flex-col items-center justify-end h-full w-full p-3 backdrop-blur-xs",
      "bg-gray-500/40 text-white rounded-lg z-10",
      className,
    )}>
      {infoData.map((item) => (
        <div key={item.id} className="flex items-center gap-2 w-full text-sm text-white/90">
          <span className="text-left min-w-6">{item.label}</span>
          <span className="flex-1 text-right font-bold truncate">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}

interface ActionButtonsProps {
  data: CurrentTopWeekItem;
  handleCoverPreview: () => void;
  handleCharacterDrawer: (characterId: number) => void;
  handleAuction: (characterId: number) => void;
}
/**
 * 操作按钮区域组件
 * @param {ActionButtonsProps} props
 * @param {CurrentTopWeekItem} props.data - 角色数据
 * @param {() => void} props.handleCoverPreview - 封面预览事件
 * @param {(characterId: number) => void} props.handleCharacterDrawer - 打开角色抽屉事件
 * @param {(characterId: number) => void} props.handleAuction - 拍卖事件
 */
function ActionButtons({ data, handleCoverPreview, handleCharacterDrawer, handleAuction }: ActionButtonsProps) {
  return (
    <div className="absolute top-2 right-2 flex flex-row gap-x-1 text-white z-10">
      {data.Cover &&
        <div
          className={cn(
            "flex items-center justify-center",
            "size-6 rounded-full cursor-pointer",
            "opacity-80 hover:opacity-100",
            "bg-gray-800/50 backdrop-blur-xs",
          )}
          title="查看大图"
          onClick={(e) => { 
            e.stopPropagation();
            handleCoverPreview();
          }}
        >
          <Image className="size-4" />
        </div>
      }
      <div
        className={cn(
          "flex items-center justify-center",
          "size-6 rounded-full cursor-pointer",
          "opacity-80 hover:opacity-100",
          "bg-gray-800/50 backdrop-blur-xs",
        )}
        title="打开角色面板"
        onClick={(e) => { 
          e.stopPropagation();
          handleCharacterDrawer(data.CharacterId); 
        }}
      >
        <Maximize2 className="size-4" />
      </div>
      <div
        className={cn(
          "flex items-center justify-center",
          "size-6 rounded-full cursor-pointer",
          "opacity-80 hover:opacity-100",
          "bg-gray-800/50 backdrop-blur-xs",
        )}
        title="参与拍卖"
        onClick={(e) => { 
          e.stopPropagation();
          handleAuction(data.CharacterId);
        }}
      >
        <X className="size-4 rotate-45" />
      </div>
    </div>
  )
}
