import { CharacterDetail, TempleItem } from "@/api/character";
import { getUserItems, UserItemValue } from "@/api/magic-item";
import { UserCharacterValue } from "@/api/user";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { TempleCard } from "@/components/ui/temple-card";
import { formatCurrency, formatInteger, getAvatarUrl, getCoverUrl, isEmpty } from "@/lib/utils";
import { useStore } from "@/store";
import { Ban, Box, ChevronsRight, CircleFadingArrowUp, MoreHorizontal, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

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
      <div className="flex flex-row">
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
  const {
    Assets: assets = 0,
    Sacrifices: sacrifices = 0,
    Cover: cover = "",
    Level: templeLevel = 0,
    Refine: refine = 0,
    StarForces: starForces = 0,
    Link: link = {},
  } = data || {};

  const MyTempleCard = () => {
    if (isEmpty(data)) {
      return (
        <div className="w-full aspect-[3/4] rounded-sm bg-slate-200 dark:bg-slate-900">
          <div className="flex flex-row gap-1 items-center justify-center h-full opacity-30">
            <Ban className="size-5" />
            <span className="text-lg">待建设</span>
          </div>
        </div>
      )
    }

    return (
      <TempleCard
        cover={getCoverUrl(cover, 'medium')}
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
          <Skeleton className="w-full h-full aspect-[3/4] rounded-sm bg-slate-200 dark:bg-slate-900" /> :
          <MyTempleCard />
        }
      </div>
      {!isEmpty(link) && (
        <div className="flex flex-col items-center justify-center ml-1 pl-1 py-1">
          <div className="h-full w-px bg-slate-300/60 dark:bg-slate-700/60 relative flex items-center justify-center" />
          <div
            className="w-1 -ml-3 cursor-pointer
              text-slate-500/80 dark:text-slate-400/80 
              hover:text-slate-600 dark:hover:text-slate-300"
          >
            <ChevronsRight className="size-4" />
          </div>
          <div className="h-full w-px bg-slate-300/60 dark:bg-slate-700/60 relative flex items-center justify-center" />
        </div>
      )}
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
    <div className="w-full flex-1 ml-2 bg-slate-100/80 dark:bg-slate-900/60 rounded-sm">
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
          <Skeleton key={index} className="flex-1 w-full h-full m-1 first:mt-0 last:mb-0 bg-slate-200 dark:bg-slate-900" />
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
  const {
    Assets: assets = 0,
    Sacrifices: sacrifices = 0,
    Level: templeLevel = 0,
  } = userTemple || {};

  const buttons = [
    { Icon: Box, text: '资产重组' },
    ...(userTemple ? [
      { Icon: Sparkles, text: '转换星之力' },
    ] : []),
    ...(userTemple
      && templeLevel > 0
      && sacrifices >= 2500
      && assets >= 2500
      ? [
        { Icon: CircleFadingArrowUp, text: '精炼' },
      ] : []),
  ];

  const moreActions = [
    ...(userTemple && templeLevel > 0 ? [
      { text: '修改塔图', onClick: () => { } },
      { text: '重置塔图', onClick: () => { } },
      { text: 'LINK', onClick: () => { } },
      { text: '台词', onClick: () => { } },
    ] : []),
    ...(userTemple && sacrifices === assets ? [
      { text: '拆除圣殿', onClick: () => { } }, // TODO: 超出上限圣殿是否可以拆除待测试
    ] : []),
  ];

  if (loading) {
    return (
      <ActionSkeleton />
    )
  }

  return (
    <div
      className="w-full flex flex-nowrap gap-1.5 overflow-x-auto"
      style={{
        scrollbarWidth: 'none',
      }}
    >
      {buttons.map(({ Icon, text }, index) => (
        <span
          key={index}
          className="inline-flex items-center justify-center 
            bg-slate-300/50 dark:bg-slate-700/50 hover:bg-slate-300/80 dark:hover:bg-slate-700/80 
            text-xs rounded-full 
            gap-1 first:ml-0 py-1 px-2 cursor-pointer
            transition-all duration-200 flex-shrink-0"
        >
          <Icon className="size-3" />
          {text}
        </span>
      ))}
      {!isEmpty(moreActions) &&
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span
              className="inline-flex items-center justify-center bg-slate-300/50 dark:bg-slate-700/50 hover:bg-slate-300/80 dark:hover:bg-slate-700/80 
              text-xs rounded-full 
              gap-1 p-1 cursor-pointer
              transition-colors flex-shrink-0"
            >
              <MoreHorizontal className="size-4" />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {moreActions.map(({ text, onClick }, index) => (
              <DropdownMenuItem key={index} onClick={onClick}>
                {text}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>}
    </div>
  );
}

/**
 * 道具栏骨架屏
 */
function ActionSkeleton() {
  return (
    <div
      className="w-full flex flex-nowrap gap-1.5 overflow-x-auto"
      style={{
        scrollbarWidth: 'none',
      }}
    >
      <Skeleton className="rounded-full w-16 h-6 bg-slate-200 dark:bg-slate-900" />
      <Skeleton className="rounded-full w-16 h-6 bg-slate-200 dark:bg-slate-900" />
      <Skeleton className="rounded-full w-16 h-6 bg-slate-200 dark:bg-slate-900" />
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
    <div className="w-full bg-slate-200/50 dark:bg-slate-900/60 rounded-sm p-2">
      <div className="text-xs mb-1.5 opacity-70">道具栏</div>
      <div className="flex flex-col gap-1 pb-1">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-row items-center rounded-md p-1.5 cursor-pointer transition-colors 
              bg-slate-300/50 dark:bg-slate-800/50 hover:bg-slate-300/70 dark:hover:bg-slate-700/70"
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
    <div className="w-full bg-slate-200/50 dark:bg-slate-900/60 rounded-sm p-2">
      <Skeleton className="mb-1.5 h-4 w-10 rounded-sm bg-slate-300/50 dark:bg-slate-800/50" />
      <div className="flex flex-col gap-1 pb-1">
        {Array(5).fill(null).map((_, index) => (
          <Skeleton key={index} className="w-full h-11 bg-slate-300/50 dark:bg-slate-800/50" />
        ))}
      </div>
    </div>
  )
}
