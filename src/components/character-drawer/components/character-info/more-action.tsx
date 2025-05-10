import { updateCharacter } from '@/api/character';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { fetchCharacterDetailData } from '../../service/character';

/**
 * 更多操作
 */
export function MoreAction() {
  const { characterDrawer, characterDrawerData, setCharacterDrawerData } =
    useStore();
  const { CharacterId: characterId = 0 } =
    characterDrawerData.characterDetailData || {};
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState<boolean>(false);

  /**
   * 更新角色信息
   */
  const updateCharacterInfo = async () => {
    try {
      const resp = await updateCharacter(characterId);
      if (resp.State === 0) {
        toast.success('同步成功', {
          description: resp.Value,
        });
        fetchCharacterDetailData(characterId).then((characterDetailData) => {
          setCharacterDrawerData({
            characterDetailData,
          });
        });
      } else {
        throw new Error(resp.Message || '角色信息同步失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '角色信息同步失败';
      notifyError(errMsg);
    }
  };

  const menus = [
    {
      label: '同步角色名称',
      onClick: updateCharacterInfo,
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
