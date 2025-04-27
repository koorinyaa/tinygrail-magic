import { CharacterDetail, sacrificeCharacter, TempleItem } from "@/api/character";
import { getUserItems, UserItemValue } from "@/api/magic-item";
import { UserCharacterValue } from "@/api/user";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TempleCard } from "@/components/ui/temple-card";
import { cn, formatCurrency, formatInteger, getAvatarUrl, getCoverUrl, isEmpty } from "@/lib/utils";
import { useStore } from "@/store";
import { ArrowUpRight, Ban, Box, ChevronLeft, ChevronRight, CircleFadingArrowUp, Sparkles } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { InputNumber } from "../ui/input-number";
import { Progress } from "../ui/progress";
import styles from './character-drawer-assets.module.css';
import { fatchTinygrailCharacterData, fetchCharacterBoardMembers, fetchCharacterDetail, fetchCharacterLinks, fetchCharacterPoolAmount, fetchCharacterTemple, fetchCharacterUserPageData, fetchGensokyoCharacterData, fetchUserCharacterData, getUserTemple } from "./character-drawer-content";
import CharacterDrawerPopover from "./character-drawer-popover";

/**
 * 资产栏
 */
export default function CharacterDrawerAssets() {
  const [userItems, setUserItems] = useState<UserItemValue[]>([]);
  const { characterDrawerData } = useStore();
  const {
    loading = false,
    characterDetail = null,
    userCharacterData = null,
    userTemple = null,
  } = characterDrawerData;

  useEffect(() => {
    fetchUserItems();
  }, [])

  const fetchUserItems = async () => {
    try {
      const data = await getUserItems();
      if (data.State === 0) {
        setUserItems(data.Value.Items);
      } else {
        throw new Error(data.Message || '获取用户道具列表失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "获取用户道具列表失败";
      console.error(errMsg);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-row relative">
        <UserTempleCard loading={loading} data={userTemple} />
        <UserAssetsInfo
          loading={loading}
          characterDetail={characterDetail}
          userCharacterData={userCharacterData}
          userTemple={userTemple}
        />
      </div>
      <Action loading={loading} userTemple={userTemple} />
      <Items loading={loading} data={userItems} />
    </div>
  );
}

interface UserTempleCardProps {
  loading: boolean;
  data: TempleItem | null;
}

/**
 * 用户圣殿卡片
 * @param { UserTempleCardProps } porps
 * @param {boolean} porps.loading 是否正在加载
 * @param {TempleItem | null} porps.data 我的圣殿数据
 */
function UserTempleCard({ loading, data }: UserTempleCardProps) {
  const { setCharacterDrawer } = useStore();
  const [showLink, setShowLink] = useState(false);

  const {
    Assets: assets = 0,
    Sacrifices: sacrifices = 0,
    Cover: cover = "",
    Level: templeLevel = 0,
    Refine: refine = 0,
    StarForces: starForces = 0,
    Link: link,
  } = data || {};

  /**
   * 我的Link
   * @param link1 
   * @param link2
   */
  const MyLink = ({ link1, link2 }: { link1: TempleItem, link2: TempleItem }) => {
    let leftLink = link1;
    let rightLink = link2;

    if (link1?.Sacrifices < link2?.Sacrifices) {
      leftLink = link2;
      rightLink = link1;
    }

    if (link1?.Sacrifices === link2?.Sacrifices) {
      if (!isNaN(new Date(link1.Create).getTime()) && !isNaN(new Date(link2.Create).getTime())) {
        if (new Date(link1.Create).getTime() < new Date(link2.Create).getTime()) {
          leftLink = link2;
          rightLink = link1;
        }
      }
    }

    return (
      <div className="relative flex flex-row items-center w-[214px] h-full mt-3 shadow-card">
        <div className="absolute w-[120px] h-[165px] mr-[10px] -skew-x-10 origin-top-left overflow-hidden">
          <PhotoProvider bannerVisible={false} maskOpacity={0.4} className="pointer-events-auto backdrop-blur-xs">
            <PhotoView src={getCoverUrl(leftLink.Cover || "", "large")}>
              <div
                className={cn(
                  "relative w-[118px] h-[160px] box-content border-2 border-r-0 rounded-l-md",
                  "bg-cover bg-center bg-no-repeat",
                  "skew-x-10 origin-top-left overflow-hidden cursor-pointer",
                  {
                    "border-gray-400": leftLink.Level === 0,
                    "border-green-500": leftLink.Level === 1,
                    "border-purple-500": leftLink.Level === 2,
                    "border-amber-500": leftLink.Level === 3,
                  }
                )}
                style={{
                  backgroundImage: `url(${getAvatarUrl(leftLink.Cover, "medium")})`,
                }}
              />
            </PhotoView>
          </PhotoProvider>
        </div>
        <div className="absolute flex left-[93px] w-[120px] h-[165px] mr-[10px] -skew-x-10 origin-bottom-right overflow-hidden">
          <PhotoProvider bannerVisible={false} maskOpacity={0.4} className="pointer-events-auto backdrop-blur-xs">
            <PhotoView src={getCoverUrl(rightLink.Cover || "", "large")}>
              <div
                className={cn(
                  "relative w-[118px] h-[160px] box-content border-2 border-l-0 rounded-r-md",
                  "bg-cover bg-center bg-no-repeat",
                  "skew-x-10 origin-bottom-right overflow-hidden cursor-pointer",
                  {
                    "border-gray-400": rightLink.Level === 0,
                    "border-green-500": rightLink.Level === 1,
                    "border-purple-500": rightLink.Level === 2,
                    "border-amber-500": rightLink.Level === 3,
                  }
                )}
                style={{
                  backgroundImage: `url(${getAvatarUrl(rightLink.Cover || "", "medium")})`,
                }}
              />
            </PhotoView>
          </PhotoProvider>
        </div>
      </div>
    )
  }

  const MyTempleCard = () => {
    if (isEmpty(data)) {
      return (
        <div className="w-full aspect-[3/4] rounded-sm bg-slate-200 dark:bg-slate-800">
          <div className="flex flex-row gap-1 items-center justify-center h-full opacity-30">
            <Ban className="size-5" />
            <span className="text-lg">待建设</span>
          </div>
        </div>
      )
    }

    return (
      <TempleCard
        cover={cover}
        assets={assets}
        sacrifices={sacrifices}
        starForces={starForces}
        templeLevel={templeLevel}
        refine={refine}
        className="w-full rounded-sm overflow-hidden"
      />
    )
  };

  return (
    <>
      <div className="w-42 max-w-1/2">
        {loading ?
          <Skeleton className="w-full h-full aspect-[3/4] rounded-sm bg-slate-200 dark:bg-slate-800" /> :
          <MyTempleCard />
        }
      </div>
      {!isEmpty(link) && (
        <div className="flex flex-col items-center justify-center -mr-2 py-1">
          <div className="h-full w-px bg-slate-300/60 dark:bg-slate-700/60 relative flex items-center justify-center" />
          <div
            className="flex cursor-pointer
              text-xs text-slate-500/80 dark:text-slate-400/80 
              hover:text-slate-600 dark:hover:text-slate-300"
            onClick={() => setShowLink(true)}
          >
            <span className="[writing-mode:vertical-lr] origin-center rotate-180">LINK</span>
          </div>
          <div className="h-full w-px bg-slate-300/60 dark:bg-slate-700/60 relative flex items-center justify-center" />
        </div>
      )}
      <CharacterDrawerPopover
        open={showLink}
        onOpenChange={setShowLink}
        className="flex justify-center h-52"
      >
        <div className="absolute top-2 right-3">
          <div
            className="flex items-center justify-center text-xs opacity-80 hover:opacity-100 cursor-pointer"
            onClick={() => {
              setShowLink(false)
              setCharacterDrawer({
                open: true,
                characterId: link?.CharacterId || null,
              })
            }}
          >
            跳转至
            <span className="text-blue-600">
              {link?.Name}
              <ArrowUpRight className="size-4 mb-px inline-block" />
            </span>
          </div>
        </div>
        {data && link && <MyLink link1={data} link2={link} />}
      </CharacterDrawerPopover>
    </>
  );
}

interface UserAssetsInfoProps {
  loading: boolean;
  characterDetail: CharacterDetail | null;
  userCharacterData: UserCharacterValue | null;
  userTemple: TempleItem | null;
}

/**
 * 用户资产信息
 * @param {UserAssetsInfoProps} props
 * @param {boolean} porps.loading 是否正在加载
 * @param {CharacterDetail | null} porps.characterDetail 角色详情
 * @param {UserCharacterValue | null} porps.userCharacterData 用户角色数据
 * @param {TempleItem | null} porps.userTemple 我的圣殿数据
 */
function UserAssetsInfo({ loading, characterDetail, userCharacterData, userTemple }: UserAssetsInfoProps) {
  const {
    Rank: rank = 0,
    Rate: rate = 0,
    Level: characterLevel = 0,
    Stars: stars = 0,
  } = characterDetail || {};

  const {
    Assets: assets = 0,
    Refine: refine = 0,
    Level: templeLevel = 0,
    StarForces: starForces = 0,
  } = userTemple || {};

  const {
    Total: total = 0,
    Amount: amount = 0,
  } = userCharacterData || {};

  // 获取我的圣殿股息
  const getMyTempleRate = () => {
    if (rank <= 500) {
      const baseRate = rate * (601 - rank) * 0.005;
      const levelCoefficient = 2 * characterLevel + 1;
      const refineCoefficient = 2 * (characterLevel + refine) + 1
      const templeRate = baseRate / levelCoefficient * refineCoefficient
      return templeRate
    } else {
      return stars * 2
    }
  }

  const assetItems = [
    { label: '持股', value: formatInteger(total, true) },
    { label: '可用活股', value: formatInteger(amount, true) },
    { label: '圣殿等级', value: refine > 0 ? `+${refine}` : templeLevel },
    { label: '圣殿股息₵', value: formatCurrency(getMyTempleRate()) },
    { label: '圣殿总息₵', value: formatCurrency(getMyTempleRate() * assets, { useWUnit: true }) },
    { label: '星之力', value: formatInteger(starForces, true) },
  ];

  if (loading) {
    return (
      <UserAssetsInfoSkeleton />
    )
  }

  return (
    <div className="w-full flex-1 ml-2 bg-slate-100/80 dark:bg-slate-800/60 rounded-sm">
      <div className="flex flex-col h-full text-xs divide-y divide-slate-300/30 dark:divide-slate-800/70 p-2 first:pt-0 last:pb-0">
        {assetItems.map(({ label, value }, index) => (
          <div key={index} className="flex-1 flex items-center">
            <span className="truncate">
              {label}
            </span>
            <span className="flex-1 font-semibold text-right truncate">
              {value}
            </span>
          </div>
        ))}
      </div >
    </div >
  )
}

/**
 * 用户资产信息骨架屏
 */
function UserAssetsInfoSkeleton() {
  return (
    <div className="w-full flex-1 ml-2">
      <div className="flex flex-col w-full h-full">
        {Array(6).fill(null).map((_, index) => (
          <Skeleton key={index} className="flex-1 w-full h-full m-1 first:mt-0 last:mb-0 bg-slate-200 dark:bg-slate-800" />
        ))}
      </div >
    </div >
  )
}

interface ActionProps {
  loading: boolean;
  userTemple: TempleItem | null;
}

/**
 * 操作按钮
 * @param {ActionProps} props
 * @param {boolean} porps.loading 是否正在加载
 * @param {TempleItem | null} props.userTemple 我的圣殿数据
 */
function Action({ loading, userTemple }: ActionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverContent, setPopoverContent] = useState<ReactNode>(null);

  const {
    Assets: assets = 0,
    Sacrifices: sacrifices = 0,
    Level: templeLevel = 0,
  } = userTemple || {};

  const buttons = [
    <span
      className="flex flex-row items-center justify-center gap-1"
      onClick={() => {
        setShowPopover(true);
        setPopoverContent(<AssetRestructureContent onClose={() => setShowPopover(false)} />);
      }}
    >
      <Box className="size-3" />
      资产重组
    </span>,
    ...(userTemple ? [
      <span className="flex flex-row items-center justify-center gap-1" onClick={() => toast.warning("开发中")}>
        <Sparkles className="size-3" />
        转换星之力
      </span>,
    ] : []),
    ...(userTemple
      && templeLevel > 0
      && sacrifices >= 2500
      && assets >= 2500
      ? [
        <span className="flex flex-row items-center justify-center gap-1" onClick={() => toast.warning("开发中")}>
          <CircleFadingArrowUp className="size-3" />
          精炼
        </span>
      ] : []),
    ...(userTemple && templeLevel > 0 ? [
      <span className="flex flex-row items-center justify-center gap-1" onClick={() => toast.warning("开发中")}>
        <Box className="size-3" />
        修改塔图
      </span>,
      <span className="flex flex-row items-center justify-center gap-1" onClick={() => toast.warning("开发中")}>
        <Box className="size-3" />
        重置塔图
      </span>,
      <span className="flex flex-row items-center justify-center gap-1" onClick={() => toast.warning("开发中")}>
        <Box className="size-3" />
        LINK
      </span>,
      <span className="flex flex-row items-center justify-center gap-1" onClick={() => toast.warning("开发中")}>
        <Box className="size-3" />
        台词
      </span>,
    ] : []),
    ...(userTemple && sacrifices === assets ? [
      <span className="flex flex-row items-center justify-center gap-1" onClick={() => toast.warning("开发中")}>
        <Box className="size-3" />
        拆除圣殿
      </span>,
    ] : []),
  ];

  // 检查是否需要显示滚动箭头
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  // 滚动到左侧
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    }
  };

  // 滚动到右侧
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    }
  };

  // 监听滚动容器变化
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      // 初始检查
      checkScrollPosition();

      // 使用函数引用以确保事件监听器能正确移除
      const handleScroll = () => checkScrollPosition();
      scrollContainer.addEventListener('scroll', handleScroll);

      // ResizeObserver 监听容器大小变化
      const resizeObserver = new ResizeObserver(() => {
        checkScrollPosition();
      });
      resizeObserver.observe(scrollContainer);

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
        resizeObserver.disconnect();
      };
    }
  }, [buttons]);

  // 内容变化时重新检查滚动状态
  useEffect(() => {
    checkScrollPosition();
  }, [buttons.length, userTemple]);

  if (loading) {
    return (
      <ActionSkeleton />
    )
  }

  return (
    <>
      <div className="w-full relative">
        {showLeftArrow && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 size-5 flex items-center justify-center
            bg-slate-200/90 dark:bg-slate-800/90 rounded-full cursor-pointer shadow-sm
            hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            onClick={scrollLeft}
          >
            <ChevronLeft className="size-3.5 text-slate-600 dark:text-slate-300" />
          </div>
        )}

        <div
          ref={scrollContainerRef}
          className={cn(
            "w-full flex flex-nowrap gap-1.5 overflow-x-auto px-1 py-0.5",
            styles.mScrollbarNone
          )}
        >
          {buttons.map((button, index) => (
            <div
              key={index}
              className="inline-flex items-center justify-center 
              bg-slate-300/50 dark:bg-slate-700/50 hover:bg-slate-300/80 dark:hover:bg-slate-700/80 
              text-xs rounded-full first:ml-0 py-1 px-2 cursor-pointer
              transition-all duration-200 flex-shrink-0"
            >
              {button}
            </div>
          ))}
        </div>
        {showRightArrow && (
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 size-5 flex items-center justify-center
            bg-slate-200/90 dark:bg-slate-800/90 rounded-full cursor-pointer shadow-sm
            hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            onClick={scrollRight}
          >
            <ChevronRight className="size-3.5 text-slate-600 dark:text-slate-300" />
          </div>
        )}
      </div>
      <CharacterDrawerPopover
        open={showPopover}
        onOpenChange={setShowPopover}
        className="flex justify-center"
      >
        {popoverContent}
      </CharacterDrawerPopover>
    </>
  );
}

