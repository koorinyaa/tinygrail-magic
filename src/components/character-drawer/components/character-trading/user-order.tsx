import { CharacterDepthInfo } from '@/api/character';
import { cancelAskOrder, cancelBidOrder, UserTradingValue } from '@/api/user';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { verifyAuth } from '@/lib/auth';
import {
  cn,
  formatCurrency,
  formatDateTime,
  formatInteger,
  isEmpty,
  notifyError,
} from '@/lib/utils';
import { useStore } from '@/store';
import { ArrowLeftRight, LoaderCircleIcon, NotepadText } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  fatchCharacterDepthData,
  fetchCharacterDetailData,
} from '../../service/character';
import {
  fatchUserTradingData,
  fetchUserCharacterData,
} from '../../service/user';
import { CharacterDrawerPopover } from '../character-drawer-popover';

/**
 * 用户委托
 * @param props
 * @param props.userTradingData 用户委托数据
 */
export function UserOrder({
  userTradingData,
  callback,
}: {
  userTradingData: UserTradingValue | undefined;
  callback: (
    characterDepthData: CharacterDepthInfo,
    userTradingData: UserTradingValue
  ) => void;
}) {
  const { userAssets, setUserAssets, characterDrawer, setCharacterDrawerData } =
    useStore();
  const { name: userName } = userAssets || {};
  const { characterId } = characterDrawer;
  const [showPopover, setShowPopover] = useState(false);
  const [popoverData, setPopoverData] = useState<{
    onOk: () => void;
    orderContent: JSX.Element;
  }>({
    onOk: () => {},
    orderContent: <></>,
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [historyOrderType, setHistoryOrderType] = useState<'ask' | 'bid'>(
    'ask'
  );

  /**
   * 弹出框打开状态改变
   * @param open
   */
  const onPopoverOpenChange = (open: boolean) => {
    if (open) {
      setShowPopover(true);
    } else {
      setShowPopover(false);
      setPopoverData({
        onOk: () => {},
        orderContent: <></>,
      });
    }
  };

  /**
   * 取消委托
   * @param orederId 委托id
   * @param type 委托类型
   */
  const handleCancelOrder = async (orederId: number, type: 'ask' | 'bid') => {
    if (!characterId || !userName) return;

    setLoading(true);

    try {
      verifyAuth(setUserAssets);

      const result =
        type === 'ask'
          ? await cancelAskOrder(orederId)
          : await cancelBidOrder(orederId);
      if (result.State === 0) {
        toast.success('取消成功');
        onPopoverOpenChange(false);

        // 更新相关数据
        const [
          userTradingData,
          characterDepthData,
          characterDetailData,
          userCharacterData,
        ] = await Promise.all([
          fatchUserTradingData(characterId),
          fatchCharacterDepthData(characterId),
          fetchCharacterDetailData(characterId),
          fetchUserCharacterData(characterId, userName),
        ]);

        // 更新相关数据
        callback(characterDepthData, userTradingData);
        setCharacterDrawerData({
          characterDetailData,
          userCharacterData,
        });
        verifyAuth(setUserAssets);
      } else {
        throw new Error(result.Message || '取消委托失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '取消委托失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-2 w-full p-2 min-h-60 bg-slate-200/50 dark:bg-slate-800/60 rounded-sm">
      <div className="flex flex-row">
        <div className="flex-1 flex flex-row gap-2">
          <Badge
            variant="outline"
            className={cn(
              'rounded-sm cursor-pointer',
              'hover:bg-slate-200 dark:hover:bg-slate-700',
              {
                'bg-primary/90 hover:bg-primary/90 dark:hover:bg-primary/90 text-primary-foreground':
                  activeTab === 'current',
              }
            )}
            onClick={() => {
              setActiveTab('current');
            }}
          >
            当前委托
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              'rounded-sm cursor-pointer',
              'border-slate-300 dark:border-slate-700',
              'hover:bg-slate-200 dark:hover:bg-slate-700',
              {
                'bg-primary/90 hover:bg-primary/90 dark:hover:bg-primary/90 text-primary-foreground':
                  activeTab === 'history',
              }
            )}
            onClick={() => {
              setActiveTab('history');
            }}
          >
            历史委托
          </Badge>
        </div>
        <div
          className={cn(
            'flex flex-row items-center gap-x-0.5 px-1 text-xs opacity-60 hover:opacity-80 cursor-pointer transition-all',
            {
              hidden: activeTab !== 'history',
            }
          )}
          onClick={() => {
            setHistoryOrderType(historyOrderType === 'ask' ? 'bid' : 'ask');
          }}
        >
          <ArrowLeftRight className="size-3" />
          {historyOrderType === 'ask' ? '卖出' : '买入'}
        </div>
      </div>
      <div
        className={cn('flex-1 flex', {
          hidden: activeTab !== 'current',
        })}
      >
        <div
          className={cn('flex-1 flex flex-row', {
            hidden:
              isEmpty(userTradingData?.Asks) && isEmpty(userTradingData?.Bids),
          })}
        >
          <div className="flex-1 flex flex-col text-xs divide-y divide-slate-200/50 dark:divide-slate-800/60">
            {userTradingData?.Bids.map((bid, index) => {
              console.log(bid);
              if (bid.Amount <= 0) return;
              return (
                <div
                  key={index}
                  className={cn(
                    'flex items-center py-0.5 px-1',
                    'bg-pink-200 hover:bg-pink-300 text-pink-500 hover:text-pink-600',
                    'cursor-pointer transition-all'
                  )}
                  onClick={() => {
                    onPopoverOpenChange(true);
                    setPopoverData({
                      onOk: () => {
                        handleCancelOrder(bid.Id, 'bid');
                      },
                      orderContent: (
                        <div className="flex items-center py-0.5 px-1 w-4/5 h-5 bg-pink-200 text-pink-500">
                          <div className="flex-1 text-left text-xs">
                            {formatCurrency(bid.Price)} /{' '}
                            {formatInteger(bid.Amount)} / -
                            {formatInteger(bid.Amount * bid.Price)}
                            {bid.Type === 1 ? ' [i]' : ''}
                          </div>
                        </div>
                      ),
                    });
                  }}
                >
                  <div className="flex-1" title="买入委托：金额 / 数量 / 合计">
                    {formatCurrency(bid.Price)} / {formatInteger(bid.Amount)} /
                    -{formatCurrency(bid.Amount * bid.Price)}
                    {bid.Type === 1 ? ' [i]' : ''}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex-1 flex flex-col text-xs divide-y divide-slate-200 dark:divide-slate-800">
            {userTradingData?.Asks.map((ask, index) => {
              if (ask.Amount <= 0) return;
              return (
                <div
                  key={index}
                  className={cn(
                    'flex items-center py-0.5 px-1',
                    'bg-sky-200 hover:bg-sky-300 text-sky-500 hover:text-sky-600',
                    'cursor-pointer transition-all'
                  )}
                  onClick={() => {
                    onPopoverOpenChange(true);
                    setPopoverData({
                      onOk: () => {
                        handleCancelOrder(ask.Id, 'ask');
                      },
                      orderContent: (
                        <div className="flex items-center py-0.5 px-1 w-4/5 h-5 bg-sky-200 text-sky-500">
                          <div className="flex-1 text-left text-xs">
                            {formatCurrency(ask.Price)} /{' '}
                            {formatInteger(ask.Amount)} / -
                            {formatCurrency(ask.Amount * ask.Price)}
                            {ask.Type === 1 ? ' [i]' : ''}
                          </div>
                        </div>
                      ),
                    });
                  }}
                >
                  <div className="flex-1" title="卖出委托：金额 / 数量 / 合计">
                    {formatCurrency(ask.Price)} / {formatInteger(ask.Amount)} /
                    +{formatCurrency(ask.Amount * ask.Price)}
                    {ask.Type === 1 ? ' [i]' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className={cn(
            'flex-1 flex flex-col items-center justify-center gap-y-1 opacity-60',
            {
              hidden:
                !isEmpty(userTradingData?.Asks) ||
                !isEmpty(userTradingData?.Bids),
            }
          )}
        >
          <NotepadText className="size-12" />
          <span className="text-sm">暂无数据</span>
        </div>
        <CharacterDrawerPopover
          open={showPopover}
          onOpenChange={onPopoverOpenChange}
          className="flex justify-center"
        >
          <div className="w-full h-fit flex flex-col gap-y-4">
            <div className="flex flex-col space-y-2 text-center">
              <h2 className="text-lg font-semibold">提示</h2>
              <p className="text-sm text-muted-foreground">是否取消委托？</p>
              <div className="flex items-center justify-center">
                {popoverData.orderContent}
              </div>
            </div>
            <div className="flex flex-row gap-x-2">
              <Button
                className="flex-1 h-8 rounded-full"
                disabled={loading}
                onClick={popoverData.onOk}
              >
                <LoaderCircleIcon
                  className={cn('-ms-1 animate-spin', { hidden: !loading })}
                  size={16}
                  aria-hidden="true"
                />
                确定
              </Button>
              <Button
                className="flex-1 h-8 rounded-full"
                variant="secondary"
                disabled={loading}
                onClick={() => {
                  onPopoverOpenChange(false);
                }}
              >
                <LoaderCircleIcon
                  className={cn('-ms-1 animate-spin', { hidden: !loading })}
                  size={16}
                  aria-hidden="true"
                />
                取消
              </Button>
            </div>
          </div>
        </CharacterDrawerPopover>
      </div>
      <div
        className={cn('flex flex-row', {
          hidden: activeTab !== 'history',
        })}
      >
        <Table className="text-xs">
          <TableHeader className="bg-transparent">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-6 px-1">价格</TableHead>
              <TableHead className="h-6 px-1">数量</TableHead>
              <TableHead className="h-6 px-1">总计</TableHead>
              <TableHead className="h-6 px-1 text-right">交易时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
            {(historyOrderType === 'ask'
              ? userTradingData?.AskHistory ?? []
              : userTradingData?.BidHistory ?? []
            )
              .slice()
              .reverse()
              .map((item) => (
                <TableRow key={item.Id} className="border-none">
                  <TableCell className="p-1">
                    {formatCurrency(item.Price)}
                  </TableCell>
                  <TableCell className="p-1">
                    {formatInteger(item.Amount)}
                  </TableCell>
                  <TableCell className="flex p-1">
                    {historyOrderType === 'ask' ? '+' : '-'}
                    {formatCurrency(item.Price * item.Amount)}
                  </TableCell>
                  <TableCell className="p-1 text-right">
                    {formatDateTime(item.TradeTime, 'simple')}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
