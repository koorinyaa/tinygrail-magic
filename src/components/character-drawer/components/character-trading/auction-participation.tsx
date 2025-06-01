import {
  auctionCharacter,
  AuctionItem,
  cancelAuctionCharacter,
  getAuctionList,
} from '@/api/user';
import { fatchTinygrailCharacterData } from '@/components/character-drawer/service/character';
import { InputNumber } from '@/components/input-number';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { verifyAuth } from '@/lib/auth';
import { cn, formatCurrency, formatInteger, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { HelpCircle, LoaderCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * 参与竞拍
 * @param onClose 关闭回调
 */
export function AuctionParticipation({ onClose }: { onClose: () => void }) {
  const { userAssets, setUserAssets, characterDrawer, characterDrawerData, setCharacterDrawerData } =
    useStore();
  // 账户余额
  const { balance = 0 } = userAssets || {};
  // 角色ID
  const { characterId } = characterDrawer || {};
  const {
    // 参与拍卖人数
    AuctionUsers: auctionUsers = 0,
    // 拍卖数量
    AuctionTotal: auctionTotal = 0,
    // 英灵殿数量
    Total: tinygrailTotal = 0,
    // 起拍价
    Price: reservePrice = 0
  } = characterDrawerData.tinygrailCharacterData || {};
  // 加载中
  const [loading, setLoading] = useState(false);
  // 当前拍卖信息
  const [currentAuctionInfo, setCurrentAuctionInfo] = useState<AuctionItem>();
  // 拍卖数量
  const [amount, setAmount] = useState(0);
  // 出价
  const [price, setPrice] = useState(Math.ceil(reservePrice * 100) / 100 || 0);
  // 锁定金额
  const [lock, setLock] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: <></>,
    isOk: () => {},
  });

  useEffect(() => {
    fetchAuctionList();
  }, [characterId]);

  useEffect(() => {
    if (lock && currentAuctionInfo) {
      setAmount(currentAuctionInfo.Amount);
      setPrice(currentAuctionInfo.Price);
    }
  }, [lock]);

  /**
   * 获取拍卖记录
   */
  const fetchAuctionList = async () => {
    if (!characterId) return;

    setLoading(true);
    try {
      const resp = await getAuctionList([characterId]);
      if (resp.State == 0) {
        if (
          resp.Value.length > 0 &&
          resp.Value[0].Id > 0 &&
          resp.Value[0].Price > 0 &&
          resp.Value[0].Amount > 0
        ) {
          setCurrentAuctionInfo(resp.Value[0]);
          setAmount(resp.Value[0].Amount);
          setPrice(resp.Value[0].Price);
        }
      } else {
        throw new Error(resp.Message || '获取拍卖记录失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取拍卖记录失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 参与竞拍
   */
  const handleAuctionCharacter = async () => {
    if (!characterId) return;

    setLoading(true);
    try {
      // 检查登录状态
      verifyAuth(setUserAssets);

      const resp = await auctionCharacter(characterId, amount, price);
      if (resp.State === 0) {
        toast.success(resp.Value || '参与竞拍成功');

        // 关闭弹窗
        onClose();
        // 更新余额
        verifyAuth(setUserAssets);
        // 更新英灵殿数据
        const tinygrailCharacterData = await fatchTinygrailCharacterData(characterId);
        setCharacterDrawerData({
          tinygrailCharacterData
        })
      } else {
        throw new Error(resp.Message || '参与竞拍失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '参与竞拍失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 取消竞拍
   */
  const handleCancelAuctionCharacter = async () => {
    if (!currentAuctionInfo || !characterId) return;

    setLoading(true);
    try {
      // 检查登录状态
      verifyAuth(setUserAssets);

      const resp = await cancelAuctionCharacter(currentAuctionInfo.Id);
      if (resp.State === 0) {
        toast.success(resp.Value || '取消竞拍成功');

        // 关闭弹窗
        onClose();
        // 更新余额
        verifyAuth(setUserAssets);
        // 更新英灵殿数据
        const tinygrailCharacterData = await fatchTinygrailCharacterData(characterId);
        setCharacterDrawerData({
          tinygrailCharacterData
        })
      } else {
        throw new Error(resp.Message || '参与竞拍失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '取消竞拍失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (alert.show) {
    return (
      <div className="w-full h-fit flex flex-col gap-y-2">
        <div className="flex flex-col space-y-2 text-center">
          <h2 className="text-lg font-semibold">提示</h2>
          <p className="text-sm text-muted-foreground">{alert.message}</p>
        </div>
        <div className="flex flex-row gap-x-2">
          <Button
            className="flex-1 h-8 rounded-full"
            disabled={loading}
            onClick={alert.isOk}
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
              setAlert({
                show: false,
                message: <></>,
                isOk: () => {},
              });
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
    );
  }

  return (
    <div className="w-full h-fit flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-1">
        <div className="flex flex-row gap-2 text-xs">
          <span className="flex-1">
            竞拍人数
            <span className="ml-2 text-green-400 dark:text-green-600">
              {formatInteger(auctionUsers)}
            </span>
          </span>
          <span className="flex-1">
            竞拍数量
            <span className="ml-2 text-green-400 dark:text-green-600">
              {formatInteger(auctionTotal)}
            </span>
          </span>
        </div>
        <div className="flex flex-row items-center justify-between gap-2 text-xs">
          <span className="flex-1">
            底价
            <span className="ml-2 text-green-400 dark:text-green-600">
              ₵{formatCurrency(Math.ceil(reservePrice * 100) / 100 || 0)}
            </span>
          </span>
          <span className="flex-1">
            英灵殿
            <span className="ml-2 text-green-400 dark:text-green-600">
              {formatInteger(tinygrailTotal)}
            </span>
          </span>
        </div>
      </div>
      <div className="flex flex-row items-center h-8 gap-x-1">
        <div className="w-24 text-sm opacity-60">出价</div>
        <InputNumber
          value={price}
          onChange={(value) => {
            setPrice(value ? Number(value.toFixed(2)) : 0);
            if (lock && currentAuctionInfo) {
              const price = value ? Number(value.toFixed(2)) : 0;
              const amount =
                (currentAuctionInfo.Amount * currentAuctionInfo.Price) / price;
              setAmount(Math.ceil(amount) || 0);
            }
          }}
          minValue={0}
          className="flex-1"
        />
      </div>
      <div className="flex flex-row items-center h-8 gap-x-1">
        <div className="w-24 text-sm opacity-60">数量</div>
        <InputNumber
          value={amount}
          onChange={(value) => {
            setAmount(Math.floor(value) || 0);
            if (lock && currentAuctionInfo) {
              const amount = Math.floor(value) || 0;
              const price =
                (currentAuctionInfo.Amount * currentAuctionInfo.Price) / amount;
              setPrice(price ? Number(price.toFixed(2)) : 0);
            }
          }}
          minValue={0}
          className="flex-1"
        />
      </div>
      <div className="flex flex-row items-center h-8 gap-x-1">
        <div className="w-24 text-sm opacity-60">金额</div>
        <div
          className={cn('flex-1 w-full text-sm truncate', {
            'text-red-400 dark:text-red-600':
              price * amount >
              balance +
                (currentAuctionInfo?.Amount || 0) *
                  (currentAuctionInfo?.Price || 0),
          })}
        >
          ₵{formatCurrency(price * amount)}
        </div>
      </div>
      {currentAuctionInfo && (
        <div className="flex flex-row items-center justify-evenly h-8 gap-x-1">
          <div className="flex items-center gap-x-1 w-24 text-sm opacity-60">
            锁定金额
            <Popover>
              <PopoverTrigger>
                <HelpCircle className="size-3 opacity-60 cursor-pointer pointer-events-auto" />
              </PopoverTrigger>
              <PopoverContent
                className="px-3 py-2 w-fit z-100"
                onOpenAutoFocus={(e) => {
                  e.preventDefault();
                }}
              >
                <span className="text-xs">
                  修改出价或数量时尽可能保持总金额不变
                </span>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex-1 flex justify-end">
            <Switch
              checked={lock}
              onCheckedChange={setLock}
              className="cursor-pointer"
            />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-y-1">
        {currentAuctionInfo && (
          <div className="flex flex-row items-center justify-between h-5 gap-x-2 text-xs">
            <span className="opacity-60">已参与竞拍</span>
            <span
              className="ml-1 text-green-400 dark:text-green-600"
              title="数量 / 出价"
            >
              {formatInteger(currentAuctionInfo.Amount)} / ₵
              {formatCurrency(currentAuctionInfo.Price)}
            </span>
          </div>
        )}
        <div className="flex flex-row items-center justify-between h-5 gap-x-2 text-xs">
          <span className="opacity-60">账户余额</span>
          <span className="ml-1 text-green-400 dark:text-green-600">
            ₵{formatCurrency(balance)}
          </span>
        </div>
      </div>
      <div className="flex flex-row gap-x-2">
        <Button
          disabled={loading}
          className="flex-1 h-8 rounded-full"
          onClick={() => {
            // 周六可能收取手续费
            if (currentAuctionInfo && new Date().getDay() === 6) {
              // 手续费
              const fee = Math.max(
                0,
                Number(
                  (
                    (currentAuctionInfo.Amount * currentAuctionInfo.Price -
                      price * amount) *
                    0.2
                  ).toFixed(2)
                )
              );
              if (fee > 0) {
                setAlert({
                  show: true,
                  message: (
                    <span>
                      修改竞拍将收取
                      <span className="mx-2 text-green-400 dark:text-green-600">
                        ₵{formatCurrency(fee)}
                      </span>
                      的手续费，是否继续？
                    </span>
                  ),
                  isOk: handleAuctionCharacter,
                });
              } else {
                handleAuctionCharacter();
              }
            } else {
              handleAuctionCharacter();
            }
          }}
        >
          <LoaderCircleIcon
            className={cn('-ms-1 animate-spin', { hidden: !loading })}
            size={16}
            aria-hidden="true"
          />
          {currentAuctionInfo ? '修改竞拍' : '参与竞拍'}
        </Button>
        {currentAuctionInfo && (
          <Button
            variant="secondary"
            disabled={loading}
            className="flex-1 h-8 rounded-full"
            onClick={() => {
              // 周六可能收取手续费
              if (currentAuctionInfo && new Date().getDay() === 6) {
                // 手续费
                const fee = Math.max(
                  0,
                  Number(
                    (
                      currentAuctionInfo.Amount *
                      currentAuctionInfo.Price *
                      0.2
                    ).toFixed(2)
                  )
                );
                if (fee > 0) {
                  setAlert({
                    show: true,
                    message: (
                      <span>
                        取消竞拍将收取
                        <span className="mx-2 text-green-400 dark:text-green-600">
                          ₵{formatCurrency(fee)}
                        </span>
                        的手续费，是否继续？
                      </span>
                    ),
                    isOk: handleCancelAuctionCharacter,
                  });
                } else {
                  handleCancelAuctionCharacter();
                }
              } else {
                handleCancelAuctionCharacter();
              }
            }}
          >
            <LoaderCircleIcon
              className={cn('-ms-1 animate-spin', { hidden: !loading })}
              size={16}
              aria-hidden="true"
            />
            取消竞拍
          </Button>
        )}
      </div>
    </div>
  );
}