/**
 * 资产重组内容
 * @param {Object} props
 * @param {() => void} props.onClose 关闭回调
 */
function AssetRestructureContent({ onClose }: { onClose: () => void }) {
  const { userAssets, characterDrawerData, setCharacterDrawerData, } = useStore();
  const {
    userCharacterData,
    userTemple,
    currentCharacterUserPage,
  } = characterDrawerData
  const {
    Total: total = 0,
    Amount: amount = 0,
  } = userCharacterData || {};
  const {
    Assets: assets = 0,
    Sacrifices: sacrifices = 0,
    Level: templeLevel = 0,
  } = userTemple || {};
  const [activeTab, setActiveTab] = useState<'temple' | 'financing'>('temple');
  const [convertAmount, setConvertAmount] = useState(sacrifices >= 500 ? 0 : Math.min(100, amount));
  const [financingAmount, setFinancingAmount] = useState(sacrifices >= 500 ? 0 : Math.min(100, amount));

  useEffect(() => {
    setCharacterDrawerData({
      handleOnly: true,
    })

    return () => {
      setCharacterDrawerData({
        handleOnly: false,
      })
    }
  }, [])

  /**
   * 处理角色献祭
   * @param {number} amount - 献祭数量
   * @param {boolean} isFinancing - false为献祭，true为股权融资
   */
  const handleSacrifice = async (amount: number, isFinancing: boolean = false) => {
    if (!characterDrawerData.characterDetail?.CharacterId) return;

    try {
      const characterId = characterDrawerData.characterDetail.CharacterId;
      const result = await sacrificeCharacter(characterId, amount, isFinancing);

      if (result.State === 0) {
        if (isFinancing) {
          const {
            Balance: balance = 0,
          } = result.Value;

          const description =
            <span>
              <span className="mr-1">获得</span>
              <span className="text-green-400 dark:text-green-600 mr-1">₵{formatCurrency(balance, { useWUnit: true })}</span>
            </span>;

          toast.success('股权融资成功', {
            duration: Infinity,
            cancel: {
              label: '关闭',
              onClick: () => { },
            },
            description,
          });
          onClose();

          // 更新幻想乡数据
          fetchGensokyoCharacterData(
            characterId,
            (gensokyoCharacterData) => {
              setCharacterDrawerData({ gensokyoCharacterData });
            }
          )
        } else {
          const {
            Balance: balance = 0,
            Items: items = [],
          } = result.Value;

          const description =
            <span>
              <span className="mr-1">获得</span>
              <span className="text-green-400 dark:text-green-600 mr-2">₵{formatCurrency(balance, { useWUnit: true })}</span>
              {items.length > 0 && (
                <span>
                  {items.map((item, index) => (
                    <span key={index} className="inline-flex items-center mr-2">
                      <div
                        className="inline-flex size-3 bg-cover bg-center rounded-full mr-1"
                        style={{ backgroundImage: `url('${getAvatarUrl(item.Icon)}')` }}
                      />
                      {item.Name}×{item.Count}
                    </span>
                  ))}
                </span>
              )}
            </span>;

          toast.success('献祭成功', {
            duration: Infinity,
            cancel: {
              label: '关闭',
              onClick: () => { },
            },
            description,
          });
          onClose();

          let userCharacterData, characterTemples, characterlinks;
          // 更新角色数据
          fetchCharacterDetail(
            characterId,
            (characterDetail) => {
              setCharacterDrawerData({ characterDetail });
            }
          );

          // 更新角色圣殿数据
          characterTemples = await fetchCharacterTemple(
            characterId,
            (characterTemples) => {
              setCharacterDrawerData({ characterTemples });
            }
          )

          // 更新角色LINK数据
          characterlinks = await fetchCharacterLinks(
            characterId,
            (characterlinks) => {
              setCharacterDrawerData({ characterlinks });
            }
          )

          // 更新用户圣殿数据
          if (userCharacterData && characterTemples && characterlinks) {
            setCharacterDrawerData({
              userTemple: await getUserTemple(userCharacterData, characterTemples, characterlinks, userAssets?.name),
            });
          }

          // 更新英灵殿数据
          fatchTinygrailCharacterData(
            characterId,
            (tinygrailCharacterData) => {
              setCharacterDrawerData({ tinygrailCharacterData });
            }
          );
        }

        // 更新用户角色数据
        await fetchUserCharacterData(
          characterId,
          userAssets?.name,
          (userCharacterData) => {
            setCharacterDrawerData({ userCharacterData });
          }
        );

        // 更新奖池数量
        fetchCharacterPoolAmount(
          characterId,
          (characterPoolAmount) => {
            setCharacterDrawerData({ characterPoolAmount });
          }
        );

        // 更新董事会成员
        fetchCharacterBoardMembers(
          characterId,
          (characterBoardMembers) => {
            setCharacterDrawerData({ characterBoardMembers });
          }
        )

        // 更新当前用户分页数据
        fetchCharacterUserPageData(
          characterId,
          currentCharacterUserPage || 1,
          (currentCharacterUserPageData) => {
            setCharacterDrawerData({ currentCharacterUserPageData });
          }
        )
      } else {
        if (isFinancing) {
          throw new Error(result.Message || '献祭失败');
        } else {
          throw new Error(result.Message || '股权融资失败');
        }
      }
    } catch (error) {
      let errorMessage;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = isFinancing ? '献祭失败' : '股权融资失败';
      }
      toast.error(errorMessage);
      console.error(errorMessage);
    }
  };

  return (
    <div className="w-full h-fit flex flex-col gap-y-2">
      {
        sacrifices > 0 &&
        <div className="flex flex-row gap-x-2 text-xs" title="圣殿">
          <div className="flex-1 flex flex-col">
            <span
              className={cn(
                {
                  "text-gray-500 dark:text-gray-600": templeLevel <= 0,
                  "text-green-500 dark:text-green-600": templeLevel === 1,
                  "text-purple-500 dark:text-purple-600": templeLevel === 2,
                  "text-amber-500 dark:text-amber-600": templeLevel === 3,
                }
              )}
            >
              {formatInteger(assets)} / {formatInteger(sacrifices)}
            </span>
            <Progress
              value={(assets / sacrifices) * 100}
              indicatorColor={cn({
                "bg-gray-500": templeLevel <= 0,
                "bg-green-500 dark:bg-green-600": templeLevel === 1,
                "bg-purple-500 dark:bg-purple-600": templeLevel === 2,
                "bg-amber-500 dark:bg-amber-600": templeLevel === 3,
              })}
              className="h-1"
            />
          </div>
        </div>
      }
      <div className="flex flex-row gap-2 text-xs">
        <span className="flex-1">
          持股
          <span className="ml-2 text-green-400 dark:text-green-600">
            {formatInteger(total)}
          </span>
        </span>
        <span className="flex-1">
          可用活股
          <span className="ml-2 text-green-400 dark:text-green-600">
            {formatInteger(amount)}
          </span>
        </span>
      </div>

      <div className="flex flex-row gap-2">
        <Badge
          variant="secondary"
          className={cn(
            "rounded-sm cursor-pointer",
            "hover:bg-slate-200 dark:hover:bg-slate-700",
            {
              "bg-primary/90 hover:bg-primary/90 dark:hover:bg-primary/90 text-primary-foreground": activeTab === 'temple',
            }
          )}
          onClick={() => setActiveTab('temple')}
        >
          献祭
        </Badge>
        <Badge
          variant="secondary"
          className={cn(
            "rounded-sm cursor-pointer",
            "hover:bg-slate-200 dark:hover:bg-slate-700",
            {
              "bg-primary/90 hover:bg-primary/90 dark:hover:bg-primary/90 text-primary-foreground": activeTab === 'financing',
            }
          )}
          onClick={() => setActiveTab('financing')}
        >
          股权融资
        </Badge>
      </div>
      {
        activeTab === 'temple' && (
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-row items-center justify-evenly h-8 gap-x-1">
              <div className="w-24 text-sm opacity-60">数量</div>
              <InputNumber
                placeholder="请输入数量"
                value={convertAmount}
                onChange={(value) => {
                  if (typeof value === 'number') {
                    setConvertAmount(value);
                  }
                }}
                min={0}
                className="text-sm"
              />
            </div>
            <div className="flex flex-row items-center justify-end gap-x-2">
              <Badge
                variant="outline"
                className="rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={() => {
                  if (sacrifices === 0) {
                    setConvertAmount(500);
                    return;
                  }
                  if (sacrifices >= 500) {
                    setConvertAmount(0);
                    return;
                  }
                  if (assets >= sacrifices) {
                    setConvertAmount(500 - sacrifices);
                    return;
                  }
                  if (assets < sacrifices) {
                    setConvertAmount(Math.floor((sacrifices - assets) / 2) + (500 - sacrifices));
                    return;
                  }
                }}
              >
                光辉圣殿
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={() => {
                  if (sacrifices === 0) {
                    setConvertAmount(2500);
                    return;
                  }
                  if (sacrifices >= 2500) {
                    setConvertAmount(0);
                    return;
                  }
                  if (assets >= sacrifices) {
                    setConvertAmount(2500 - sacrifices);
                    return;
                  }
                  if (assets < sacrifices) {
                    setConvertAmount(Math.floor((sacrifices - assets) / 2) + (2500 - sacrifices));
                    return;
                  }
                }}
              >
                闪耀圣殿
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={() => {
                  if (sacrifices === 0) {
                    setConvertAmount(12500);
                    return;
                  }
                  if (sacrifices >= 12500) {
                    setConvertAmount(0);
                    return;
                  }
                  if (assets >= sacrifices) {
                    setConvertAmount(12500 - sacrifices);
                    return;
                  }
                  if (assets < sacrifices) {
                    setConvertAmount(Math.floor((sacrifices - assets) / 2) + (12500 - sacrifices));
                    return;
                  }
                }}
              >
                奇迹圣殿
              </Badge>
              {
                userTemple &&
                <Badge
                  variant="outline"
                  className="rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                  onClick={() => {
                    setConvertAmount(Math.max(0, Math.floor((sacrifices - assets) / 2)));
                  }}
                >
                  补满
                </Badge>
              }
            </div>
            {
              amount < convertAmount &&
              <div className="flex flex-row items-center gap-x-2">
                <span className="text-xs text-amber-400 dark:text-amber-600">可用活股数量不足</span>
              </div>
            }
            <div className="flex flex-row items-center gap-x-2">
              <Button
                disabled={amount < convertAmount}
                className="w-full h-8 rounded-full"
                onClick={() => {
                  handleSacrifice(convertAmount, false);
                }}
              >
                献祭
              </Button>
            </div>
          </div>
        )
      }
      {
        activeTab === 'financing' && (
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-row items-center justify-evenly h-8 gap-x-1">
              <div className="w-24 text-sm opacity-60">数量</div>
              <InputNumber
                placeholder="请输入数量"
                value={financingAmount}
                onChange={(value) => {
                  if (typeof value === 'number') {
                    setFinancingAmount(value);
                  }
                }}
                min={0}
                max={amount}
                className="text-sm"
              />
            </div>
            <div className="flex flex-row items-center gap-x-2">
              <span className="text-xs text-amber-400 dark:text-amber-600">将股份出售给幻想乡获取现金，不会补充固定资产</span>
            </div>
            <div className="flex flex-row items-center gap-x-2">
              <Button
                disabled={amount < financingAmount}
                className="w-full h-8 rounded-full"
                onClick={() => {
                  handleSacrifice(financingAmount, true);
                }}
              >
                融资
              </Button>
            </div>
          </div>
        )
      }
    </div>
  )
}

