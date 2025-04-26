import { updateCharacter, uploadCharacterAvatar } from "@/api/character";
import { AvatarCropper } from "@/components/avatar-cropper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import BadgeLevel from "@/components/ui/badge-level";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerContent, DrawerNested, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, formatCurrency, formatInteger, getAvatarUrl, isEmpty, resizeImage } from "@/lib/utils";
import { useStore } from "@/store";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { md5 } from 'js-md5';
import { ChartNoAxesColumn, CircleAlert, Copy, Crown, EllipsisVertical, HelpCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FixedCropperRef } from "react-advanced-cropper";
import { AiFillMoon, AiFillStar, AiFillSun, AiOutlineStar } from "react-icons/ai";
import { BsStars } from "react-icons/bs";
import { TbCaretRightFilled, TbX } from "react-icons/tb";
import { toast } from "sonner";
import { fetchCharacterDetail } from "./character-drawer-content";

/**
 * 角色信息
 */
export default function CharacterDrawerInfoCard() {
  const { characterDrawerData } = useStore();
  const {
    loading = false,
    characterDetail = null,
  } = characterDrawerData;

  const {
    Name: name = '',
    CharacterId: characterId = 0,
    Level: level = 0,
    ZeroCount: zeroCount = 0,
    Crown: crown = 0,
    Bonus: bonus = 0,
    Rank: rank = 0,
    Fluctuation: fluctuation = 0,
    Stars: stars = 0,
    StarForces: starForces = 0,
  } = characterDetail || {};

  return (
    <>
      {loading ?
        <CharacterDrawerInfoCardSkeleton /> :
        <div className="mt-20 p-3 bg-card rounded-t-md relative">
          <div className="absolute -top-6 left-4">
            <CharacterAvatar />
          </div>
          <div className="h-12 relative">
            <Action />
          </div>
          <div className="flex flex-row gap-x-8">
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex flex-row items-center text-md text-foreground font-semibold">
                <span className="truncate">{name}</span>
                <BadgeLevel level={level} zeroCount={zeroCount} />
              </div>
              <div
                className="flex items-center gap-1 mt-0.5 text-xs cursor-pointer opacity-60"
                title="复制ID"
                onClick={() => {
                  navigator.clipboard.writeText(`#${characterId.toString()}`)
                    .then(() => {
                      toast.success("复制成功")
                    })
                    .catch(console.error);
                }}
              >
                #{characterId}
                <Copy className="size-3" />
              </div>
            </div>
            <div className="flex flex-col h-full min-w-11 rounded-md overflow-hidden bg-secondary text-secondary-foreground">
              <div
                className={rank <= 500 ?
                  "bg-violet-400 text-violet-800 dark:bg-violet-600/40 dark:text-violet-200" :
                  "bg-slate-300 text-slate-800 dark:bg-slate-400/20 dark:text-slate-200"}
                title="通天塔排名"
              >
                <div className="flex items-center justify-center h-3/4 text-md font-semibold scale-80">
                  <ChartNoAxesColumn className="inline-block size-4" />
                  {rank}
                </div>
              </div>
              <div className="flex items-center justify-center h-1/4 text-xs opacity-60 scale-80" title={`角色星之力：${starForces}`}>
                <BsStars className="inline-block size-3" />
                {
                  starForces < 10000 ?
                    formatInteger(starForces) :
                    `${formatCurrency(starForces / 10000, { maximumFractionDigits: 1 })}w`
                }
              </div>
            </div>
          </div>
          <div className="flex flex-row flex-wrap items-center mt-1.5 gap-2">
            <Attribute
              fluctuation={fluctuation}
              crown={crown}
              bonus={bonus}
            />
            <CharacterStarLevel stars={stars} />
          </div>
          <div className="mt-2">
            <CharacterInfo />
          </div>
        </div>
      }
    </>
  )
}



interface CharacterAvatarProps {
  className?: string;
}
/**
 * 角色头像
 * @param {CharacterAvatarProps} props
 * @param {string} props.className 类名
 */
