import { useAppState } from "@/components/app-state-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { useDebounce } from "@/hooks/use-debounce";
import { searchCharacter } from "@/api/character";
import type { CharacterDetail } from "@/api/character";
import { formatInteger, getAvatarUrl } from "@/lib/utils";
import { toast } from "sonner";
import BadgeLevel from "@/components//ui/badge-level";

/**
 * 角色搜索弹窗
 */
export function CharacterSearchDialog() {
  const { state, dispatch } = useAppState();
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<CharacterDetail[]>([]);
  const debouncedSearchTerm = useDebounce(keyword, 1000);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!state.characterSearchDialog.open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    fetchResults();
  }, [debouncedSearchTerm]);

  const fetchResults = async () => {
    try {
      const response = await searchCharacter(debouncedSearchTerm);
      if (response.State !== 0) {
        setSearchResults([]);
        throw new Error(response.Message || "搜索失败");
      }
      setSearchResults(response.Value);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "搜索失败";
      console.error(errMsg);
      toast.error("搜索失败", {
        description: errMsg,
      })
      setSearchResults([]);
    }
  };

  const setOpen = (open: boolean) => {
    dispatch({
      type: "SET_CHARACTER_SEARCH_DIALOG",
      payload: open
    })
  }

  return (
    <CommandDialog open={state.characterSearchDialog.open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="输入角色名称或ID"
        value={keyword}
        onValueChange={setKeyword}
      />
      <CommandList>
        <CommandEmpty>无结果</CommandEmpty>
        <CommandGroup heading="">
          {searchResults.map((character) => (
            <CommandItem key={character.CharacterId} >
              <div
                className="flex flex-row gap-2 w-full"
                onClick={() => {
                  setOpen(false);
                  dispatch({
                    type: "SET_CHARACTER_DRAWER",
                    payload: { open: true, characterId: character.CharacterId }
                  })
                }}
              >
                <Avatar className="size-10 rounded-full">
                  <AvatarImage
                    className="object-cover object-top"
                    src={getAvatarUrl(character.Icon)}
                    alt={character.Name}
                  />
                  <AvatarFallback className="rounded-lg">C</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                  <div className="flex items-center text-sm font-normal">
                    <span className="truncate">
                      #{character.CharacterId}「{character.Name}」
                    </span>
                    <BadgeLevel level={character.Level} zeroCount={character.ZeroCount} />
                  </div>
                  <div className="flex items-center gap-x-2 h-4 text-xs opacity-60">
                    <span className="truncate">
                      活股：{formatInteger(character.UserTotal)}
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
    </CommandDialog >
  )
}