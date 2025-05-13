import type { CharacterDetail } from '@/api/character';
import { searchCharacter } from '@/api/character';
import BadgeLevel from '@/components//ui/badge-level';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from '@/hooks/use-debounce';
import {
  decodeHTMLEntities,
  formatInteger,
  getAvatarUrl,
  isEmpty,
  urlEncode,
} from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * 角色搜索弹窗
 */
export function CharacterSearchDialog({
  container,
}: {
  container?: HTMLElement | null;
}) {
  const {
    characterSearchDialog,
    setCharacterSearchDialog,
    setCharacterDrawer,
    userAssets,
  } = useStore();
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<CharacterDetail[]>([]);
  const debouncedSearchTerm = useDebounce(keyword, 1000);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!characterSearchDialog.open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    fetchResults();
  }, [debouncedSearchTerm, userAssets?.name]);

  /**
   * 处理外部交互兼容问题
   * @param ev
   */
  const handleInteractOutside = (ev: Event) => {
    // 防止在单击toaster时关闭对话框
    const isToastItem = (ev.target as Element)?.closest(
      '[data-sonner-toaster]'
    );
    if (isToastItem) ev.preventDefault();
  };

  const fetchResults = async () => {
    if (isEmpty(userAssets)) return;
    try {
      const response = await searchCharacter(urlEncode(debouncedSearchTerm));
      if (response.State !== 0) {
        setSearchResults([]);
        throw new Error(response.Message || '搜索失败');
      }
      setSearchResults(response.Value);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '搜索失败';
      console.error(errMsg);
      toast.error('搜索失败', {
        description: errMsg,
      });
      setSearchResults([]);
    }
  };

  const setOpen = (open: boolean) => {
    setCharacterSearchDialog({ open });
  };

  return (
    <CommandDialog
      open={characterSearchDialog.open}
      onOpenChange={setOpen}
      contentProps={{
        container,
        onPointerDownOutside: handleInteractOutside,
        onInteractOutside: handleInteractOutside,
      }}
    >
      <CommandInput
        placeholder="输入角色名称或ID"
        value={keyword}
        onValueChange={setKeyword}
      />
      <CommandList>
        <CommandEmpty>无结果</CommandEmpty>
        <CommandGroup heading="">
          {searchResults.map((character) => (
            <CommandItem key={character.CharacterId}>
              <div
                className="flex flex-row gap-2 w-full cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  setCharacterDrawer({
                    open: true,
                    characterId: character.CharacterId,
                  });
                }}
              >
                <Avatar className="size-10 rounded-full">
                  <AvatarImage
                    className="object-cover object-top"
                    src={getAvatarUrl(character.Icon)}
                    alt={decodeHTMLEntities(character.Name)}
                  />
                  <AvatarFallback className="rounded-lg">C</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                  <div className="flex items-center text-sm font-normal">
                    <span className="truncate">
                      #{character.CharacterId}「{decodeHTMLEntities(character.Name)}」
                    </span>
                    <BadgeLevel
                      level={character.Level}
                      zeroCount={character.ZeroCount}
                    />
                  </div>
                  <div className="flex items-center gap-x-2 h-4 text-xs opacity-60">
                    <span className="truncate">
                      持股：{formatInteger(character.UserTotal)}
                    </span>
                    <Separator orientation="vertical" />
                    <span className="truncate">
                      圣殿：{formatInteger(character.Sacrifices)}
                    </span>
                  </div>
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
