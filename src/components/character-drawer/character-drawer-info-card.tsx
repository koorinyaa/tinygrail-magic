import { CharacterDetail } from "@/api/character";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DrawerContent, DrawerNested, DrawerTrigger } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, formatCurrency, getAvatarUrl } from "@/lib/utils";
import { ChartNoAxesColumn, Copy, Crown, EllipsisVertical } from "lucide-react";
import { AiFillMoon, AiFillStar, AiFillSun, AiOutlineStar } from "react-icons/ai";
import { BsStars } from "react-icons/bs";
import { TbCaretRightFilled, TbX } from "react-icons/tb";
import { toast } from "sonner";
import BadgeLevel from "../ui/badge-level";

interface CharacterDrawerInfoCardProps {
  loading: boolean;
  data: CharacterDetail | null;
}
/**
 * 角色信息
 * @param {CharacterDrawerInfoCardProps} props
 * @param {boolean} props.loading - 是否加载中
 * @param {CharacterDetail | null} props.data - 角色详情
 */
export default function CharacterDrawerInfoCard({ loading, data }: CharacterDrawerInfoCardProps) {
  const {
    Icon = '',
    Name = '',
    CharacterId = 0,
    Level = 0,
    ZeroCount = 0,
    Crown = 0,
    Bonus = 0,
    Rank = 0,
    Fluctuation = 0,
    Stars = 0,
    Current = 0,
    Price = 0,
    Total = 0,
    Rate = 0,
    StarForces = 0,
  } = data || {};

  return (
    <>
      {loading ?
        <CharacterDrawerInfoCardSkeleton /> :
        <div className="mt-20 p-3 bg-background rounded-t-md relative">
          <div className="absolute -top-6 left-4">
            <CharacterAvatar src={getAvatarUrl(Icon)} name={Name} />
          </div>
          <div className="h-12 relative">
            <Action />
          </div>
          <div className="flex flex-row gap-x-8">
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex flex-row items-center text-md text-foreground font-semibold">
                <span className="truncate">{Name}</span>
                <BadgeLevel level={Level} zeroCount={ZeroCount} />
              </div>
              <div
                className="flex items-center gap-1 mt-0.5 text-xs cursor-pointer opacity-60"
                title="复制ID"
                onClick={() => {
                  navigator.clipboard.writeText(`#${CharacterId.toString()}`)
                    .then(() => {
                      toast.success("复制成功")
                    })
                    .catch(console.error);
                }}
              >
                #{CharacterId}
                <Copy className="size-3" />
              </div>
            </div>
            <div className="flex flex-col h-full min-w-11 rounded-md overflow-hidden bg-secondary text-secondary-foreground">
              <div
                className={Rank <= 500 ?
                  "bg-violet-400 text-violet-800 dark:bg-violet-400/20 dark:text-violet-400" :
                  "bg-slate-300 text-slate-800 dark:bg-slate-700/20 dark:text-slate-400"}
                title="通天塔排名"
              >
                <div className="flex items-center justify-center h-3/4 text-md font-semibold scale-80">
                  <ChartNoAxesColumn className="inline-block size-4" />
                  {Rank}
                </div>
              </div>
              <div className="flex items-center justify-center h-1/4 text-xs opacity-60 scale-80" title={`角色星之力：${StarForces}`}>
                <BsStars className="inline-block size-3" />
                {
                  StarForces < 10000 ?
                    formatCurrency(StarForces) :
                    `${formatCurrency(StarForces / 10000, { maximumFractionDigits: 1 })}w`
                }
              </div>
            </div>
          </div>
          <div className="flex flex-row flex-wrap items-center mt-1.5 gap-2">
            <Attribute
              fluctuation={Fluctuation}
              crown={Crown}
              bonus={Bonus}
            />
            <CharacterStarLevel stars={Stars} />
          </div>
          <div className="mt-2">
            <CharacterInfo
              current={Current}
              price={Price}
              total={Total}
              rank={Rank}
              rate={Rate}
              stars={Stars}
            />
          </div>
        </div>
      }
    </>
  )
}

