import { CharacterDetail, searchCharacter } from '@/api/character';
import { onTemplesChange } from '@/components/character-drawer/service/user';
import { StarbreakContent } from '@/components/starbreak-content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BadgeLevel from '@/components/ui/badge-level';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import {
    decodeHTMLEntities,
    formatInteger,
    getAvatarUrl,
    notifyError,
    urlEncode,
} from '@/lib/utils';
import { useStore } from '@/store';
import { SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { fetchCharacterDetailData } from '../../service/character';

/**
 * 闪光结晶
 * @param {() => void} onClose 关闭回调
 */
export function Starbreak({ onClose }: { onClose: () => void }) {
  const {
    userAssets,
    setCharacterDrawer,
    characterDrawerData,
    setCharacterDrawerData,
  } = useStore();
  const { characterDetailData, userTempleData } = characterDrawerData;
  // 搜索关键词
  const [keyword, setKeyword] = useState('');
  // 防抖搜索关键词
  const debouncedSearchTerm = useDebounce(keyword, 1000);
  // 搜索结果
  const [searchResults, setSearchResults] = useState<CharacterDetail[]>([]);
  // 上次选择
  const [lastStarbreak, setLastStarbreak] = useState<CharacterDetail | null>(
    localStorage.getItem('tinygrail-magic:lastStarbreak')
      ? (JSON.parse(
          localStorage.getItem('tinygrail-magic:lastStarbreak') as string
        ) as CharacterDetail)
      : null
  );
  // 选中角色
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterDetail | null>(null);

  useEffect(() => {
    setCharacterDrawer({
      handleOnly: true,
    });

    if (lastStarbreak) {
      updateLastStarbreak();
    }

    return () => {
      setCharacterDrawer({
        handleOnly: false,
      });
    };
  }, []);

  useEffect(() => {
    handleSearch();
  }, [debouncedSearchTerm]);

  /**
   * 更新上次选择角色信息
   */
  const updateLastStarbreak = async () => {
    if (!userAssets || !lastStarbreak) return;

    try {
      const characterDetailData = await fetchCharacterDetailData(
        lastStarbreak.CharacterId
      );
      if ('Current' in characterDetailData) {
        setLastStarbreak(characterDetailData);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '获取角色详情失败';
      notifyError(errMsg);
    }
  };

  /**
   * 搜索角色
   */
  const handleSearch = async () => {
    try {
      const response = await searchCharacter(urlEncode(debouncedSearchTerm));
      if (response.State === 0) {
        const characters = response.Value.slice(0, 5);
        setSearchResults(characters);
      } else {
        throw new Error(response.Message || '搜索失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '搜索失败';
      notifyError(errMsg);
    }
  };

  /**
   * 角色项
   * @param {CharacterDetail} character 角色详情
   */
  const CharacterItem = ({ character }: { character: CharacterDetail }) => (
    <div
      key={character.CharacterId}
      className="flex flex-row gap-x-1.5 p-1 hover:bg-accent rounded-sm cursor-pointer"
      onClick={() => {
        setSelectedCharacter(character);
      }}
    >
      <div>
        <Avatar className="size-8 rounded-full">
          <AvatarImage
            className="object-cover object-top"
            src={getAvatarUrl(character.Icon)}
            alt={decodeHTMLEntities(character.Name)}
          />
          <AvatarFallback className="rounded-lg">C</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center text-xs font-semibold">
          <span className="truncate">
            #{character.CharacterId}「{decodeHTMLEntities(character.Name)}」
          </span>
          <BadgeLevel level={character.Level} zeroCount={character.ZeroCount} />
        </div>
        <div className="flex items-center gap-x-2 h-4 text-xs opacity-60">
          <span className="truncate">
            星之力：{formatInteger(character.StarForces)}
          </span>
        </div>
      </div>
    </div>
  );

  if (selectedCharacter) {
    if (!characterDetailData || !userTempleData || !userAssets) return null;

    return (
      <StarbreakContent
        characterData={{
          id: selectedCharacter.CharacterId,
          name: selectedCharacter.Name,
          avatar: selectedCharacter.Icon,
          level: selectedCharacter.Level,
          starForces: selectedCharacter.StarForces,
        }}
        templeData={{
          ...userTempleData,
          CharacterLevel: characterDetailData.Level,
        }}
        onCancel={() => {
          setSelectedCharacter(null);
        }}
        onOk={async (count: number) => {
          toast.success('使用成功', {
            duration: Infinity,
            cancel: {
              label: '关闭',
              onClick: () => {},
            },
            description: `共执行${count}次攻击`,
          });
          onClose();

          // 更新上次选择
          localStorage.setItem(
            'tinygrail-magic:lastStarbreak',
            JSON.stringify(selectedCharacter)
          );

          // 圣殿变化更新相关数据
          await onTemplesChange(
            characterDetailData.CharacterId,
            userAssets.name,
            setCharacterDrawerData
          );
        }}
      />
    );
  }

  return (
    <div className="w-full h-fit flex flex-col">
      <div className="*:not-first:mt-2">
        <div className="relative">
          <Input
            className="ps-9 pe-9 text-base"
            placeholder="搜索角色"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <SearchIcon size={16} />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {lastStarbreak && (
          <>
            <p className="text-xs opacity-60 py-2">上次选择</p>
            <div>
              <CharacterItem character={lastStarbreak} />
            </div>
          </>
        )}
        <p className="text-xs opacity-60 py-2">请选择闪光结晶攻击的目标</p>
        <div className="flex flex-col">
          {searchResults.map((character) => {
            return (
              <CharacterItem
                key={character.CharacterId}
                character={character}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
