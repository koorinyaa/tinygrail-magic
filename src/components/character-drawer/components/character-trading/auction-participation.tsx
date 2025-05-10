import { AuctionItem, getAuctionList } from '@/api/user';
import { InputNumber } from '@/components/input-number';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, formatInteger, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { LoaderCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * 参与竞拍
 */
export function AuctionParticipation() {
  const { userAssets, setUserAssets, characterDrawer, characterDrawerData } =
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
  } = characterDrawerData.tinygrailCharacterData || {};
  // 起拍价
  const { Price: reservePrice = 0 } =
    characterDrawerData.characterDetailData || {};
  // 加载中
  const [loading, setLoading] = useState(false);
  // 拍卖数量
  const [amount, setAmount] = useState(0);
  // 出价
  const [price, setPrice] = useState(Number(reservePrice.toFixed(2)));
  const [currentAuctionInfo, setCurrentAuctionInfo] = useState<AuctionItem>();

  useEffect(() => {
    fetchAuctionList();
  }, [characterId]);

  const fetchAuctionList = async () => {
    if (!characterId) return;

    setLoading(true);
    try {
      const resp = await getAuctionList([characterId]);
      if (resp.State == 0 && resp.Value.length > 0) {
        if (
          resp.Value[0].Id >0 &&
          resp.Value[0].Price > 0 &&
          resp.Value[0].Amount > 0 &&

        ) {
          setCurrentAuctionInfo(resp.Value[0]);
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
            英灵殿数量
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
          }}
          minValue={0}
          className="flex-1"
        />
      </div>
      <div className="flex flex-row items-center h-8 gap-x-1">
        <div className="w-24 text-sm opacity-60">金额</div>
        <div className="flex-1 w-full text-sm">
          ₵{formatCurrency(price * amount)}
        </div>
      </div>
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
          onClick={() => {}}
        >
          <LoaderCircleIcon
            className={cn('-ms-1 animate-spin', { hidden: !loading })}
            size={16}
            aria-hidden="true"
          />
          参与拍卖
        </Button>
        <Button
          variant="secondary"
          disabled={loading}
          className="flex-1 h-8 rounded-full"
          onClick={() => {}}
        >
          <LoaderCircleIcon
            className={cn('-ms-1 animate-spin', { hidden: !loading })}
            size={16}
            aria-hidden="true"
          />
          取消拍卖
        </Button>
      </div>
    </div>
  );
}
