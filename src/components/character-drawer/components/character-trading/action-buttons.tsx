import { cn } from '@/lib/utils';
import { BadgeCent, History, ReceiptText } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { CharacterDrawerPopover } from '../character-drawer-popover';
import { AuctionHistory } from './auction-history';
import { AuctionParticipation } from './auction-participation';
import { CharacterTransactionHistory } from './character-transaction-history';

/**
 * 操作按钮
 */
export function ActionButtons() {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverContent, setPopoverContent] = useState<ReactNode>(null);

  const buttons = [
    {
      text: '参与竞拍',
      icon: <BadgeCent className="size-3" />,
      onClick: () => {
        setShowPopover(true);
        setPopoverContent(<AuctionParticipation />);
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
                'transition-all duration-300 flex-shrink-0'
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
