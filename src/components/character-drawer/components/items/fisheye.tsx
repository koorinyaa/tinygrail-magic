import { CharacterDetail, searchCharacter } from '@/api/character';
import { useFisheye } from '@/api/magic-item';
import { UserCharacterValue } from '@/api/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BadgeLevel from '@/components/ui/badge-level';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { verifyAuth } from '@/lib/auth';
import {
  cn,
  decodeHTMLEntities,
  formatInteger,
  getAvatarUrl,
  notifyError,
  urlEncode,
} from '@/lib/utils';
import { useStore } from '@/store';
import { LoaderCircleIcon, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  fatchTinygrailCharacterData,
  fetchCharacterDetailData,
  fetchCharacterPoolAmount,
  fetchGensokyoCharacterData,
} from '../../service/character';
import { onActiveStockChange, onTemplesChange } from '../../service/user';

/**
 * 鲤鱼之眼
 * @param {() => void} onClose 关闭回调
 */
export function Fisheye({ onClose }: { onClose: () => void }) {
  const {
    userAssets,
    setUserAssets,
    setCharacterDrawer,
    characterDrawerData,
    setCharacterDrawerData,
  } = useStore();
  const { characterDetailData } = characterDrawerData;
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 搜索关键词
  const [keyword, setKeyword] = useState('');
  // 防抖搜索关键词
  const debouncedSearchTerm = useDebounce(keyword, 1000);
  // 搜索结果
  const [searchResults, setSearchResults] = useState<CharacterDetail[]>([]);
  // 上次选择
  const [lastFisheye, setLastFisheye] = useState<CharacterDetail | null>(
    localStorage.getItem('tinygrail-magic:lastFisheye')
      ? (JSON.parse(
          localStorage.getItem('tinygrail-magic:lastFisheye') as string
        ) as CharacterDetail)
      : null
  );
  // 幻想乡角色数据Map
  const [gensokyoCharacterMap, setGensokyoCharacterMap] = useState<{
    [key: number]: UserCharacterValue;
  }>({});
  // 选中角色
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterDetail | null>(null);

  useEffect(() => {
    setCharacterDrawer({
      handleOnly: true,
    });

    if (lastFisheye) {
      updateLastFisheye();
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
  const updateLastFisheye = async () => {
    if (!lastFisheye) return;

    try {
      const characterDetailData = await fetchCharacterDetailData(
        lastFisheye.CharacterId
      );
      if ('Current' in characterDetailData) {
        await getGensokyoCharacterData(lastFisheye.CharacterId);
        setLastFisheye(characterDetailData);
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
        await Promise.all(
          characters.map((character) =>
            getGensokyoCharacterData(character.CharacterId)
          )
        );
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
   * 获取幻想乡角色数据
   * @param {number} characterId 角色ID
   */
  const getGensokyoCharacterData = async (characterId: number) => {
    if (gensokyoCharacterMap[characterId]) return;

    try {
      const gensokyoCharacterData = await fetchGensokyoCharacterData(
        characterId
      );
      setGensokyoCharacterMap((prev) => ({
        ...prev,
        [characterId]: gensokyoCharacterData,
      }));
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : '获取幻想乡角色数据失败';
      notifyError(errMsg);
    }
  };

  /**
   * 使用鲤鱼之眼
   */
  const handleUseFisheye = async () => {
    if (!userAssets || !characterDetailData || !selectedCharacter) return;

    setLoading(true);

    try {
      verifyAuth(setUserAssets);

      const response = await useFisheye(
        characterDetailData.CharacterId,
        selectedCharacter.CharacterId
      );
      if (response.State === 0) {
        toast.success('使用成功', {
          duration: Infinity,
          cancel: {
            label: '关闭',
            onClick: () => {},
          },
          description: response.Value ?? '鲤鱼之眼使用成功',
        });
        onClose();

        // 更新上次选择
        localStorage.setItem(
          'tinygrail-magic:lastFisheye',
          JSON.stringify(selectedCharacter)
        );

        // 圣殿变化更新相关数据
        await onTemplesChange(
          characterDetailData.CharacterId,
          userAssets.name,
          setCharacterDrawerData
        );

        // 如果当前角色是目标角色，则更新角色数据
        if (characterDetailData.CharacterId === selectedCharacter.CharacterId) {
          // 活股变化更新相关数据
          await onActiveStockChange(
            characterDetailData.CharacterId,
            userAssets.name,
            characterDrawerData.currentCharacterUsersPage || 1,
            setCharacterDrawerData
          );

          // 获取幻想乡数据
          const gensokyoCharacterData = await fetchGensokyoCharacterData(
            characterDetailData.CharacterId
          );
          // 获取英灵殿数据
          const tinygrailCharacterData = await fatchTinygrailCharacterData(
            characterDetailData.CharacterId
          );
          // 获取奖池数量
          const characterPoolAmount = await fetchCharacterPoolAmount(
            characterDetailData.CharacterId
          );
          setCharacterDrawerData({
            gensokyoCharacterData,
            tinygrailCharacterData,
            characterPoolAmount,
          });
        }
      } else {
        onClose();
        throw new Error(response.Message || '鲤鱼之眼使用失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '鲤鱼之眼使用失败';
      notifyError(errMsg);
    } finally {
      setLoading(false);
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
        <div className="flex items-center text-xs opacity-60">
          <span className="truncate">
            幻想乡：
            {gensokyoCharacterMap[character.CharacterId]
              ? formatInteger(
                  gensokyoCharacterMap[character.CharacterId]?.Total || 0
                )
              : '???'}
          </span>
        </div>
      </div>
    </div>
  );

  if (selectedCharacter) {
    if (!characterDetailData) return null;

    return (
      <div className="w-full h-fit flex flex-col gap-y-4 items-center">
        <div className="flex flex-col space-y-2 text-center">
          <h2 className="text-lg font-semibold">提示</h2>
          <p className="text-sm text-muted-foreground">
            是否消耗「{characterDetailData.Name}」100点固定资产将「
            {selectedCharacter.Name}」的部分股份转移到英灵殿？
          </p>
        </div>
        <div className="flex-1 flex flex-row w-full gap-x-2">
          <Button
            className="flex-1 h-8 rounded-full"
            disabled={loading}
            onClick={handleUseFisheye}
          >
            <LoaderCircleIcon
              className={cn('-ms-1 animate-spin', { hidden: !loading })}
              size={16}
              aria-hidden="true"
            />
            确定
          </Button>
          <Button
            className="flex-1 h-8 rounded-full"
            variant="secondary"
            disabled={loading}
            onClick={() => {
              setSelectedCharacter(null);
            }}
          >
            <LoaderCircleIcon
              className={cn('-ms-1 animate-spin', { hidden: !loading })}
              size={16}
              aria-hidden="true"
            />
            重新选择
          </Button>
        </div>
      </div>
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
        {lastFisheye && (
          <>
            <p className="text-xs opacity-60 py-2">上次选择</p>
            <div>
              <CharacterItem character={lastFisheye} />
            </div>
          </>
        )}
        <p className="text-xs opacity-60 py-2">请选择鲤鱼之眼的对象</p>
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
