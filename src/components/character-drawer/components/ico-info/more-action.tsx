import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useStore } from '@/store';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';

/**
 * 更多操作
 */
export function MoreAction() {
  const { characterDrawer } = useStore();
  const { characterId = 0 } = characterDrawer;
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState<boolean>(false);

  const menus = [
    {
      label: 'fuyuake',
      onClick: () => {
        window.open(`https://fuyuake.top/xsb/chara/${characterId}`);
      },
    },
  ];

  return (
    <DropdownMenu
      open={dropdownMenuOpen && characterDrawer.open}
      onOpenChange={setDropdownMenuOpen}
    >
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            'absolute right-0 top-0',
            'p-2 rounded-full cursor-pointer',
            'hover:bg-gray-200 dark:hover:bg-gray-700',
            'transition-all duration-300'
          )}
        >
          <EllipsisVertical className="size-4" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {menus.map((menu, index) => (
          <DropdownMenuItem
            key={index}
            className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            onClick={menu.onClick}
          >
            {menu.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