interface CharacterAvatarProps {
  src: string;
  name: string;
  className?: string;
}
/**
 * 角色头像
 * @param {CharacterAvatarProps} props
 * @param {string} props.src - 头像url
 * @param {string} props.name 名称
 * @param {string} props.className 类名
 */
function CharacterAvatar({ src, name, className }: CharacterAvatarProps) {
  return (
    <div
      className={cn("flex size-16 shrink-0 items-center justify-center rounded-full", className)}
      aria-hidden="true"
    >
      <Avatar className="size-16 rounded-full border-2 border-secondary">
        <AvatarImage
          className="object-cover object-top pointer-events-none"
          src={src}
          alt={name}
        />
        <AvatarFallback className="rounded-full">C</AvatarFallback>
      </Avatar>
    </div>
  )
}

interface AttributeProps {
  fluctuation: number;
  crown: number;
  bonus: number;
  className?: string;
}
/**
 * 角色属性
 * @param {AttributeProps} props
 * @param {number} props.fluctuation - 价格波动
 * @param {number} props.crown - 萌王次数
 * @param {number} props.bonus - 新番加成剩余期数
 * @param {string} props.className 类名
 */
function Attribute({ fluctuation, crown, bonus, className }: AttributeProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center md:justify-start gap-1", className)}>
      <Badge
        variant="secondary"
        className={cn(
          "gap-0.5 rounded-sm",
          {
            "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-500": fluctuation > 0,
            "bg-red-100 text-red-800 dark:bg-red-400/20 dark:text-red-500": fluctuation < 0,
          })}
        title="价格波动"
      >
        {fluctuation >= 0 && "+"}
        {formatCurrency(fluctuation * 100, { maximumFractionDigits: 2 })}%
      </Badge>
      {crown > 0 &&
        <Badge
          variant="secondary"
          className="bg-amber-300 text-amber-800 dark:bg-amber-400/20 dark:text-amber-500 rounded-sm"
          title="萌王次数"
        >
          <Crown className="size-3" />
          {crown}
        </Badge>
      }
      {bonus > 0 &&
        <Badge
          variant="secondary"
          className="bg-green-300 text-green-800 dark:bg-green-400/20 dark:text-green-500 rounded-sm gap-0"
          title={`新番加成剩余${bonus}期`}
        >
          <TbX className="size-3" />
          {bonus}
        </Badge>
      }
    </div>
  )
}

const Action = () => {
  return (
    <button className="absolute right-0 top-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
      <EllipsisVertical className="size-4" />
    </button>
  )
}

interface StarLevelProps {
  stars: number;
  className?: string;
}
/**
 * 角色星级
 * @param {StarLevelProps} props
 * @param {number} props.stars - 星级
 * @param {string} props.className 类名
 */
function CharacterStarLevel({ stars, className }: StarLevelProps) {
  const totalStars = Math.max(0, stars);
  const suns = Math.floor(totalStars / 25);
  const moons = Math.floor((totalStars % 25) / 5);
  const remainingStars = totalStars % 5;

  const renderIcons = (count: number, IconComponent: React.ElementType) => {
    return Array.from({ length: count }).map((_, i) => (
      <IconComponent key={i} className="size-5" />
    ));
  };

  return (
    <div
      className={cn("flex flex-wrap items-center justify-center md:justify-start gap-0.5 text-amber-300 dark:text-amber-500", className)}
      title={`星级：${stars}`}
    >
      {stars > 0 ? (
        <>
          {renderIcons(suns, AiFillSun)}
          {renderIcons(moons, AiFillMoon)}
          {renderIcons(remainingStars, AiFillStar)}
        </>
      ) : (
        <AiOutlineStar className="size-5" />
      )}
    </div>
  );
}
interface CharacterInfoProps {
  current: number;
  price: number;
  total: number;
  rate: number;
  rank: number;
  stars: number;
  className?: string;
}
/**
 * 角色信息
 * @param {CharacterInfoProps} props
 * @param {number} props.current - 当前价格
 * @param {number} props.price - 评估价
 * @param {number} props.total - 流通量
 * @param {number} props.rate - 基础股息
 * @param {number} props.rank - 排名
 * @param {number} props.stars - 星级
 * @param {string} props.className 类名
 */
