import { InputNumber } from '@/components/input-number';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  calculateICOInfo,
  formatCurrency,
  formatInteger,
  ICOInfoResult,
} from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useState } from 'react';

/**
 * ICO注资组件
 */
export function IcoInvestment() {
  const { characterDrawer, icoDrawerData, userAssets } = useStore();
  const { icoDetailData, userIcoData } = icoDrawerData;
  const { characterId, loading: drawerLoading = false } = characterDrawer;
  const { Amount: userAmount = 0 } = userIcoData || {};
  const { balance = 0 } = userAssets || {};
  const [icoInfo, setIcoInfo] = useState<ICOInfoResult>();
  const {
    currentLevel = 0,
    realLevel = 0,
    nextAmount = 0,
    minAmount = 0,
    circulation = 0,
    price = 0,
    minPrice = 0,
    userLevel = 0,
  } = icoInfo || {};
  // 注资金额
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (!icoDetailData) return;
    const icoInfo = calculateICOInfo(icoDetailData);
    setIcoInfo(icoInfo);
  }, [icoDetailData]);

  const handleJoinIco = () => {

  }

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex flex-row gap-x-1">
        <InputNumber
          value={amount}
          onChange={(value) => {
            setAmount(value ? Number(value.toFixed(2)) : 0);
          }}
          minValue={5000}
          className="flex-1"
        />
        <Button disabled={drawerLoading} className="h-8">
          注资
        </Button>
      </div>
      <div>
        <Badge
          variant="outline"
          className="rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          下一级
        </Badge>
      </div>
      <div className="flex-1 flex flex-col gap-y-0.5 text-xs truncate opacity-60">
        <div className="flex flex-row items-center justify-between">
          <span>
            已注资
            <span className="text-green-400 dark:text-green-600 mx-1">
              ₵{formatCurrency(userAmount)}
            </span>
          </span>
          <span>
            预计可得
            <span className="text-green-400 dark:text-green-600 mx-1">
              {formatInteger(
                Math.floor(
                  userAmount /
                    (price + 500000 / (10000 + (currentLevel - 1) * 7500))
                )
              )}
            </span>
            股
          </span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span>账户余额</span>
          <span className="text-green-400 dark:text-green-600 mx-1">
            ₵{formatCurrency(balance)}
          </span>
        </div>
      </div>
    </div>
  );