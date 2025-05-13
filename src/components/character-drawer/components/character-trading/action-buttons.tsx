import { AuctionItem, getAuctionList } from '@/api/user';
import { cn } from '@/lib/utils';
import { useStore } from '@/store';
import { BadgeCent, History, ReceiptText } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { CharacterDrawerPopover } from '../character-drawer-popover';
import { AuctionHistory } from './auction-history';
import { AuctionParticipation } from './auction-participation';
import { CharacterTransactionHistory } from './character-transaction-history';

/**
 * 操作按钮
 */
export function ActionButtons() {
  const { characterDrawer } = useStore();
  // 角色ID
  const { characterId } = characterDrawer || {};
  const [showPopover, setShowPopover] = useState(false);
  const [popoverContent, setPopoverContent] = useState<ReactNode>(null);
  const [auctionInfo, setAuctionInfo] = useState<AuctionItem>();

  useEffect(() => {
    fetchAuctionList();
  }, [characterId]);

  /**
   * 获取拍卖记录
   */
  const fetchAuctionList = async () => {
    if (!characterId) return;

    try {
      const resp = await getAuctionList([characterId]);
      if (resp.State == 0) {
        if (
          resp.Value.length > 0 &&
          resp.Value[0].Id > 0 &&
          resp.Value[0].Price > 0 &&
          resp.Value[0].Amount > 0
        ) {
          setAuctionInfo(resp.Value[0]);
        } else {
          setAuctionInfo(undefined);
        }
      } else {
        throw new Error(resp.Message || '获取拍卖记录失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取拍卖记录失败';
      console.error(errorMessage);
    }
  };

  const buttons = [
    {
      text: auctionInfo ? '已参与竞拍' : '参与竞拍',
      icon: <BadgeCent className="size-3" />,
      className: auctionInfo
        ? 'bg-green-300 dark:bg-green-700 hover:bg-green-400 dark:hover:bg-green-600'
        : undefined,
      onClick: () => {
        setShowPopover(true);
        setPopoverContent(
          <AuctionParticipation
            onClose={() => {
              setShowPopover(false);
              setPopoverContent(null);
              fetchAuctionList();
            }}
          />
        );
      },
    },
    {
      text: '往期拍卖',
      icon: <History className="size-3" />,
      onClick: () => {
        setShowPopover(true);
        setPopoverContent(<AuctionHistory />);
      },
    },
    {
      text: '角色交易记录',
      icon: <ReceiptText className="size-3" />,
      onClick: () => {
        setShowPopover(true);
        setPopoverContent(<CharacterTransactionHistory />);
      },
    },
  ];

  return (
    <>
      <div className="w-full">
        <div className="w-full flex flex-nowrap gap-1.5 overflow-x-auto px-1 py-0.5 m-scrollbar-none">
          {buttons.map((button, index) => (
            <div
              key={index}
              className={cn(
                'inline-flex items-center justify-center',
                'bg-slate-300/50 dark:bg-slate-700/50 hover:bg-slate-300/80 dark:hover:bg-slate-700/80',
                'text-xs rounded-full first:ml-0 py-1 px-2 cursor-pointer',
                'transition-all duration-300 flex-shrink-0',
                button?.className
              )}
            >
              <span
                className="flex flex-row items-center justify-center gap-1"
                onClick={button.onClick}
              >
                {button.icon}
                {button.text}
              </span>
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
