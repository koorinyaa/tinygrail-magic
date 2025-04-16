import { CurrentTopWeekItem } from "@/api/character";
import { GlowEffect } from "@/components/glow-effect";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatInteger, getAvatarUrl, getCoverUrl } from "@/lib/utils";
import { CirclePlus } from "lucide-react";
import { ComponentProps, useState } from "react";
import { TbChevronCompactUp } from "react-icons/tb";

interface TopWeekCardProps extends ComponentProps<"div"> {
  rank: number;
  scoreMultiplier: number;
  data: CurrentTopWeekItem;
  onCoverClick?: () => void;
  onHeaderClick?: (number: number) => void;
}
/**
 * 每周萌王卡片组件
 * @param {TopWeekCardProps} props
 * @param {number} props.rank - 角色排名
 * @param {number} props.scoreMultiplier - 评分倍率
 * @param {CurrentTopWeekItem} props.characterData - 角色详细数据
 * @param {Function} props.onCoverClick - 封面点击回调函数
 * @param {Function} props.onHeaderClick - 头部点击回调函数
 * @param {string} props.className - 类名
 */
export function TopWeekCard({
  rank,
  scoreMultiplier,
  data,
  onCoverClick,
  onHeaderClick,
  className,
  ...props
}: TopWeekCardProps) {

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="relative">
        <div className="bg-slate-50 shadow-lg dark:bg-slate-800 overflow-hidden rounded-2xl transition-all duration-300">
          {rank <= 3 && (
            <GlowEffect
              colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
              mode="static"
              blur="softest"
            />
          )}
          <HeaderSection
            rank={rank}
            data={data}
            onHeaderClick={onHeaderClick}
          />
          <CoverSection
            data={data}
            onCoverClick={onCoverClick}
          />
          <InfoSection
            data={data}
            scoreMultiplier={scoreMultiplier}
          />
        </div>
      </div>
    </div>
  );
}


interface HeaderSectionProps {
  rank: number;
  data: CurrentTopWeekItem;
  onHeaderClick?: (number: number) => void;
}
/**
 * 头部区域组件
 * @param {HeaderSectionProps} props
 * @param {number} props.rank - 排名
 * @param {CurrentTopWeekItem} props.data - 角色数据
 * @param {Function} props.onHeaderClick - 角色名称点击事件
 */
const HeaderSection = ({ rank, data, onHeaderClick }: HeaderSectionProps) => {
  const { CharacterId: characterId, CharacterName: characterName } = data;

  return (
    <div className="flex absolute w-full h-10 p-1 z-10">
      <div
        className="flex items-center justify-center w-full p-2 text-black rounded-2xl bg-slate-100/60 backdrop-blur-sm cursor-pointer"
        onClick={() => {
          onHeaderClick?.(characterId);
        }}
      >
        <div
          className="mr-0.5 text-sm font-bold font-mono opacity-50 tabular-nums"
          title="排名"
        >
          {rank < 10 ? `0${rank}` : rank}
        </div>
        <div className="grid flex-1">
          <div className="flex flex-row ml-0.5 items-center font-medium overflow-hidden">
            <span className="truncate text-xs font-bold">
              {characterName}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="w-fit px-1 hover:bg-transparent cursor-pointer opacity-60 hover:opacity-100"
        >
          <CirclePlus />
        </Button>
      </div>
    </div>
  )
}

interface CoverSectionProps {
  data: CurrentTopWeekItem;
  onCoverClick?: () => void;
}
/**
 * 封面区域组件
 * @param {CoverSectionProps} props
 * @param {CurrentTopWeekItem} props.data - 角色数据
 * @param {Function} props.onCoverClick - 封面点击事件
 */
