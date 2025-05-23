import {
  ShareBonusTestValue,
  UserAssets,
  UserCharaPageValue,
  UserIcoPageValue,
  UserLinkPageValue,
  UserTemplePageValue,
} from '@/api/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TabsLine,
  TabsLineContent,
  TabsLineList,
  TabsLineTrigger,
} from '@/components/ui/tabs-line';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  cn,
  decodeHTMLEntities,
  formatCurrency,
  formatInteger,
  getAvatarUrl,
  notifyError,
} from '@/lib/utils';
import { useStore } from '@/store';
import { HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RedEnvelopeDialog } from './components/red-envelope-dialog';
import { UserCharacter } from './components/user-character';
import { UserIco } from './components/user-ico';
import { UserLink } from './components/user-link';
import { UserTemple } from './components/user-temple';
import {
  fatchUserAssetsData,
  fatchUserBonusData,
  fatchUserCharaPageData,
  fatchUserIcoPageData,
  fatchUserLinkPageData,
  fatchUserTemplePageData,
  fetchICOData,
} from './service/service';

/**
 * 用户的小圣杯
 * @param props
 * @param props.userName 用户名
 */
export function UserTinygrail({ userName }: { userName: string }) {
  const { toTop, userAssets } = useStore();
  const isMobile = useIsMobile();
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 当前标签页
  const [currentTab, setCurrentTab] = useState<
    'link' | 'temple' | 'character' | 'ico'
  >('link');
  // 资产数据
  const [assetsData, setAssetsData] = useState<UserAssets>();
  // 股息数据
  const [bonusData, setBonusData] = useState<ShareBonusTestValue>();
  // 链接分页数据
  const [linkPageData, setLinkPageData] = useState<UserLinkPageValue>();
  // 圣殿分页数据
  const [templePageData, setTemplePageData] = useState<UserTemplePageValue>();
  // 角色分页数据
  const [charaPageData, setCharaPageData] = useState<UserCharaPageValue>();
  // ico分页数据
  const [icoPageData, setIcoPageData] = useState<UserIcoPageValue>();
  // 红包弹窗
  const [openRedEnvelopeDialog, setOpenRedEnvelopeDialog] = useState(false);

  useEffect(() => {
    // 初始化数据
    initializeData();
    // 滚动到顶部
    toTop();
  }, [userName]);

  /**
   * 初始化数据
   */
  const initializeData = async () => {
    if (!userName) return;
    setLoading(true);

    try {
      const [
        userAssetsData,
        userBonusData,
        userLinkPageData,
        userTemplePageData,
        userCharaPageData,
        userIcoPageData,
        icoItems,
      ] = await Promise.all([
        fatchUserAssetsData(userName),
        fatchUserBonusData(userName),
        fatchUserLinkPageData(userName, 1),
        fatchUserTemplePageData(userName, 1),
        fatchUserCharaPageData(userName, 1),
        fatchUserIcoPageData(userName, 1),
        fetchICOData(),
      ]);
      setAssetsData(userAssetsData);
      setBonusData(userBonusData);
      setLinkPageData(userLinkPageData);
      setTemplePageData(userTemplePageData);
      setCharaPageData(userCharaPageData);
      // 将 icoItems 转换成 Map
      const icoItemsMap = new Map(
        icoItems.map((item) => [item.CharacterId, item])
      );
      // 合并 ICO 数据，保留用户 ICO 的 State 字段
      const mergedIcoItems = userIcoPageData.Items.map((userIco) => {
        const icoItem = icoItemsMap.get(userIco.CharacterId);
        return icoItem ? { ...icoItem, State: userIco.State } : userIco;
      });
      setIcoPageData({ ...userIcoPageData, Items: mergedIcoItems });

      if (userLinkPageData.TotalItems <= 0) {
        setCurrentTab('temple');
      } else {
        setCurrentTab('link');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '初始化用户数据失败';
      notifyError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleToTop = () => {
    let top = isMobile ? 104 : 152;
    if (userAssets?.name !== userName && isMobile) {
      top += 44;
    }
    toTop(top);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row max-w-screen-xl w-full px-4 py-3 md:px-6 md:py-6 m-auto">
        {loading ? (
          <>
            <div className="mr-4">
              <Skeleton className="size-20 md:size-26 rounded-full" />
            </div>
            <div className="flex flex-col w-full gap-y-0.5 md:gap-y-1 overflow-hidden">
              <div className="flex flex-col">
                <div className="flex items-center h-6.5 md:h-9">
                  <Skeleton className="h-5.5 md:h-8 w-24 rounded-md" />
                </div>
                <div className="flex items-center h-4 md:h-5">
                  <Skeleton className="h-3 md:h-4 w-16 rounded-md" />
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center h-4 md:h-5">
                  <Skeleton className="h-3 md:h-4 w-36 rounded-md" />
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center h-4 md:h-5">
                  <Skeleton className="h-3 md:h-4 w-36 rounded-md" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="relative">
              <Avatar
                className={cn(
                  'size-20 md:size-26 rounded-full border-2 border-secondary mr-4',
                  {
                    'border-red-600': assetsData?.State === 666,
                  }
                )}
              >
                <AvatarImage
                  className="object-cover object-top pointer-events-none"
                  src={getAvatarUrl(assetsData?.Avatar, 'medium')}
                />
                <AvatarFallback className="rounded-full">U</AvatarFallback>
              </Avatar>
              {(assetsData?.LastIndex || 0) > 0 && (
                <Badge
                  className="bg-yellow-500 dark:bg-yellow-600 text-white absolute -top-0.5 -left-1.5 md:top-0 md:left-0 size-7 rounded-full border-2 border-card px-1 scale-75 md:scale-80 cursor-default"
                  title={`首富排名${assetsData?.LastIndex || 0}`}
                >
                  #{assetsData?.LastIndex || 0}
                </Badge>
              )}
            </div>
            <div className="flex flex-col w-full gap-y-0.5 md:gap-y-1 overflow-hidden">
              <div className="flex flex-col">
                <a
                  href={`/user/${userName}`}
                  target="_black"
                  className="text-lg md:text-3xl font-bold truncate"
                >
                  {decodeHTMLEntities(assetsData?.Nickname || '')}
                </a>
                <span className="text-xs md:text-sm -mt-1 md:mt-0 truncate">
                  @{assetsData?.Name}
                </span>
              </div>
              <div className="flex items-center opacity-60">
                <span className="text-xs md:text-sm truncate">
                  资产₵
                  {formatCurrency(assetsData?.Assets ?? 0, {
                    useWUnit: true,
                  })}
                  <span className="mx-1">·</span>
                  <span className="text-xs md:text-sm truncate">
                    余额₵
                    {formatCurrency(assetsData?.Balance ?? 0, {
                      useWUnit: true,
                    })}
                  </span>
                </span>
              </div>
              <div className="flex items-center opacity-60">
                <span className="text-xs md:text-sm truncate">
                  股息₵
                  {formatCurrency(bonusData?.Share ?? 0, {
                    useWUnit: true,
                  })}
                  <span className="mx-1">·</span>
                  <span className="text-xs md:text-sm truncate">
                    税后₵
                    {formatCurrency(
                      (bonusData?.Share ?? 0) - (bonusData?.Tax ?? 0),
                      {
                        useWUnit: true,
                      }
                    )}
                  </span>
                </span>
                {bonusData && (
                  <Popover>
                    <PopoverTrigger>
                      <HelpCircle className="size-3 ml-1 opacity-60 cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      className="px-3 py-2 w-fit"
                      onOpenAutoFocus={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <span className="text-xs text-wrap">
                        {`计息股份共${formatInteger(
                          bonusData.Total
                        )}股，圣殿${formatInteger(bonusData.Temples)}座`}
                        <br />
                        {`预期股息₵${formatCurrency(bonusData.Share)}`}
                        <br />
                        {`个人所得税₵${formatCurrency(
                          bonusData.Tax
                        )}(${formatInteger(
                          (bonusData.Tax / bonusData.Share) * 100
                        )}%)`}
                      </span>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </>
        )}
        <div
          className={cn('hidden md:flex flex-row items-center gap-x-2', {
            'hidden md:hidden': userAssets?.name === userName,
          })}
        >
          <Button
            disabled={loading}
            variant="outline"
            className="rounded-full"
            onClick={() => {
              setOpenRedEnvelopeDialog(true);
            }}
          >
            发送红包
          </Button>
          {/* <Button disabled={loading} variant="outline" className="rounded-full">
            红包记录
          </Button> */}
        </div>
      </div>
      <div
        className={cn('flex md:hidden flex-row items-center gap-x-2 p-2 pt-0', {
          'hidden md:hidden': userAssets?.name === userName,
        })}
      >
        <Button
          disabled={loading}
          variant="outline"
          className="flex-1 rounded-full"
          onClick={() => {
            setOpenRedEnvelopeDialog(true);
          }}
        >
          发送红包
        </Button>
        {/* <Button
          disabled={loading}
          variant="outline"
          className="flex-1 rounded-full"
        >
          红包记录
        </Button> */}
      </div>
      <RedEnvelopeDialog
        userName={userName}
        nickname={assetsData?.Nickname ?? ''}
        open={openRedEnvelopeDialog}
        onOpenChange={setOpenRedEnvelopeDialog}
      />
      <TabsLine
        value={currentTab}
        onValueChange={(value) => {
          handleToTop();
          setCurrentTab(value as 'link' | 'temple' | 'character' | 'ico');
        }}
      >
        <div
          className={cn(
            'sticky z-10 top-0 flex justify-center border-b border-slate-300/30 dark:border-slate-700/30 bg-background'
          )}
        >
          <div className="flex justify-center md:justify-start max-w-screen-xl w-full px-2.5 md:px-4.5 overflow-x-auto">
            <TabsLineList className="flex h-auto rounded-none bg-transparent">
              <TabsLineTrigger
                value="link"
                disabled={loading}
                className={cn('text-sm px-2', {
                  'cursor-pointer': !loading,
                  hidden: (linkPageData?.TotalItems || 0) <= 0,
                })}
              >
                连接
                <span className="text-xs">
                  ({linkPageData?.TotalItems || 0})
                </span>
              </TabsLineTrigger>
              <TabsLineTrigger
                value="temple"
                disabled={loading}
                className={cn('text-sm px-2', {
                  'cursor-pointer': !loading,
                })}
              >
                圣殿
                <span className="text-xs">
                  ({templePageData?.TotalItems || 0})
                </span>
              </TabsLineTrigger>
              <TabsLineTrigger
                value="character"
                disabled={loading}
                className={cn('text-sm px-2', {
                  'cursor-pointer': !loading,
                })}
              >
                角色
                <span className="text-xs">
                  ({charaPageData?.TotalItems || 0})
                </span>
              </TabsLineTrigger>
              <TabsLineTrigger
                value="ico"
                disabled={loading}
                className={cn('text-sm px-2', {
                  'cursor-pointer': !loading,
                })}
              >
                ICO
                <span className="text-xs">
                  ({icoPageData?.TotalItems || 0})
                </span>
              </TabsLineTrigger>
            </TabsLineList>
          </div>
        </div>
        <TabsLineContent
          value="link"
          className="flex flex-col gap-y-2 max-w-screen-xl w-full m-auto px-4 py-3 md:px-6"
        >
          <UserLink
            userName={userName}
            loading={loading}
            data={linkPageData}
            setData={setLinkPageData}
          />
        </TabsLineContent>
        <TabsLineContent
          value="temple"
          className="flex flex-col gap-y-2 max-w-screen-xl w-full m-auto px-4 py-3 md:px-6"
        >
          <UserTemple
            userName={userName}
            loading={loading}
            data={templePageData}
            setData={setTemplePageData}
          />
        </TabsLineContent>
        <TabsLineContent
          value="character"
          className="flex flex-col gap-y-2 max-w-screen-xl w-full m-auto px-4 py-3 md:px-6"
        >
          <UserCharacter
            userName={userName}
            loading={loading}
            data={charaPageData}
            setData={setCharaPageData}
          />
        </TabsLineContent>
        <TabsLineContent
          value="ico"
          className="flex flex-col gap-y-2 max-w-screen-xl w-full m-auto px-4 py-3 md:px-6"
        >
          <UserIco
            userName={userName}
            loading={loading}
            data={icoPageData}
            setData={setIcoPageData}
          />
        </TabsLineContent>
      </TabsLine>
    </div>
  );
}
