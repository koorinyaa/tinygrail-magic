import { CharacterDepthInfo } from '@/api/character';
import { UserTradingValue } from '@/api/user';
import { fatchUserTradingData } from '@/components/character-drawer/service/user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useState } from 'react';
import { fatchCharacterDepthData } from '../../service/character';
import { ActionButtons } from './action-buttons';
import { CharacterBuyForm } from './character-buy-form';
import { CharacterSellForm } from './character-sell-form';
import { DepthInfo } from './depth-info';
import { UserOrder } from './user-order';

/**
 * 交易表单数据类型
 */
export interface TradingFormData {
  amount: number;
  price: number;
  type: 'default' | 'iceberg';
}

/**
 * 交易
 */
export function CharacterTrading() {
  const isMobile = useIsMobile(448);
  const { characterDrawer, setCharacterDrawer, characterDrawerData } =
    useStore();
  const { characterId } = characterDrawer;
  const { Current: currentPrice = 0 } =
    characterDrawerData.characterDetailData || {};
  const [tabsValue, setTabsValue] = useState<'sell' | 'buy'>('sell');
  // 角色深度数据
  const [depthData, setDepthData] = useState<CharacterDepthInfo>();
  // 用户委托数据
  const [userTradingData, setUserTradingData] = useState<
    UserTradingValue | undefined
  >();
  // 卖出表单数据
  const [sellFormData, setSellFormData] = useState<TradingFormData>({
    amount: 0,
    price: currentPrice,
    type: 'default',
  });
  // 买入表单数据
  const [buyFormData, setBuyFormData] = useState<TradingFormData>({
    amount: 0,
    price: currentPrice,
    type: 'default',
  });

  useEffect(() => {
    initializeData();

    return () => {
      setCharacterDrawer({
        handleOnly: false,
      });
    };
  }, []);

  useEffect(() => {
    setCharacterDrawer({
      handleOnly: isMobile ? false : true,
    });
  }, [isMobile]);

  /**
   * 初始化数据
   */
  const initializeData = async () => {
    if (!characterId) return;

    try {
      const [characterDepthData, userTradingData] = await Promise.all([
        fatchCharacterDepthData(characterId),
        fatchUserTradingData(characterId),
      ]);

      setDepthData(characterDepthData);
      setUserTradingData(userTradingData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '初始化交易信息失败';
      notifyError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col gap-y-2 px-2 bg-card">
      <div className="flex flex-row gap-x-2">
        <div className="flex-1 w-full px-1 overflow-hidden">
          <Tabs
            value={tabsValue}
            onValueChange={(value) => {
              setTabsValue(value as 'sell' | 'buy');
            }}
          >
            <TabsList className="grid w-full grid-cols-2 mb-2 rounded-md">
              <TabsTrigger
                value="sell"
                className={cn(
                  'cursor-pointer text-xs rounded-sm',
                  'data-[state=active]:text-white data-[state=active]:bg-sky-500 dark:data-[state=active]:bg-sky-700'
                )}
              >
                卖出
              </TabsTrigger>
              <TabsTrigger
                value="buy"
                className={cn(
                  'cursor-pointer text-xs rounded-sm',
                  'data-[state=active]:text-white data-[state=active]:bg-pink-500 dark:data-[state=active]:bg-pink-700'
                )}
              >
                买入
              </TabsTrigger>
            </TabsList>
            <TabsContent value="sell">
              <CharacterSellForm
                sellFormData={sellFormData}
                setSellFormData={setSellFormData}
                callback={(characterDepthData, userTradingData) => {
                  setDepthData(characterDepthData);
                  setUserTradingData(userTradingData);
                }}
              />
            </TabsContent>
            <TabsContent value="buy">
              <CharacterBuyForm
                buyFormData={buyFormData}
                setBuyFormData={setBuyFormData}
                callback={(characterDepthData, userTradingData) => {
                  setDepthData(characterDepthData);
                  setUserTradingData(userTradingData);
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
        <DepthInfo
          depthData={depthData}
          setTabsValue={setTabsValue}
          setSellFormData={setSellFormData}
          setBuyFormData={setBuyFormData}
        />
      </div>
      <ActionButtons />
      <UserOrder
        userTradingData={userTradingData}
        callback={(characterDepthData, userTradingData) => {
          setDepthData(characterDepthData);
          setUserTradingData(userTradingData);
        }}
      />
    </div>
  );
}
