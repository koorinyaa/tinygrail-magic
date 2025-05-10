import { CharacterDepthInfo } from '@/api/character';
import { cn, formatCurrency, formatInteger } from '@/lib/utils';
import { TradingFormData } from './character-trading';

/**
 * 深度信息
 * @param props
 * @param props.depthData 角色深度数据
 */
export function DepthInfo({
  depthData,
  setTabsValue,
  setSellFormData,
  setBuyFormData,
}: {
  depthData: CharacterDepthInfo | undefined;
  setTabsValue: (value: 'sell' | 'buy') => void;
  setSellFormData: (sellFormData: TradingFormData) => void;
  setBuyFormData: (buyFormData: TradingFormData) => void;
}) {
  const { Asks = [], Bids = [] } = depthData || {};

  return (
    <div className="flex flex-col w-2/5 min-w-30 h-fit text-xs">
      <div className="flex justify-between h-5 p-0.5 opacity-60">
        <div>价格</div>
        <div>数量</div>
      </div>
      <div className="flex flex-col w-full divide-y divide-card">
        {Asks.slice()
          .reverse()
          .map((ask, index) => {
            if (ask.Amount <= 0) return;
            return (
              <div
                key={index}
                className={cn(
                  'flex items-center justify-between h-5 py-0.5 px-1',
                  'bg-sky-200 hover:bg-sky-300 text-sky-500 hover:text-sky-600',
                  'cursor-pointer transition-all'
                )}
                onClick={() => {
                  if (ask.Type !== 1) {
                    setBuyFormData({
                      price: ask.Price,
                      amount: ask.Amount,
                      type: 'default',
                    });
                    setTabsValue('buy');
                  } else {
                    setTabsValue('buy');
                  }
                }}
              >
                <div>
                  {ask.Type === 1 ? '₵--' : `₵${formatCurrency(ask.Price)}`}
                </div>
                <div>{formatInteger(ask.Amount)}</div>
              </div>
            );
          })}
        {Bids.map((bid, index) => {
          if (bid.Amount <= 0) return;
          return (
            <div
              key={index}
              className={cn(
                'flex items-center justify-between h-5 py-0.5 px-1',
                'bg-pink-200 hover:bg-pink-300 text-pink-500 hover:text-pink-600',
                'cursor-pointer transition-all'
              )}
              onClick={() => {
                if (bid.Type !== 1) {
                  setSellFormData({
                    price: bid.Price,
                    amount: bid.Amount,
                    type: 'default',
                  });
                  setTabsValue('sell');
                } else {
                  setTabsValue('sell');
                }
              }}
            >
              <div>
                {bid.Type === 1 ? '₵--' : `₵${formatCurrency(bid.Price)}`}
              </div>
              <div>{formatInteger(bid.Amount)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