function CharacterAvatar({ className }: CharacterAvatarProps) {
  const isMobile = useIsMobile(448);
  const { userAssets, characterDrawerData, setCharacterDrawerData } = useStore();
  const cropperRef = useRef<FixedCropperRef>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{ type?: string; src: string; } | null>(null);
  const {
    CharacterId: characterId = 0,
    Icon: src = '',
    Name: name = '',
  } = characterDrawerData.characterDetail || {};

  useEffect(() => {
    if (!drawerOpen) {
      setUploadedImage(null);
    }
  }, [drawerOpen]);

  /**
   * 判断当前用户是否有修改头像权限
   */
  const canEditAvatar = () => {
    const { characterBoardMembers = [] } = characterDrawerData;
    // 筛选可修改头像的用户列表
    const editableMembers = characterBoardMembers.filter(member => {
      const lastActiveDate = new Date(member.LastActiveDate);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff < 5;
    });

    // 判断第一个成员的状态
    const firstMember = editableMembers[0];
    const editableUsers = firstMember?.State !== 666 ? [firstMember] : editableMembers;

    // 判断当前用户是否在可编辑列表中
    return editableUsers.some(member => member?.Name === userAssets?.name || userAssets?.id === 702);
  }

  /**
   * 上传图片按钮
   */
  const UploadImageButton = ({ children, className }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <label
        className={cn(
          canEditAvatar() ? "cursor-pointer" : "cursor-not-allowed",
          className
        )}
      >
        <Input
          id="picture"
          type="file"
          className="hidden"
          accept="image/*"
          disabled={!canEditAvatar()}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
              toast.error('仅支持图片格式文件');
              e.target.value = '';
              return;
            }

            const reader = new FileReader();
            reader.onload = () => {
              const blob = URL.createObjectURL(file);
              setUploadedImage({
                src: blob,
                type: file.type
              })
            };
            reader.onerror = (error) => {
              console.error('文件读取失败:', error);
              toast.error('图片读取失败');
            };
            reader.readAsDataURL(file);
          }}
        />
        <span className={cn(
          "flex items-center justify-center h-9 px-4 py-1.5 rounded-md text-sm font-medium",
          {
            "bg-slate-300/50 dark:bg-slate-700/50 hover:bg-slate-300/80 dark:hover:bg-slate-700/80": canEditAvatar(),
            "bg-slate-200/50 dark:bg-slate-800/50": !canEditAvatar(),
          },
        )}>
          {children}
        </span>
      </label>
    )
  }

  /**
   * 上传头像
   */
  const handleUploadAvatar = async () => {
    if (cropperRef.current) {
      const dataUrl = cropperRef.current.getCanvas()?.toDataURL("image/png");
      if (dataUrl) {
        try {
          const processedDataUrl = await resizeImage(dataUrl, {
            width: 256,
            height: 256,
            type: 'image/jpeg',
            smoothing: true,
            quality: 'high'
          });
          const hash = md5(processedDataUrl);
          const result = await uploadCharacterAvatar(characterId, processedDataUrl, hash);
          if (result.State === 0) {
            toast.success('更换成功');
            fetchCharacterDetail(
              characterId,
              (characterDetail) => {
                setCharacterDrawerData({ characterDetail });
              }
            );
          } else {
            throw new Error(result.Message || '头像更换失败');
          }
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : "头像更换失败";
          console.error(errMsg);
          toast.error(errMsg);
        }
      }
    }
  }

  return (
    <DrawerNested
      direction={isMobile ? "bottom" : "right"}
      open={drawerOpen}
      onOpenChange={setDrawerOpen}
      handleOnly={!isEmpty(uploadedImage && uploadedImage.src)}
    >
      <DrawerTrigger asChild>
        <div
          className={cn("relative flex size-16 shrink-0 items-center justify-center rounded-full cursor-pointer z-10", className)}
          aria-hidden="true"
          id="avatar"
        >
          <Avatar className="size-16 rounded-full border-2 border-secondary">
            <AvatarImage
              className="object-cover object-top pointer-events-none"
              src={getAvatarUrl(src)}
              alt={name}
            />
            <AvatarFallback className="rounded-full">C</AvatarFallback>
          </Avatar>
        </div>
      </DrawerTrigger>
      <DrawerContent
        className={cn("bg-background border-none overflow-hidden outline-none", { "rounded-l-md": !isMobile })}
        aria-describedby={undefined}
      >
        <VisuallyHidden asChild>
          <DrawerTitle />
        </VisuallyHidden>
        {
          isEmpty(uploadedImage && uploadedImage.src) ?
            <div className={cn("flex flex-col py-4 gap-y-2 overflow-y-auto", { "pt-2": isMobile })}>
              <div className="flex justify-center">
                <img
                  src={getAvatarUrl(src, 'medium')}
                  alt={name}
                  className="size-48 object-cover object-top rounded-sm m-shadow-card pointer-events-none"
                />
              </div>
              <div className="flex flex-col gap-y-2 items-center">
                <UploadImageButton className="w-32">
                  更换头像
                </UploadImageButton>
                {
                  !canEditAvatar() &&
                  <div className="flex gap-x-1 items-center justify-center text-xs text-foreground/60">
                    <CircleAlert className="size-3 inline-block opacity-50" />
                    <span>只有满足条件的董事会成员才有更换头像的权限</span>
                  </div>
                }
              </div>
            </div> :
            <div className={cn("flex flex-col p-2 gap-y-2", { "pt-0": isMobile })}>
              <div className="flex flex-col rounded-md overflow-hidden">
                <AvatarCropper cropperRef={cropperRef} src={uploadedImage && uploadedImage.src} />
              </div>
              <div className="flex gap-x-2 justify-center">
                <DrawerClose asChild>
                  <Button
                    variant="secondary"
                    className={cn(
                      "flex-1 flex items-center justify-center w-full px-0 py-1.5 rounded-md text-sm cursor-pointer",
                      "bg-slate-300/50 dark:bg-slate-700/50 hover:bg-slate-300/80 dark:hover:bg-slate-700/80"
                    )}
                    onClick={handleUploadAvatar}
                  >
                    确定
                  </Button>
                </DrawerClose>
                <UploadImageButton className="flex-1 w-full">
                  重新上传
                </UploadImageButton>
              </div>
            </div>
        }
      </DrawerContent>
    </DrawerNested>
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

/**
 * 操作按钮
 */
function Action() {
  const { characterDrawer, characterDrawerData, setCharacterDrawerData } = useStore();
  const {
    CharacterId: characterId = 0,
  } = characterDrawerData.characterDetail || {};
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);

  /**
   * 更新角色信息
   */
  const updateCharacterInfo = async () => {
    if (!characterDrawer.characterId) return;
    try {
      const data = await updateCharacter(characterDrawer.characterId);
      if (data.State === 0) {
        toast.success("同步成功", {
          description: data.Value,
        });

        fetchCharacterDetail(
          characterId,
          (characterDetail) => {
            setCharacterDrawerData({ characterDetail });
          }
        );
      } else {
        throw new Error(data.Message || '更新角色信息失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "更新角色信息失败";
      console.error(errMsg);
      toast.error("同步失败", {
        description: errMsg,
      });
    }
  };

  const buttons = [
    <div
      className="w-full h-full px-2 py-1.5 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
      onClick={() => { updateCharacterInfo(); }}
    >
      同步角色名称
    </div>,
  ];

  return (
    <>
      <DropdownMenu open={moreActionsOpen && characterDrawer.open} onOpenChange={setMoreActionsOpen}>
        <DropdownMenuTrigger asChild>
          <button className="absolute right-0 top-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
            <EllipsisVertical className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {buttons.map((button, index) => (
            <DropdownMenuItem key={index} className="p-0">
              {button}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
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
  className?: string;
}
/**
 * 角色信息
 * @param {CharacterInfoProps} props
 * @param {string} props.className 类名
 */
function CharacterInfo({ className }: CharacterInfoProps) {
  const { characterDrawerData } = useStore();

  const {
    Rank: rank = 0,
    Stars: stars = 0,
    Current: current = 0,
    Price: price = 0,
    Total: total = 0,
    Rate: rate = 0,
  } = characterDrawerData.characterDetail || {};

  const dividend = rank <= 500 ? rate * 0.005 * (601 - rank) : stars * 2
  const data = [
    { id: "current", label: "现价₵", value: `${formatCurrency(current, { maximumFractionDigits: 2 })}` },
    { id: "price", label: "评估价₵", value: `${formatCurrency(price, { maximumFractionDigits: 2 })}` },
    { id: "dividend", label: "股息₵", value: `${formatCurrency(dividend, { maximumFractionDigits: 2 })}` },
    { id: "total", label: "流通", value: formatCurrency(total) }
  ]
  return (
    <div className="flex flex-col text-xs gap-y-1.5">
      <div className={cn("flex flex-row items-center gap-x-1", className)}>
        {data.map((item) => (
          <div key={item.id} className="flex flex-1 flex-col p-2 pt-2.5 bg-slate-100/80 dark:bg-slate-800/60 rounded-sm">
            <div className="flex justify-center text-foreground font-semibold">{item.value}</div>
            <div className="flex justify-center opacity-50 scale-80">{item.label}</div>
          </div>
        ))}
      </div>
      <CharacterDetailButton />
    </div>
  )
}

/**
 * 角色详情按钮
 */
function CharacterDetailButton() {
  const isMobile = useIsMobile(448);
  const { characterDrawerData } = useStore();
  const {
    characterDetail,
    tinygrailCharacterData,
    gensokyoCharacterData,
    characterPoolAmount,
  } = characterDrawerData;

  const {
    Level: level = 0,
    ZeroCount: zeroCount = 0,
    Crown: crown = 0,
    Bonus: bonus = 0,
    Rank: rank = 0,
    Stars: stars = 0,
    Current: current = 0,
    Price: price = 0,
    Total: total = 0,
    Rate: rate = 0,
    StarForces: starForces = 0,
  } = characterDetail || {};
  const dividend = rank <= 500 ? rate * 0.005 * (601 - rank) : stars * 2

  const data = [
    {
      id: "level",
      label: "等级",
      value: level > 0 ? `Lv${level}` : `ST${zeroCount}`
    },
    {
      id: "stars",
      label: "星级",
      value: stars
    },
    {
      id: "current",
      label: "现价₵",
      value: `${formatCurrency(current, { maximumFractionDigits: 2 })}`
    },
    {
      id: "price",
      label: "评估价₵",
      value: `${formatCurrency(price, { maximumFractionDigits: 2 })}`
    },
    {
      id: "rate",
      label: "基础股息₵",
      value: `${formatCurrency(rate, { maximumFractionDigits: 2 })}`
    },
    {
      id: "dividend",
      label: <span className="flex items-center gap-1">
        股息₵
        <Popover>
          <PopoverTrigger>
            <HelpCircle className="size-3 opacity-60 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent
            className="px-3 py-2 w-fit"
            onOpenAutoFocus={(e) => {
              e.preventDefault();
            }}
          >
            <span className="text-xs">
              {
                rank <= 500 ?
                  "基础股息 × 0.005 × (601 - 通天塔排名)" :
                  "星级 × 2"
              }
            </span>
          </PopoverContent>
        </Popover>
      </span>,
      value: rank <= 500 ?
        `${formatCurrency(rate, { maximumFractionDigits: 2 })} × 0.005 × (601 - ${rank}) = ${formatCurrency(dividend, { maximumFractionDigits: 2 })}` :
        `${stars} × 2 = ${formatCurrency(dividend, { maximumFractionDigits: 2 })}`
    },
    {
      id: "total",
      label: "流通",
      value: formatCurrency(total)
    },
    {
      id: "rank",
      label: "通天塔排名",
      value: `${formatInteger(rank)}`
    },
    {
      id: "starForces",
      label: "星之力",
      value: starForces < 10000 ?
        formatInteger(starForces) :
        `${formatCurrency(starForces / 10000, { maximumFractionDigits: 1 })}w`,
      title: formatInteger(starForces)
    },
    {
      id: "valhalla",
      label: "英灵殿",
      value: formatInteger(tinygrailCharacterData?.Total || 0)
    },
    {
      id: "gensokyo",
      label: "幻想乡",
      value: formatInteger(gensokyoCharacterData?.Total || 0)
    },
    {
      id: "pool",
      label: "奖池",
      value: formatInteger(characterPoolAmount || 0)
    },
    {
      id: "crown",
      label: "萌王次数",
      value: crown
    },
    {
      id: "bonus",
      label: "新番加成剩余期数",
      value: bonus
    },
  ]

  return (
    <DrawerNested direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <div
          className="flex items-center justify-center p-1.5 bg-slate-100/80 dark:bg-slate-800/60 rounded-sm cursor-pointer"
        >
          <span className="opacity-50">
            查看详细数据
            <TbCaretRightFilled className="inline-block" />
          </span>
        </div>
      </DrawerTrigger>
      <DrawerContent
        className={cn(
          "bg-card border-none overflow-hidden outline-none", 
          {
            "max-w-96 rounded-l-md": !isMobile,
            "!max-h-[90dvh]":isMobile,
          }
        )}
        aria-describedby={undefined}
      >
        <VisuallyHidden asChild>
          <DrawerTitle />
        </VisuallyHidden>
        <div
          className={cn(
            "flex items-center justify-center h-8 px-4 py-2",
            { "pt-0": isMobile }
          )}
        >
          <span className="text-xs text-foreground font-semibold">角色详细数据</span>
        </div>
        <div className="flex flex-col px-3 gap-y-1 text-xs divide-y divide-slate-300/30 dark:divide-slate-800/70 overflow-y-auto">
          {data.map((item) => (
            <div key={item.id} className="flex flex-row py-2 gap-x-1">
              <div className="text-left opacity-50">{item.label}</div>
              <div
                className="flex-1 text-right truncate"
                title={item.title?.toString() ? item.title : item.value?.toString()}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </DrawerContent>
    </DrawerNested>
  )
}

/**
 * 角色头部骨架屏
 */
function CharacterDrawerInfoCardSkeleton() {
  return (
    <div className="mt-20 p-3 bg-card rounded-md relative">
      <div className="absolute -top-6 left-4 z-10">
        <div className="size-16 rounded-full bg-card">
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