const CoverSection = ({ data, onCoverClick }: CoverSectionProps) => {
  const {
    Avatar: avatar,
    Cover: cover,
    CharacterLevel: characterLevel,
  } = data;

  return (
    <div
      className={cn("relative", cover && "cursor-pointer")}
      onClick={() => {
        if (cover) {
          onCoverClick?.();
        }
      }}
    >
      <AspectRatio
        ratio={3 / 4}
        className={cn(
          "w-full bg-slate-200 bg-top bg-no-repeat bg-cover rounded-t-2xl overflow-hidden",
          !cover && "blur-md backdrop-brightness-90"
        )}
        style={{
          backgroundImage: cover
            ? `url('${getCoverUrl(cover, "medium")}')`
            : `url('${getAvatarUrl(avatar)}')`,
        }}
      />
      {!cover && (
        <div
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 justify-center items-center 
                w-1/2 min-w-20 aspect-square rounded-full overflow-hidden bg-cover bg-top"
          style={{ backgroundImage: `url('${getAvatarUrl(avatar)}')` }}
        />
      )}
      <div
        className="absolute left-0 bottom-8 px-1.5 py-0.5
          text-white text-xs font-bold font-mono 
          rounded-r-sm bg-amber-500 dark:bg-amber-600"
      >
        <span title="等级">Lv{characterLevel}</span>
      </div>
    </div>
  )
}

interface InfoSectionProps {
  data: CurrentTopWeekItem;
  scoreMultiplier: number;
}
/**
 * 信息区域组件
 * @param {InfoSectionProps} props
 * @param {CurrentTopWeekItem} props.data - 角色数据
 * @param {number} props.scoreMultiplier - 评分倍率
 */
const InfoSection = ({ data, scoreMultiplier }: InfoSectionProps) => {
  const {
    CharacterId: characterId,
    Type: userCount,
    Assets: auctionCount,
    Extra: extra,
    Price: price,
    Sacrifices: valhalla,
  } = data;

  const [isExpanded, setIsExpanded] = useState(() => {
    const savedState = sessionStorage.getItem(`topWeekCard-isExpanded-${characterId}`);
    return savedState ? JSON.parse(savedState) : true;
  });

  const handleToggle = () => {
    setIsExpanded((prev: boolean) => {
      const newState = !prev;
      sessionStorage.setItem(`topWeekCard-isExpanded-${characterId}`, JSON.stringify(newState));
      return newState;
    });
  };

  const infoData = [
    { label: "人数", value: formatInteger(userCount) },
    { label: "均价₵", value: formatCurrency((extra + price * valhalla) / auctionCount) },
    { label: "拍卖数", value: formatInteger(auctionCount) },
    { label: "英灵殿", value: formatInteger(valhalla) },
    { label: "评分", value: formatCurrency(extra + userCount * scoreMultiplier) },
  ]

  return (
    <div className="relative w-full h-[3.25rem] rounded-t-2xl shadow-md">
      <div
        className={`absolute bottom-0 w-full p-3 pt-0 rounded-t-2xl 
              bg-slate-50 dark:bg-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 cursor-pointer 
              transition-all duration-300 ${isExpanded ? "h-[4.5rem]" : "h-[8.5rem]"
          }`}
        onClick={handleToggle}
      >
        <div className="w-full h-4 flex justify-center opacity-50 hover:opacity-90 mb-1">
          <TbChevronCompactUp
            className={`size-5 ${isExpanded ? "" : "rotate-180"}`}
          />
        </div>
        <div className="w-full min-h-4">
          <div className="flex items-center justify-between gap-1">
            <h3 className="text-sm truncate" title="溢出金额">
              +₵{formatCurrency(extra, { maximumFractionDigits: 0 })}
            </h3>
          </div>
        </div>
        <div className="w-full min-h-3.5 mt-1">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${isExpanded
              ? "opacity-100"
              : "max-h-0 overflow-hidden opacity-0"
              }`}
          >
            <span
              className="text-xs opacity-50 truncate"
              title="人数 / 拍卖数 / 英灵殿"
            >
              {formatInteger(userCount)} / {formatInteger(auctionCount)} / {formatInteger(valhalla)}
            </span>
          </div>
          <div
            className={`text-xs transition-all duration-300 ${isExpanded
              ? "max-h-0 overflow-hidden opacity-0"
              : "opacity-100"
              }`}
          >
            {infoData.map((item) => (
              <div className="flex items-center justify-between gap-1">
                <span className="text-left opacity-50 min-w-6">{item.label}</span>
                <span className="text-right truncate">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}