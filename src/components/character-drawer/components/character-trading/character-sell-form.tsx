import { CharacterDepthInfo } from '@/api/character';
import { askCharacter, UserTradingValue } from '@/api/user';
import { InputNumber } from '@/components/input-number';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { verifyAuth } from '@/lib/auth';
import { cn, formatCurrency, formatInteger, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { LoaderCircleIcon } from 'lucide-react';
import { useState } from 'react';
import {
  fatchCharacterDepthData,
  fetchCharacterDetailData,
} from '../../service/character';
import { fatchUserTradingData, onActiveStockChange } from '../../service/user';
import { TradingFormData } from './character-trading';

/**
 * 卖出表单
 * @param props
 * @param props.sellFormData - 卖出表单数据
 * @param props.setSellFormData - 设置卖出表单数据
 * @param props.callback - 回调函数
 */
export function CharacterSellForm({
  sellFormData,
  setSellFormData,
  callback,
}: {
  sellFormData: TradingFormData;
  setSellFormData: (sellFormData: TradingFormData) => void;
  callback: (
    characterDepthData: CharacterDepthInfo,
    userTradingData: UserTradingValue
  ) => void;
}) {
  const {
    userAssets,
    setUserAssets,
    characterDrawer,
    characterDrawerData,
    setCharacterDrawerData,
  } = useStore();
  const { name: userName, balance = 0 } = userAssets || {};
  const { characterId } = characterDrawer;
  const { Total: total = 0, Amount: amount = 0 } =
    characterDrawerData.userCharacterData || {};
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * 卖出
   */
  const onSell = async () => {
    if (
      !userName ||
      !characterId ||
      sellFormData.price <= 0 ||
      sellFormData.amount <= 0
    )
      return;

    setLoading(true);
    try {
      verifyAuth(setUserAssets);

      const result = await askCharacter(
        characterId,
        sellFormData.price,
        sellFormData.amount,
        sellFormData.type === 'iceberg'
      );
      if (result.State === 0) {
        const [userTradingData, characterDepthData, characterDetailData] =
          await Promise.all([
            fatchUserTradingData(characterId),
            fatchCharacterDepthData(characterId),
            fetchCharacterDetailData(characterId),
          ]);

        // 更新相关数据
        callback(characterDepthData, userTradingData);
        setCharacterDrawerData({
          characterDetailData,
        });
        verifyAuth(setUserAssets);
        onActiveStockChange(
          characterId,
          userName,
          characterDrawerData.currentCharacterUsersPage || 1,
          setCharacterDrawerData
        );
      } else {
        throw new Error(result.Message || '交易失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '交易中出现错误';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-row items-center justify-evenly h-9 gap-x-1">
        <div className="w-10 text-sm opacity-60">价格</div>
        <div className="flex-1 w-full">
          <InputNumber
            value={sellFormData.price}
            onChange={(value) => {
              setSellFormData({
                ...sellFormData,
                price: value ? Number(value.toFixed(2)) : 0,
              });
            }}
            minValue={0}
            maxValue={100000}
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-evenly h-9 gap-x-1">
        <div className="w-10 text-sm opacity-60">数量</div>
        <div className="flex-1 w-full">
          <InputNumber
            value={sellFormData.amount}
            onChange={(value) => {
              setSellFormData({
                ...sellFormData,
                amount: Math.floor(value) || 0,
              });
            }}
            minValue={0}
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-evenly h-9 gap-x-1">
        <div className="w-10 text-sm opacity-60">金额</div>
        <div className="flex-1 w-full text-sm">
          ₵{formatCurrency(sellFormData.price * sellFormData.amount)}
        </div>
      </div>
      <div className="flex flex-row items-center justify-evenly h-9 gap-x-1">
        <div className="w-10 text-sm opacity-60">类型</div>
        <div className="flex-1 w-full">
          <Select
            value={sellFormData.type}
            onValueChange={(value) => {
              setSellFormData({
                ...sellFormData,
                type: value as 'default' | 'iceberg',
              });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择订单类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  value="default"
                  className="hover:bg-accent cursor-pointer"
                >
                  普通
                </SelectItem>
                <SelectItem
                  value="iceberg"
                  className="hover:bg-accent cursor-pointer"
                >
                  冰山
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between h-5 p-0.5 gap-2 text-xs">
        <span>
          <span className="opacity-60">持股</span>
          <span className="ml-1 text-green-400 dark:text-green-600">
            {formatInteger(total)}
          </span>
        </span>
        <span>
          <span className="opacity-60">可用</span>
          <span className="ml-1 text-green-400 dark:text-green-600">
            {formatInteger(amount)}
          </span>
        </span>
      </div>
      <div className="flex flex-row items-center justify-between h-5 p-0.5 gap-2 text-xs">
        <span className="opacity-60">账户余额</span>
        <span className="ml-1 text-green-400 dark:text-green-600">
          ₵{formatCurrency(balance)}
        </span>
      </div>
      <Button
        disabled={loading}
        className="w-full h-8 rounded-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-700 dark:hover:bg-sky-600 text-white"
        onClick={onSell}
      >
        <LoaderCircleIcon
          className={cn('-ms-1 animate-spin', { hidden: !loading })}
          size={16}
          aria-hidden="true"
        />
        卖出
      </Button>
    </div>
  );
}