/**
 * 道具栏骨架屏
 */
function ActionSkeleton() {
  return (
    <div
      className="w-full flex flex-nowrap gap-1.5 overflow-x-auto px-1 py-0.5"
      style={{
        scrollbarWidth: 'none',
      }}
    >
      <Skeleton className="rounded-full w-16 h-6 bg-slate-200 dark:bg-slate-800" />
      <Skeleton className="rounded-full w-16 h-6 bg-slate-200 dark:bg-slate-800" />
      <Skeleton className="rounded-full w-16 h-6 bg-slate-200 dark:bg-slate-800" />
    </div>
  )
}

interface ItemsProps {
  loading: boolean;
  data: UserItemValue[];
}
/**
 * 道具栏
 * @param {ItemsProps} props
 * @param {boolean} porps.loading 是否正在加载
 * @param {UserItemValue[]} props.data 用户道具列表
 */
function Items({ loading, data }: ItemsProps) {
  const itemsData = data.reduce((acc, item) => {
    acc[item.Id] = item;
    return acc;
  }, {} as Record<number, UserItemValue>)

  const items = [
    {
      icon: itemsData[5]?.Icon || "https://tinygrail.oss-cn-hangzhou.aliyuncs.com/image/cube.png",
      name: "混沌魔方",
      description: "消耗10点固定资产，获得随机角色活股",
      amount: itemsData[5]?.Amount || 0,
    },
    {
      icon: itemsData[6]?.Icon || "https://tinygrail.oss-cn-hangzhou.aliyuncs.com/image/sign.png",
      name: "虚空道标",
      description: "消耗100点固定资产，获得指定角色活股",
      amount: itemsData[6]?.Amount || 0,
    },
    {
      icon: itemsData[9]?.Icon || "https://tinygrail.oss-cn-hangzhou.aliyuncs.com/image/eye2.png",
      name: "鲤鱼之眼",
      description: "消耗100点固定资产，将指定角色从幻想乡移至英灵殿",
      amount: itemsData[9]?.Amount || 0,
    },
    {
      icon: itemsData[1]?.Icon || "https://tinygrail.oss-cn-hangzhou.aliyuncs.com/image/star.png",
      name: "星光碎片",
      description: "消耗指定角色活股，补充固定资产",
      amount: itemsData[1]?.Amount || 0,
    },
    {
      icon: itemsData[2]?.Icon || "https://tinygrail.oss-cn-hangzhou.aliyuncs.com/image/fire.png",
      name: "闪光结晶",
      description: "消耗100点固定资产，攻击指定角色星之力",
      amount: itemsData[2]?.Amount || 0,
    },
  ]

  if (loading) {
    return (
      <ItemsSkeleton />
    )
  }

  return (
    <div className="w-full bg-slate-200/50 dark:bg-slate-800/60 rounded-sm p-2">
      <div className="text-xs mb-1.5 opacity-70">道具栏</div>
      <div className="flex flex-col gap-1 pb-1">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-row items-center rounded-md p-1.5 cursor-pointer transition-colors 
              bg-slate-300/50 dark:bg-slate-700/50 hover:bg-slate-300/70 dark:hover:bg-slate-700/70"
              onClick={() => toast.warning("开发中")}
          >
            <div
              className="size-8 bg-cover bg-center rounded-sm mr-2"
              style={{ backgroundImage: `url('${getAvatarUrl(item.icon)}')` }}
            />
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-semibold">{item.name}</div>
              <div className="text-xs opacity-60 truncate">{item.description}</div>
            </div>
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">×{item.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 道具栏骨架屏
 */
function ItemsSkeleton() {
  return (
    <div className="w-full bg-slate-200/50 dark:bg-slate-800/60 rounded-sm p-2">
      <Skeleton className="mb-1.5 h-4 w-10 rounded-sm bg-slate-300/50 dark:bg-slate-700/50" />
      <div className="flex flex-col gap-1 pb-1">
        {Array(5).fill(null).map((_, index) => (
          <Skeleton key={index} className="w-full h-11 bg-slate-300/50 dark:bg-slate-700/50" />
        ))}
      </div>
    </div>
  )
}
