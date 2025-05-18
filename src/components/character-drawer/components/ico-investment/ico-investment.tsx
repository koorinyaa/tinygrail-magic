import { joinIco } from '@/api/user';
import {
  fatchIcoUsersPageData,
  fetchCharacterDetailData,
} from '@/components/character-drawer/service/character';
import { InputNumber } from '@/components/input-number';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { verifyAuth } from '@/lib/auth';
import {
  calculateICOInfo,
  formatCurrency,
  formatInteger,
  ICOInfoResult,
  notifyError,
} from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * ICO注资组件
 */
export function IcoInvestment() {
  const {
    characterDrawer,
    icoDrawerData,
    setIcoDrawerData,
    userAssets,
    setUserAssets,
  } = useStore();
  const { icoDetailData, userIcoData, currentICOUsersPage } = icoDrawerData;
  const { characterId, loading: drawerLoading = false } = characterDrawer;
  const { Id: icoId, Total: total = 0 } = icoDetailData || {};
  const { Amount: userAmount = 0 } = userIcoData || {};
  const { name: userName, balance = 0 } = userAssets || {};
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
  const [amount, setAmount] = useState(5000);
  // 加载中
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!icoDetailData) return;
    const icoInfo = calculateICOInfo(icoDetailData);
    setIcoInfo(icoInfo);
  }, [icoDetailData]);

  /**
   * 注资
   */
  const handleJoinIco = async () => {
    if (!userName || !icoId || !characterId || amount <= 0) return;
    setLoading(true);
    try {
      verifyAuth(setUserAssets);

      const result = await joinIco(icoId, amount);
      if (result.State === 0) {
        toast.success('注资成功');

        // 用户ICO数据
        const userIcoData = result.Value;
        // ico用户分页数据
        const icoUsersPageData = await fatchIcoUsersPageData(
          icoId,
          currentICOUsersPage
        );
        // 角色详情数据
        const characterDetailData = await fetchCharacterDetailData(characterId);
        if ('Current' in characterDetailData) return;
        // 更新相关数据
        setIcoDrawerData({
          userIcoData,
          icoUsersPageData,
          icoDetailData: characterDetailData,
        });
      } else {
        throw new Error(result.Message || '注资失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '注资失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
        <Button
          disabled={drawerLoading || loading}
          onClick={handleJoinIco}
          className="h-8"
        >
          注资
        </Button>
      </div>
      <div>
        <Badge
          variant="outline"
          className="rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() => {
            setAmount(Math.max(0, nextAmount - total));
          }}
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
}
