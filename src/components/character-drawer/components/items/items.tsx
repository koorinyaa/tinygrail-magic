import { getUserItems, UserItemValue } from '@/api/magic-item';
import { Skeleton } from '@/components/ui/skeleton';
import { getAvatarUrl, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CharacterDrawerPopover } from '../../components/character-drawer-popover';
import { Chaos } from './chaos';
import { Fisheye } from './fisheye';
import { Guidepost } from './guidepost';
import { Starbreak } from './starbreak';
import { Stardust } from './stardust';

/**
 * 道具列表
 */
export function Items() {
  const { characterDrawer, characterDrawerData } = useStore();
  const [itemsData, setItemsData] = useState<Record<number, UserItemValue>>({});
  const [showPopover, setShowPopover] = useState(false);
  const [popoverContent, setPopoverContent] = useState<ReactNode>(null);

  useEffect(() => {
    if (!showPopover) {
      setPopoverContent(null);
      fetchUserItems();
    }
  }, [showPopover]);

  useEffect(() => {
    fetchUserItems();
  }, []);

  /**
   * 获取用户道具列表
   */
  const fetchUserItems = async () => {
    try {
      const data = await getUserItems();
      if (data.State === 0) {
        const itemsData = data.Value.Items.reduce((acc, item) => {
          acc[item.Id] = item;
          return acc;
        }, {} as Record<number, UserItemValue>);
        setItemsData(itemsData);
      } else {
        throw new Error(data.Message || '获取用户道具列表失败');
      }
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : '获取用户道具列表失败';
      notifyError(errMsg);
    }
  };

  const items = [
    {
      icon:
        itemsData[5]?.Icon ||
        'https://tinygrail.oss-cn-hangzhou.aliyuncs.com/image/cube.png',
      name: '混沌魔方',
      description: '消耗10点固定资产，获得随机角色活股',
      amount: itemsData[5]?.Amount || 0,
      onClick: () => {
        setShowPopover(true);
        setPopoverContent(<Chaos onClose={() => setShowPopover(false)} />);
      },
    },
    {
      icon:
        itemsData[6]?.Icon ||
        'https://tinygrail.oss-cn-hangzhou.aliyuncs.com/image/sign.png',
      name: '虚空道标',
      description: '消耗100点固定资产，获得指定角色活股',
      amount: itemsData[6]?.Amount || 0,
      onClick: () => {
        setShowPopover(true);
        setPopoverContent(<Guidepost onClose={() => setShowPopover(false)} />);
      },
    },
    {
      icon:
        itemsData[9]?.Icon ||
        'https://tinygrail.oss-cn-hangzhou.aliyuncs.com/image/eye2.png',
      name: '鲤鱼之眼',
      description: '消耗100点固定资产，将指定角色从幻想乡移至英灵殿',
      amount: itemsData[9]?.Amount || 0,
      onClick: () => {
        setShowPopover(true);
        setPopoverContent(
          <Fisheye
            onClose={() => {
              setShowPopover(false);
            }}
          />
        );
      },
    },
    {
      icon:
        itemsData[1]?.Icon ||
        'https://tinygrail.oss-cn-hangzhou.aliyuncs.com/image/star.png',
      name: '星光碎片',
      description: '消耗指定角色活股，补充固定资产',
      amount: itemsData[1]?.Amount || 0,
      onClick: () => {
        setShowPopover(true);
        setPopoverContent(<Stardust onClose={() => setShowPopover(false)} />);
      },
    },
    {
      icon:
        itemsData[2]?.Icon ||
        'https://tinygrail.oss-cn-hangzhou.aliyuncs.com/image/fire.png',
      name: '闪光结晶',
      description: '消耗100点固定资产，攻击指定角色星之力',
      amount: itemsData[2]?.Amount || 0,
      onClick: () => {
        setShowPopover(true);
        setPopoverContent(<Starbreak onClose={() => setShowPopover(false)} />);
      },
    },
  ];

  if (characterDrawer.loading) {
    return (
      <div className="w-full bg-slate-200/50 dark:bg-slate-800/60 rounded-sm p-2">
        <Skeleton className="mb-1.5 h-4 w-10 rounded-sm bg-slate-300/50 dark:bg-slate-700/50" />
        <div className="flex flex-col gap-1 pb-1">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <Skeleton
                key={index}
                className="w-full h-11 bg-slate-300/50 dark:bg-slate-700/50"
              />
            ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-slate-200/50 dark:bg-slate-800/60 rounded-sm p-2">
        <div className="text-xs mb-1.5 opacity-70">道具栏</div>
        <div className="flex flex-col gap-1 pb-1">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-row gap-x-1.5 rounded-md p-1.5 cursor-pointer transition-colors
              bg-slate-300/50 dark:bg-slate-700/50 hover:bg-slate-300/70 dark:hover:bg-slate-700/70"
              onClick={() => {
                if (item.amount <= 0) {
                  toast.warning('道具数量不足');
                  return;
                }

                if ((characterDrawerData.userTempleData?.Level ?? 0) <= 0) {
                  toast.warning('圣殿等级不足');
                  return;
                }

                item.onClick?.();
              }}
            >
              <div
                className="size-8 bg-cover bg-center rounded-sm"
                style={{ backgroundImage: `url('${getAvatarUrl(item.icon)}')` }}
              />
              <div className="flex-1">
                <div className="text-xs font-semibold">{item.name}</div>
                <div className="text-xs text-wrap opacity-60">
                  {item.description}
                </div>
              </div>
              <div className="flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400">
                ×{item.amount}
              </div>
            </div>
          ))}
        </div>
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