function CharacterInfo({ current, price, total, rate, rank, stars, className }: CharacterInfoProps) {
  const isMobile = useIsMobile(448);
  const dividend = rank <= 500 ? rate * 0.005 * (601 - rank) : stars * 2
  const data = [
    { label: "现价₵", value: `${formatCurrency(current, { maximumFractionDigits: 2 })}` },
    { label: "评估价₵", value: `${formatCurrency(price, { maximumFractionDigits: 2 })}` },
    { label: "股息₵", value: `${formatCurrency(dividend, { maximumFractionDigits: 2 })}` },
    { label: "流通", value: formatCurrency(total) }
  ]
  return (
    <div className="flex flex-col text-xs gap-y-1.5">
      <div className={cn("flex flex-row items-center gap-x-1", className)}>
        {data.map((item, index) => (
          <div key={index} className="flex flex-1 flex-col p-2 pt-2.5 bg-slate-100/80 dark:bg-slate-900/60 rounded-sm">
            <div className="flex justify-center text-foreground font-semibold">{item.value}</div>
            <div className="flex justify-center opacity-50 scale-80">{item.label}</div>
          </div>
        ))}
      </div>
      <DrawerNested direction={isMobile ? "bottom" : "right"}>
        <DrawerTrigger>
          <div
            className="flex items-center justify-center p-1.5 bg-slate-100/80 dark:bg-slate-900/60 rounded-sm cursor-pointer"
          >
            <span className="opacity-50">
              查看详细数据
              <TbCaretRightFilled className="inline-block" />
            </span>
          </div>
        </DrawerTrigger>
        <DrawerContent className={cn("bg-background border-none overflow-hidden outline-none", { "rounded-l-md": !isMobile })}>
          <div
            className={cn(
              "flex items-center justify-center h-8 px-4 py-2",
              "border-b border-slate-300/30 dark:border-slate-700/30",
              { "pt-0": isMobile }
            )}
          >
            <span className="text-xs text-foreground font-semibold">角色详细数据</span>
          </div>
          <div className="h-40"></div>
        </DrawerContent>
      </DrawerNested>
    </div>
  )
}

/**
 * 角色头部骨架屏
 */
function CharacterDrawerInfoCardSkeleton() {
  return (
    <div className="mt-20 p-3 bg-background rounded-md relative">
      <div className="absolute -top-6 left-4 z-10">
        <div className="size-16 rounded-full bg-background">
          <Skeleton className="size-16 rounded-full border-2 border-secondary" />
        </div>
      </div>
      <div className="h-12"></div>
      <div className="flex flex-row">
        <div className="flex flex-1 flex-col">
          <Skeleton className="h-5 w-24 rounded-sm" />
          <Skeleton className="h-4 w-12 mt-1.5 rounded-sm" />
        </div>
        <Skeleton className="h-10 w-11" />
      </div>
      <div className="flex flex-row flex-wrap items-center mt-2 gap-x-1">
        <Skeleton className="h-5.5 w-10 rounded-sm" />
        <Skeleton className="h-5.5 w-10 rounded-sm" />
        <Skeleton className="h-5.5 w-10 rounded-sm" />
      </div>
      <div className="mt-2 flex flex-col gap-y-1.5">
        <div className="flex flex-row items-center gap-x-1">
          <Skeleton className="flex-1 rounded-sm h-12.5" />
          <Skeleton className="flex-1 rounded-sm h-12.5" />
          <Skeleton className="flex-1 rounded-sm h-12.5" />
          <Skeleton className="flex-1 rounded-sm h-12.5" />
        </div>
        <Skeleton className="h-7 rounded-sm" />
      </div>
    </div>
  )
}
